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
    
    // Cek jika dari dan ke sudah dipilih
    if (!from) {
      return res.status(400).json({ error: 'Halte asal wajib diisi' });
    }

    // Ambil urutan halte untuk rute yang dipilih
    const [halte] = await pool.query(`
      SELECT * FROM halte 
      WHERE id_rute = 'RT001' 
      ORDER BY urutan
    `);

    // Filter halte asal
    const fromHalte = halte.find(h => h.id_halte === from);
    if (!fromHalte) {
      return res.status(404).json({ error: 'Halte asal tidak ditemukan' });
    }

    // Kirimkan rute dan bus yang sesuai dengan halte asal
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
      fromHalte: fromHalte.nama_halte,
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
    `, [day, timeFormatted, `${hours}:${minutes}:59`]);

    res.json({
      time,
      day,
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
app.get('/api/bus/eta', async (req, res) => {
  try {
    const { halteId } = req.query;
    
    if (!halteId) {
      return res.status(400).json({ error: 'Parameter halteId wajib' });
    }

    // 1. Cari bus berikutnya yang menuju halte ini
    const [nextBus] = await pool.query(`
      SELECT j.*, b.status_bus 
      FROM jadwal j
      JOIN bus b ON j.kd_bus = b.kd_bus
      WHERE j.id_halte IN (
        SELECT id_halte_awal FROM jalur WHERE id_halte_akhir = ?
      )
      AND j.waktu >= TIME(NOW())
      AND j.hari = DAYNAME(NOW())
      ORDER BY j.waktu
      LIMIT 1
    `, [halteId]);

    // 2. Hitung ETA jika bus ditemukan
    if (nextBus.length) {
      const etaMinutes = await calculateETA(nextBus[0], halteId);
      
      if (etaMinutes !== null) {
        // Hitung waktu kedatangan
        const [hours, mins] = nextBus[0].waktu.split(':');
        const arrivalTime = new Date();
        arrivalTime.setHours(hours, mins, 0, 0);
        arrivalTime.setMinutes(arrivalTime.getMinutes() + etaMinutes);
        
        res.json({
          bus: nextBus[0].kd_bus,
          currentHalte: nextBus[0].id_halte,
          etaMinutes,
          arrivalTime: arrivalTime.toTimeString().substr(0, 5),
          nextHalte: await getNextHalte(nextBus[0].kd_bus)
        });
      } else {
        res.json({ error: 'Tidak dapat menghitung ETA' });
      }
    } else {
      res.json({ message: 'Tidak ada bus menuju halte ini dalam waktu dekat' });
    }

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

app.get('/api/jadwal', async (req, res) => {
  const { rute, from, to } = req.query;
  if (!rute) return res.json([]);
  try {
    // Ambil urutan halte asal dan tujuan
    let urutanFrom = 1, urutanTo = 999;
    if (from && to) {
      const [halteRows] = await pool.query(
        "SELECT nama_halte, urutan FROM halte WHERE id_rute = ? AND (nama_halte = ? OR nama_halte = ?)",
        [rute, from, to]
      );
      const urutans = halteRows.map(h => h.urutan);
      urutanFrom = Math.min(...urutans);
      urutanTo = Math.max(...urutans);
    }
    const [rows] = await pool.query(
      `SELECT j.*, h.nama_halte 
       FROM jadwal j
       JOIN halte h ON j.id_halte = h.id_halte
       WHERE j.id_rute = ?
       AND h.urutan BETWEEN ? AND ?
       ORDER BY h.urutan, j.hari, j.waktu`, [rute, urutanFrom, urutanTo]
    );
    res.json(rows);
  } catch (err) {
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
  ]).then(() => console.log('✅ Database terkoneksi'))
    .catch(err => console.error('❌ Matilah, ada yg salah bos:', err));
});

