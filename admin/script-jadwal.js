const API_BASE = 'http://localhost:3000/api';
const ADMIN_SECRET = 'iqankerapu';

// Fungsi untuk memuat semua jadwal
async function loadJadwal() {
  try {
    const res = await fetch(`${API_BASE}/jadwal`);
    const jadwals = await res.json();
    const tbody = document.querySelector('#jadwal-table tbody');
    tbody.innerHTML = '';

    jadwals.forEach(j => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${j.id_jadwal}</td>
        <td>${j.hari}</td>
        <td>${j.waktu.slice(0, 5)}</td>
        <td>${j.kd_bus}</td>
        <td>${j.id_rute}</td>
        <td>${j.id_halte}</td>
        <td>
          <button onclick="editJadwal('${j.id_jadwal}')">Edit</button>
          <button onclick="deleteJadwal('${j.id_jadwal}')">Hapus</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error('Gagal memuat jadwal:', err);
  }
}

// Tambah atau update jadwal
document.getElementById('jadwal-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const data = {
    id_jadwal: document.getElementById('id_jadwal').value,
    hari: document.getElementById('hari').value,
    waktu: document.getElementById('waktu').value,
    kd_bus: document.getElementById('kd_bus').value,
    id_rute: document.getElementById('id_rute').value,
    id_halte: document.getElementById('id_halte').value,
  };

  try {
    // Cek apakah jadwal sudah ada (mode update atau buat baru)
    const isEdit = await isExistingJadwal(data.id_jadwal);

    const res = await fetch(`${API_BASE}/jadwal${isEdit ? '/' + data.id_jadwal : ''}?secret=${ADMIN_SECRET}`, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error(isEdit ? 'Gagal mengupdate jadwal' : 'Gagal menambahkan jadwal');
    
    alert(isEdit ? 'Jadwal berhasil diupdate!' : 'Jadwal berhasil ditambahkan!');
    this.reset();
    loadJadwal();
  } catch (err) {
    alert(err.message);
  }
});

// Cek apakah ID jadwal sudah ada
async function isExistingJadwal(id) {
  const res = await fetch(`${API_BASE}/jadwal`);
  const jadwals = await res.json();
  return jadwals.some(j => j.id_jadwal === id);
}

// Ambil data jadwal lalu isi form
window.editJadwal = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/jadwal`);
    const data = await res.json();
    const jadwal = data.find(j => j.id_jadwal === id);

    if (!jadwal) return alert('Data jadwal tidak ditemukan');

    document.getElementById('id_jadwal').value = jadwal.id_jadwal;
    document.getElementById('hari').value = jadwal.hari;
    document.getElementById('waktu').value = jadwal.waktu;
    document.getElementById('kd_bus').value = jadwal.kd_bus;
    document.getElementById('id_rute').value = jadwal.id_rute;
    document.getElementById('id_halte').value = jadwal.id_halte;
  } catch (err) {
    console.error('Gagal memuat data jadwal:', err);
  }
};

// Hapus jadwal
window.deleteJadwal = async (id) => {
  if (!confirm('Yakin ingin menghapus jadwal ini?')) return;

  try {
    const res = await fetch(`${API_BASE}/schedules/${id}?secret=${ADMIN_SECRET}`, {
      method: 'DELETE'
    });

    if (!res.ok) throw new Error('Gagal menghapus jadwal');
    alert('Jadwal berhasil dihapus');
    loadJadwal();
  } catch (err) {
    alert(err.message);
  }
};

// Jalankan saat halaman dimuat
window.addEventListener('DOMContentLoaded', loadJadwal);