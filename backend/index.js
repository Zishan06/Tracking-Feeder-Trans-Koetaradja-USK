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

//=========================CEK JADWAL=====================
app.get('/api/schedules/active', async (req, res) => {
  try {
    const { time, day } = req.query;
    
    // Validasi input
    if (!time || !day) {
      return res.status(400).json({ error: 'Parameter time dan day wajib' });
    }

    // Format waktu (HH:MM)
    const [hours, minutes] = time.split(':');
    const timeFormatted = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;

    // Mapping hari: Selasa-Jumat diperlakukan sebagai Senin
    const normalizedDay = ['Selasa', 'Rabu', 'Kamis', 'Jumat'].includes(day) 
      ? 'Senin' 
      : day;

    // Query database
    const [schedules] = await pool.query(`
      SELECT 
        j.id_jadwal,
        j.hari,
        j.waktu,
        j.kd_bus,
        j.id_halte,
        h.nama_halte,
        b.status_bus
      FROM jadwal j
      JOIN halte h ON j.id_halte = h.id_halte
      JOIN bus b ON j.kd_bus = b.kd_bus
      WHERE j.hari = ?
        AND j.waktu BETWEEN ? AND ?
      ORDER BY j.waktu
    `, [normalizedDay, timeFormatted, `${hours}:${minutes}:59`]);

    res.json({
      time,
      day: normalizedDay, // Kembalikan hari yang dinormalisasi
      active_schedules: schedules.map(s => ({
        bus: s.kd_bus,
        waktu: s.waktu.slice(0, 5), // Format HH:MM
        halte: s.nama_halte,
        status: s.status_bus
      }))
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//=====================UNTUK TAU ESTIMASI KEDATANGAN BUS DI HALTE A===========
async function calculateETA(busSchedule, targetHalteId) {
  try {
    // 1. Dapatkan rute bus (RT001 atau RT002)
    const [routeHalte] = await pool.query(
      `SELECT id_halte FROM halte 
       WHERE id_rute = ? 
       ORDER BY urutan`,
      [busSchedule.id_rute]
    );
    const routeHalteIds = routeHalte.map(h => h.id_halte);

    // 2. Cari posisi bus saat ini (halte terakhir yang dilewati)
    const [lastPassed] = await pool.query(
      `SELECT id_halte FROM bus_positions 
       WHERE kd_bus = ? 
       ORDER BY timestamp DESC LIMIT 1`,
      [busSchedule.kd_bus]
    );
    
    const currentHalteId = lastPassed.length 
      ? lastPassed[0].id_halte 
      : busSchedule.id_halte;

    // 3. Cari indeks halte saat ini dan target
    const currentIndex = routeHalteIds.indexOf(currentHalteId);
    const targetIndex = routeHalteIds.indexOf(targetHalteId);

    if (currentIndex === -1 || targetIndex === -1) {
      return null; // Halte tidak valid untuk rute ini
    }

    // 4. Hitung total waktu perjalanan
    let totalTime = 0;
    let nextIndex = currentIndex;

    // Handle rute sirkular (jika bus sudah di akhir rute)
    if (currentIndex === routeHalteIds.length - 1) {
      nextIndex = 0; // Kembali ke halte pertama
      totalTime += 10; // Waktu dari HT014 ke HT001
    }

    // Hitung waktu dari posisi saat ini ke target
    while (nextIndex !== targetIndex) {
      const currentHalte = routeHalteIds[nextIndex];
      const nextHalte = routeHalteIds[(nextIndex + 1) % routeHalteIds.length];
      
      const [jalur] = await pool.query(
        `SELECT waktu FROM jalur 
         WHERE id_halte_awal = ? AND id_halte_akhir = ?`,
        [currentHalte, nextHalte]
      );
      
      totalTime += jalur[0].waktu;
      nextIndex = (nextIndex + 1) % routeHalteIds.length;
    }

    return totalTime;

  } catch (err) {
    console.error('Error in calculateETA:', err);
    return null;
  }
}

// Endpoint yang sudah diperbaiki
// Perbaikan endpoint /api/bus/eta di index.js
app.get('/api/bus/eta', async (req, res) => {
  try {
    const { halteId } = req.query;
    if (!halteId) {
      return res.status(400).json({ error: 'Parameter halteId wajib' });
    }

    function mapDayNameOverride(date = new Date()) {
      const day = date.getDay(); // 0 = Minggu, 6 = Sabtu
      if (day === 6) return 'Sabtu';
      if (day === 0) return null; // Minggu diabaikan
      return 'Senin'; // Senin sampai Jumat dianggap Senin
    }

    // Ambil semua jadwal yang masih aktif hari ini
    const hariMap = mapDayNameOverride();
    if (!hariMap) return res.json({ message: 'Tidak ada layanan bus di hari Minggu' });

    const [candidates] = await pool.query(`
      SELECT j.*, b.status_bus, h.id_rute
      FROM jadwal j
      JOIN bus b ON j.kd_bus = b.kd_bus
      JOIN halte h ON j.id_halte = h.id_halte
      WHERE j.hari = ? AND j.waktu >= TIME(NOW())
      ORDER BY j.waktu
    `, [hariMap]);

    let selected = null;
    let routeHalteIds = [];

    // Cari bus yang rutenya melewati halte tujuan
    for (const bus of candidates) {
      const [halteRoute] = await pool.query(
        `SELECT id_halte FROM halte WHERE id_rute = ? ORDER BY urutan`,
        [bus.id_rute]
      );
      const ids = halteRoute.map(h => h.id_halte);
      if (ids.includes(halteId)) {
        selected = bus;
        routeHalteIds = ids;
        break;
      }
    }

    if (!selected) {
      return res.json({ message: 'Tidak ada bus tersedia menuju halte ini saat ini' });
    }

    // Asumsikan bus berada di halte jadwal terakhirnya (karena tidak ada data posisi real-time)
    const currentHalteId = selected.id_halte;

    // Hitung ETA
    const currentIndex = routeHalteIds.indexOf(currentHalteId);
    const targetIndex = routeHalteIds.indexOf(halteId);

    if (currentIndex === -1 || targetIndex === -1) {
      return res.json({ error: 'Posisi atau tujuan halte tidak valid' });
    }

    let totalETA = 0;
    if (currentIndex <= targetIndex) {
      // Rute normal (tidak sirkular)
      for (let i = currentIndex; i < targetIndex; i++) {
        const [jalur] = await pool.query(
          `SELECT waktu FROM jalur WHERE id_halte_awal = ? AND id_halte_akhir = ?`,
          [routeHalteIds[i], routeHalteIds[i + 1]]
        );
        totalETA += jalur[0]?.waktu || 0;
      }
    } else {
      // Rute sirkular (melewati ujung rute)
      // Dari posisi saat ini ke akhir rute
      for (let i = currentIndex; i < routeHalteIds.length - 1; i++) {
        const [jalur] = await pool.query(
          `SELECT waktu FROM jalur WHERE id_halte_awal = ? AND id_halte_akhir = ?`,
          [routeHalteIds[i], routeHalteIds[i + 1]]
        );
        totalETA += jalur[0]?.waktu || 0;
      }
      // Dari awal rute ke halte tujuan
      for (let i = 0; i < targetIndex; i++) {
        const [jalur] = await pool.query(
          `SELECT waktu FROM jalur WHERE id_halte_awal = ? AND id_halte_akhir = ?`,
          [routeHalteIds[i], routeHalteIds[i + 1]]
        );
        totalETA += jalur[0]?.waktu || 0;
      }
    }

    // Hitung waktu tiba
    const [h, m] = selected.waktu.split(':');
    const arrival = new Date();
    arrival.setHours(+h, +m, 0);
    arrival.setMinutes(arrival.getMinutes() + totalETA);

    res.json({
      bus: selected.kd_bus,
      status_bus: selected.status_bus,
      currentHalte: currentHalteId,
      etaMinutes: totalETA,
      arrivalTime: `${arrival.getHours().toString().padStart(2, '0')}:${arrival.getMinutes().toString().padStart(2, '0')}`,
      route: routeHalteIds
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Helper function - dapatkan halte berikutnya
async function getNextHalte(busId) {
  const [position] = await pool.query(
    `SELECT id_halte FROM bus_positions 
     WHERE kd_bus = ? ORDER BY timestamp DESC LIMIT 1`,
    [busId]
  );
  
  if (position.length) {
    const [route] = await pool.query(
      `SELECT id_halte FROM halte 
       WHERE id_rute = (
         SELECT id_rute FROM jadwal WHERE kd_bus = ? LIMIT 1
       ) ORDER BY urutan`,
      [busId]
    );
    
    const currentIndex = route.findIndex(h => h.id_halte === position[0].id_halte);
    return currentIndex !== -1 
      ? route[(currentIndex + 1) % route.length].id_halte 
      : null;
  }
  return null;
}

app.get('/api/haltes', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM halte');
        console.log("Data halte dari DB:", rows); // Log untuk debug
        res.json(rows);
    } catch(err) {
        console.error("Error query halte:", err);
        res.status(500).json({ error: err.message });
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

app.get('/api/jadwal', async (req, res) => {//-----------------------------JADWAL
  try {
    const [rows] = await pool.query(`
      SELECT * FROM jadwal
      ORDER BY 
        FIELD(hari, 'Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'),
        waktu
    `);
    res.json(rows);
  } catch (err) {
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
// Endpoint untuk menambah jadwal (POST)
app.post('/api/jadwal', async (req, res) => {
  if(!isAdmin(req)) return res.status(403).json({ error: 'Akses ditolak' });
  try {
    const { id_jadwal, hari, waktu, kd_bus, id_rute, id_halte } = req.body;
    
    // Validasi data
    if(!id_jadwal || !hari || !waktu || !kd_bus || !id_rute || !id_halte) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    // Validasi hari
    const validDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    if(!validDays.includes(hari)) {
      return res.status(400).json({ error: 'Hari tidak valid' });
    }

    // Validasi bus
    const [bus] = await pool.query('SELECT * FROM bus WHERE kd_bus = ?', [kd_bus]);
    if(!bus.length) {
      return res.status(400).json({ error: 'Bus tidak ditemukan' });
    }

    // Validasi rute
    const [rute] = await pool.query('SELECT * FROM rute WHERE id_rute = ?', [id_rute]);
    if(!rute.length) {
      return res.status(400).json({ error: 'Rute tidak ditemukan' });
    }

    // Validasi halte
    const [halte] = await pool.query('SELECT * FROM halte WHERE id_halte = ?', [id_halte]);
    if(!halte.length) {
      return res.status(400).json({ error: 'Halte tidak ditemukan' });
    }

    // Insert ke database
    const [result] = await pool.query(
      'INSERT INTO jadwal SET ?',
      { id_jadwal, hari, waktu, kd_bus, id_rute, id_halte }
    );
    
    res.status(201).json({ message: 'Jadwal berhasil ditambahkan', id: id_jadwal });
  } catch(err) {
    // Handle duplicate entry
    if(err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'ID Jadwal sudah ada' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Endpoint untuk update jadwal (PUT)
app.put('/api/jadwal/:id', async (req, res) => {
  if(!isAdmin(req)) return res.status(403).json({ error: 'Akses ditolak' });
  try {
    const { hari, waktu, kd_bus, id_rute, id_halte } = req.body;
    
    // Validasi data
    if(!hari || !waktu || !kd_bus || !id_rute || !id_halte) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    // Validasi hari
    const validDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    if(!validDays.includes(hari)) {
      return res.status(400).json({ error: 'Hari tidak valid' });
    }

    // Update database
    const [result] = await pool.query(
      'UPDATE jadwal SET ? WHERE id_jadwal = ?',
      [{ hari, waktu, kd_bus, id_rute, id_halte }, req.params.id]
    );
    
    result.affectedRows 
      ? res.json({ message: 'Jadwal berhasil diupdate' })
      : res.status(404).json({ error: 'Jadwal tidak ditemukan' });
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
  ]).then(() => console.log('✅ Database terkoneksi'))
    .catch(err => console.error('❌ Matilah, ada yg salah bos:', err));
});
