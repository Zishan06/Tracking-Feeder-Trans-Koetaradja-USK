const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

// Konfigurasi Database
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'uji',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use(cors());
app.use(express.json());

// ==================== ENDPOINT UTAMA ====================
app.get('/api/find-route', async (req, res) => {
  try {
    const { from, to, time } = req.query;
    
    // 1. Dapatkan urutan halte
    const [halte] = await pool.query(`
      SELECT * FROM halte 
      WHERE id_rute = 'RT001' 
      ORDER BY urutan
    `);

    // 2. Cari posisi halte awal dan akhir
    const fromIndex = halte.findIndex(h => h.id_halte === from);
    const toIndex = halte.findIndex(h => h.id_halte === to);

    if (fromIndex === -1 || toIndex === -1) {
      return res.status(404).json({ error: 'Halte tidak ditemukan' });
    }

    // 3. Tentukan rute berdasarkan urutan
    let route = [];
    if (fromIndex <= toIndex) {
      // Rute langsung
      route = halte.slice(fromIndex, toIndex + 1).map(h => h.id_halte);
    } else {
      // Rute melalui sirkular (HT014 -> HT001)
      route = [
        ...halte.slice(fromIndex),
        ...halte.slice(0, toIndex + 1)
      ].map(h => h.id_halte);
    }

    // 4. Hitung total waktu
    const [jalur] = await pool.query('SELECT * FROM jalur');
    let totalTime = 0;
    
    for (let i = 0; i < route.length - 1; i++) {
      const edge = jalur.find(j => 
        j.id_halte_awal === route[i] && 
        j.id_halte_akhir === route[i + 1]
      );
      if (!edge) {
        return res.status(404).json({ error: 'Jalur tidak lengkap' });
      }
      totalTime += edge.waktu;
    }

    // 5. Cari bus yang tersedia
    const [schedules] = await pool.query(`
      SELECT j.*, b.status_bus 
      FROM jadwal j
      JOIN bus b ON j.kd_bus = b.kd_bus
      WHERE j.id_halte = ? 
        AND j.hari = 'Senin'
        AND j.waktu >= ?
      ORDER BY j.waktu
      LIMIT 3
    `, [from, time || '00:00:00']);

    res.json({
      route,
      total_time: `${totalTime} menit`,
      next_buses: schedules.map(s => ({
        bus: s.kd_bus,
        waktu: s.waktu.slice(0, 5),
        estimasi_sampai: calculateArrivalTime(s.waktu, totalTime)
      }))
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function calculateArrivalTime(departure, duration) {
  const [h, m] = departure.split(':');
  const date = new Date();
  date.setHours(h, m, 0);
  date.setMinutes(date.getMinutes() + duration);
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
}



// ==================== PENCARIAN RUTE ====================
app.get('/api/routes', async (req, res) => {
  try {
    const { from, to, day, time } = req.query;
    
    // Validasi input
    if (!from || !to || !day) {
      return res.status(400).json({ error: 'Parameter from, to, dan day wajib' });
    }

    // Inisialisasi/update graf
    const now = Date.now();
    if (!routeGraph || !lastGraphUpdate || (now - lastGraphUpdate) > 300000) {
      const [jalur] = await pool.query('SELECT * FROM jalur');
      routeGraph = new OptimizedGraph();
      
      jalur.forEach(j => {
        if (j.waktu > 0) { // Pastikan weight valid
          routeGraph.addEdge(j.id_halte_awal, j.id_halte_akhir, j.waktu);
        }
      });
      
     
    }

    // ✅ PERBAIKAN DI SINI: Gunakan routeGraph, bukan graph
    const result = await routeGraph.dijkstra(from, to);
    if (!result) return res.status(404).json({ error: 'Rute tidak ditemukan' });

    // Ambil jadwal bus
    const schedules = [];
    for (const halte of result.path.slice(0, -1)) {
      const [s] = await pool.query(
        `SELECT j.*, b.status_bus 
         FROM jadwal j
         JOIN bus b ON j.kd_bus = b.kd_bus
         WHERE j.id_halte = ? AND j.hari = ? 
         ${time ? 'AND j.waktu >= ?' : ''}
         ORDER BY j.waktu LIMIT 1`,
        [halte, day, ...(time ? [time] : [])]
      );
      if (s.length) schedules.push(s[0]);
    }

    res.json({
      path: result.path,
      total_time: `${result.time} menit`,
      schedules
    });
    
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      details: err.message 
    });
  }
});
//=============================MODE ATMIN===============================member dilarang masuk!
const isAdmin = (req) => {
  return req.query.secret === 'iqankerapu'; // Ganti dengan kode rahasia
};

// Endpoint CRUD hanya untuk admin
app.post('/api/admin/haltes', async (req, res) => {//------------------------HALTE
  if(!isAdmin(req)) return res.status(403).json({ error: 'Akses ditolak' });
  try {
    const { id_halte, nama_halte, id_rute, urutan } = req.body;
    
    if(!id_halte || !nama_halte || !id_rute || !urutan) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    const [result] = await pool.query(
      'INSERT INTO halte SET ?',
      { id_halte, nama_halte, id_rute, urutan }
    );
    
    res.status(201).json({ message: 'Halte created', id: id_halte });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/haltes/:id', async (req, res) => {
  if(!isAdmin(req)) return res.status(403).json({ error: 'Akses ditolak' });
  try {
    const { nama_halte, id_rute, urutan } = req.body;
    const [result] = await pool.query(
      'UPDATE halte SET ? WHERE id_halte = ?',
      [{ nama_halte, id_rute, urutan }, req.params.id]
    );
    
    result.affectedRows 
      ? res.json({ message: 'Halte updated' })
      : res.status(404).json({ error: 'Halte tidak ditemukan' });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/haltes/:id', async (req, res) => {
  if(!isAdmin(req)) return res.status(403).json({ error: 'Akses ditolak' });
  try {
    const [result] = await pool.query(
      'DELETE FROM halte WHERE id_halte = ?',
      [req.params.id]
    );
    
    result.affectedRows 
      ? res.json({ message: 'Halte deleted' })
      : res.status(404).json({ error: 'Halte tidak ditemukan' });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/schedules', async (req, res) => {//----------------------------JADWAL
  if(!isAdmin(req)) return res.status(403).json({ error: 'Akses ditolak' });
  try {
    const { id_jadwal, hari, waktu, kd_bus, id_rute, id_halte } = req.body;
    
    if(!id_jadwal || !hari || !waktu || !kd_bus || !id_rute || !id_halte) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    const [result] = await pool.query(
      'INSERT INTO jadwal SET ?',
      { id_jadwal, hari, waktu, kd_bus, id_rute, id_halte }
    );
    
    res.status(201).json({ message: 'Jadwal created', id: id_jadwal });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/schedules/:id', async (req, res) => {
  if(!isAdmin(req)) return res.status(403).json({ error: 'Akses ditolak' });
  try {
    const [result] = await pool.query(
      'DELETE FROM jadwal WHERE id_jadwal = ?',
      [req.params.id]
    );
    
    result.affectedRows 
      ? res.json({ message: 'Jadwal deleted' })
      : res.status(404).json({ error: 'Jadwal tidak ditemukan' });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/buses', async (req, res) => {//----------------------------------BUS
  if(!isAdmin(req)) return res.status(403).json({ error: 'Akses ditolak' });
  try {
    const { kd_bus, status_bus } = req.body;
    
    if(!kd_bus || !status_bus) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    const [result] = await pool.query(
      'INSERT INTO bus SET ?',
      { kd_bus, status_bus }
    );
    
    res.status(201).json({ message: 'Bus created', id: kd_bus });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Pre-warm connection pool
  Promise.all([
    pool.query('SELECT 1'),
    pool.query('SELECT 1'),
    pool.query('SELECT 1')
  ]).then(() => console.log('✅ Database connection ready'))
    .catch(err => console.error('❌ Database connection failed:', err));
});
