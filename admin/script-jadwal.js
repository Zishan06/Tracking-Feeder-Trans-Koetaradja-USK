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
          <button onclick="deleteJadwal('${j.id_jadwal}')">Hapus</button>
        </td>
      `;
      tbody.appendChild(row);
    });

  } catch (err) {
    console.error('Gagal memuat jadwal:', err);
  }
}

// Tambah jadwal
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
    const res = await fetch(`${API_BASE}/schedules?secret=${ADMIN_SECRET}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error('Gagal menambahkan jadwal');
    alert('Jadwal ditambahkan!');
    this.reset();
    loadJadwal();
  } catch (err) {
    alert(err.message);
  }
});

// Hapus jadwal
window.deleteJadwal = async (id) => {
  if (!confirm('Yakin ingin menghapus jadwal ini?')) return;

  try {
    const res = await fetch(`${API_BASE}/schedules/${id}?secret=${ADMIN_SECRET}`, {
      method: 'DELETE'
    });

    if (!res.ok) throw new Error('Gagal menghapus jadwal');
    alert('Jadwal dihapus');
    loadJadwal();
  } catch (err) {
    alert(err.message);
  }
};

// Jalankan saat halaman dimuat
window.addEventListener('DOMContentLoaded', loadJadwal);
