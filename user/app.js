function showTab(id) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

function pilihMenu(id) {
  // Ubah background ke abu-abu
  const body = document.getElementById('main-body');
  body.classList.remove('bg-blue-600');
  body.classList.add('bg-gray-100');
  
  // Tampilkan konten utama
  document.getElementById('modal-pilihan').style.display = 'none';
  document.getElementById('main-header').classList.remove('hidden');
  document.getElementById('main-content').classList.remove('hidden');

  showTab(id);
}

window.addEventListener("DOMContentLoaded", () => {
  // Saat pertama kali load, tampilkan modal dan sembunyikan konten utama
  document.querySelectorAll('.tab').forEach(tab => tab.classList.add('hidden'));
  document.getElementById('modal-pilihan').style.display = 'flex';
  document.getElementById('main-header').classList.add('hidden');
  document.getElementById('main-content').classList.add('hidden');
});
