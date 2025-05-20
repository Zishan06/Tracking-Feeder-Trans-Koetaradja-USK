document.addEventListener('DOMContentLoaded', () => {
  // Deteksi halaman mana yang sedang aktif
  const isHaltePage = document.getElementById('halte-form') !== null;
  const isJadwalPage = document.getElementById('jadwal-form') !== null;

  // ==== HALAMAN HALTE ====
  if (isHaltePage) {
    const halteForm = document.getElementById('halte-form');
    const halteTable = document.getElementById('halte-table').querySelector('tbody');
    const addHalteBtn = document.getElementById('add-halte-btn');

    // Load data halte dari localStorage
    function loadHaltes() {
      const data = JSON.parse(localStorage.getItem('haltes')) || [];
      halteTable.innerHTML = '';
      data.forEach((halte, index) => {
        halteTable.innerHTML += `
          <tr>
            <td>${halte.idHalte}</td>
            <td>${halte.namaHalte}</td>
            <td>${halte.idRute}</td>
            <td>
              <button onclick="editHalte(${index})">Edit</button>
              <button onclick="deleteHalte(${index})">Hapus</button>
            </td>
          </tr>`;
      });
    }

    // Submit form halte
    halteForm.onsubmit = (e) => {
      e.preventDefault();
      const idHalte = document.getElementById('id_halte').value;
      const namaHalte = document.getElementById('nama_halte').value;
      const idRute = document.getElementById('id_rute').value;
      
      let data = JSON.parse(localStorage.getItem('haltes')) || [];
      
      const index = data.findIndex(h => h.idHalte === idHalte);
      if (index !== -1) {
        // Edit existing
        data[index].namaHalte = namaHalte;
        data[index].idRute = idRute;
        alert('Data halte berhasil diperbarui!');
      } else {
        // Tambah baru
        data.push({ idHalte, namaHalte, idRute });
        alert('Data halte berhasil ditambahkan!');
      }
      
      localStorage.setItem('haltes', JSON.stringify(data));
      halteForm.reset();
      loadHaltes();
    };

    // Fungsi edit halte
    window.editHalte = (index) => {
      const data = JSON.parse(localStorage.getItem('haltes')) || [];
      const h = data[index];
      document.getElementById('id_halte').value = h.idHalte;
      document.getElementById('nama_halte').value = h.namaHalte;
      document.getElementById('id_rute').value = h.idRute;
    };

    // Fungsi hapus halte
    window.deleteHalte = (index) => {
      let data = JSON.parse(localStorage.getItem('haltes')) || [];
      data.splice(index, 1);
      localStorage.setItem('haltes', JSON.stringify(data));
      loadHaltes();
    };

    // Tombol tambah halte
    addHalteBtn.addEventListener('click', () => {
      halteForm.scrollIntoView({ behavior: 'smooth' });
      halteForm.querySelector('input').focus();
    });

    // Load data halte saat halaman dibuka
    loadHaltes();
  }

  // ==== HALAMAN JADWAL ====
  if (isJadwalPage) {
    const jadwalForm = document.getElementById('jadwal-form');
    const jadwalTable = document.getElementById('jadwal-table').querySelector('tbody');
    const addJadwalBtn = document.getElementById('add-jadwal-btn');

    // Load data jadwal dari localStorage
    function loadJadwals() {
      const data = JSON.parse(localStorage.getItem('jadwals')) || [];
      jadwalTable.innerHTML = '';
      data.forEach((jadwal, index) => {
        jadwalTable.innerHTML += `
          <tr>
            <td>${jadwal.idJadwal}</td>
            <td>${jadwal.hari}</td>
            <td>${jadwal.waktu}</td>
            <td>${jadwal.kdBus}</td>
            <td>${jadwal.idRute}</td>
            <td>${jadwal.idHalte}</td>
            <td>
              <button onclick="editJadwal(${index})">Edit</button>
              <button onclick="deleteJadwal(${index})">Hapus</button>
            </td>
          </tr>`;
      });
    }

    // Submit form jadwal
    jadwalForm.onsubmit = (e) => {
      e.preventDefault();
      const idJadwal = document.getElementById('id_jadwal').value;
      const hari = document.getElementById('hari').value;
      const waktu = document.getElementById('waktu').value;
      const kdBus = document.getElementById('kd_bus').value;
      const idRute = document.getElementById('id_rute').value;
      const idHalte = document.getElementById('id_halte').value;
      
      let data = JSON.parse(localStorage.getItem('jadwals')) || [];
      
      const index = data.findIndex(j => j.idJadwal === idJadwal);
      if (index !== -1) {
        // Edit existing
        data[index].hari = hari;
        data[index].waktu = waktu;
        data[index].kdBus = kdBus;
        data[index].idRute = idRute;
        data[index].idHalte = idHalte;
        alert('Data jadwal berhasil diperbarui!');
      } else {
        // Tambah baru
        data.push({ idJadwal, hari, waktu, kdBus, idRute, idHalte });
        alert('Data jadwal berhasil ditambahkan!');
      }
      
      localStorage.setItem('jadwals', JSON.stringify(data));
      jadwalForm.reset();
      loadJadwals();
    };

    // Fungsi edit jadwal
    window.editJadwal = (index) => {
      const data = JSON.parse(localStorage.getItem('jadwals')) || [];
      const j = data[index];
      document.getElementById('id_jadwal').value = j.idJadwal;
      document.getElementById('hari').value = j.hari;
      document.getElementById('waktu').value = j.waktu;
      document.getElementById('kd_bus').value = j.kdBus;
      document.getElementById('id_rute').value = j.idRute;
      document.getElementById('id_halte').value = j.idHalte;
    };

    // Fungsi hapus jadwal
    window.deleteJadwal = (index) => {
      let data = JSON.parse(localStorage.getItem('jadwals')) || [];
      data.splice(index, 1);
      localStorage.setItem('jadwals', JSON.stringify(data));
      loadJadwals();
    };

    // Tombol tambah jadwal
    addJadwalBtn.addEventListener('click', () => {
      jadwalForm.scrollIntoView({ behavior: 'smooth' });
      jadwalForm.querySelector('input').focus();
    });

    // Load data jadwal saat halaman dibuka
    loadJadwals();
  }
});