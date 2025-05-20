const API_BASE = 'http://localhost:3000/api';
const ADMIN_SECRET = 'iqankerapu'; // ganti kalau kamu ubah secret

// Tampilkan data halte
async function loadHalte() {
  try {
    const res = await fetch(`${API_BASE}/haltes`);
    const haltes = await res.json();
    const tbody = document.querySelector('#halte-table tbody');
    tbody.innerHTML = '';

    haltes.forEach(h => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${h.id_halte}</td>
        <td>${h.nama_halte}</td>
        <td>${h.id_rute}</td>
        <td>
          <button onclick="editHalte('${h.id_halte}')">Edit</button>
          <button onclick="deleteHalte('${h.id_halte}')">Hapus</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error('Gagal memuat halte:', err);
  }
}

// Tambah atau update halte
document.getElementById('halte-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const id_halte = document.getElementById('id_halte').value;
  const nama_halte = document.getElementById('nama_halte').value;
  const id_rute = document.getElementById('id_rute').value;
  const urutan = document.getElementById('urutan').value;

  const data = { id_halte, nama_halte, id_rute, urutan };

  try {
    // Cek apakah halte sudah ada (mode update atau buat baru)
    const isEdit = await isExistingHalte(id_halte);

    const res = await fetch(`${API_BASE}/admin/haltes${isEdit ? '/' + id_halte : ''}?secret=${ADMIN_SECRET}`, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error('Gagal menyimpan data halte');

    alert('Halte berhasil disimpan');
    this.reset();
    loadHalte();
  } catch (err) {
    alert(err.message);
  }
});

// Cek apakah ID halte sudah ada (untuk mode update)
async function isExistingHalte(id) {
  const res = await fetch(`${API_BASE}/haltes`);
  const haltes = await res.json();
  return haltes.some(h => h.id_halte === id);
}

// Ambil data halte lalu isi form
window.editHalte = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/haltes`);
    const data = await res.json();
    const halte = data.find(h => h.id_halte === id);

    if (!halte) return alert('Data halte tidak ditemukan');

    document.getElementById('id_halte').value = halte.id_halte;
    document.getElementById('nama_halte').value = halte.nama_halte;
    document.getElementById('id_rute').value = halte.id_rute;
    document.getElementById('urutan').value = halte.urutan;
  } catch (err) {
    console.error('Gagal memuat data halte:', err);
  }
};

// Hapus halte
window.deleteHalte = async (id) => {
  if (!confirm('Yakin ingin menghapus halte ini?')) return;

  try {
    const res = await fetch(`${API_BASE}/haltes/${id}?secret=${ADMIN_SECRET}`, {
      method: 'DELETE'
    });

    if (!res.ok) throw new Error('Gagal menghapus halte');

    alert('Halte berhasil dihapus');
    loadHalte();
  } catch (err) {
    alert(err.message);
  }
};

// Jalankan saat halaman siap
window.addEventListener('DOMContentLoaded', loadHalte);
