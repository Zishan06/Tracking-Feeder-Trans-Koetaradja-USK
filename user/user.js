const API_BASE = "http://localhost:3000/api";

function showTab(id) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function pilihMenu(tabId) {
  document.getElementById("modal-pilihan").classList.add("hidden");
  showTab(tabId);
}

async function loadHaltes() {
  try {
    const res = await fetch(`${API_BASE}/haltes`);
    const data = await res.json();
    const fromSelect = document.getElementById("from-halte");
    const toSelect = document.getElementById("to-halte");

    data.forEach(h => {
      const opt1 = document.createElement("option");
      opt1.value = h.id_halte;
      opt1.textContent = h.nama_halte;
      fromSelect.appendChild(opt1);

      const opt2 = document.createElement("option");
      opt2.value = h.id_halte;
      opt2.textContent = h.nama_halte;
      toSelect.appendChild(opt2);
    });

    // Untuk dropdown cek kedatangan (jika nanti ditambahkan)
    const kedatanganContainer = document.getElementById("cek-kedatangan");
    if (kedatanganContainer) {
      const select = document.createElement("select");
      select.id = "kedatangan-halte";
      select.className = "mt-2 p-2 rounded border border-gray-300";

      const defaultOption = document.createElement("option");
      defaultOption.textContent = "Pilih halte tujuan";
      defaultOption.value = "";
      select.appendChild(defaultOption);

      data.forEach(h => {
        const opt = document.createElement("option");
        opt.value = h.id_halte;
        opt.textContent = h.nama_halte;
        select.appendChild(opt);
      });

      const btn = document.createElement("button");
      btn.textContent = "Cek Kedatangan";
      btn.className = "ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700";
      btn.addEventListener("click", () => cekKedatangan(select.value));

      const result = document.createElement("div");
      result.id = "hasil-kedatangan";
      result.className = "mt-4";

      kedatanganContainer.appendChild(select);
      kedatanganContainer.appendChild(btn);
      kedatanganContainer.appendChild(result);
    }
  } catch (err) {
    console.error("Gagal mengambil data halte:", err);
  }
}

async function cekKedatangan(halteId) {
  const hasil = document.getElementById("hasil-kedatangan");
  if (!halteId) {
    hasil.innerHTML = `<p class="text-red-500">Silakan pilih halte terlebih dahulu.</p>`;
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/bus/eta?halteId=${halteId}`);
    const data = await res.json();

    if (data.error || data.message) {
      hasil.innerHTML = `<p class="text-yellow-600">${data.error || data.message}</p>`;
    } else {
      hasil.innerHTML = `
        <div class="bg-white p-4 shadow rounded">
          <p><strong>Bus:</strong> ${data.bus}</p>
          <p><strong>Posisi Saat Ini:</strong> ${data.currentHalte}</p>
          <p><strong>ETA:</strong> ${data.etaMinutes} menit</p>
          <p><strong>Perkiraan Tiba:</strong> ${data.arrivalTime}</p>
          <p><strong>Halte Berikutnya:</strong> ${data.nextHalte}</p>
        </div>
      `;
    }
  } catch (err) {
    hasil.innerHTML = `<p class="text-red-500">Gagal mengambil data ETA.</p>`;
  }
}

async function handleFormCariRute() {
  const form = document.getElementById("route-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const from = document.getElementById("from-halte").value;
    const to = document.getElementById("to-halte").value;
    const resultBox = document.getElementById("route-results");

    if (!from || !to) {
      resultBox.innerHTML = `<p class="text-red-500">Pilih halte asal dan tujuan!</p>`;
      return;
    }

    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    try {
      const res = await fetch(`${API_BASE}/find-route?from=${from}&to=${to}&time=${time}`);
      const data = await res.json();

      if (data.error) {
        resultBox.innerHTML = `<p class="text-red-500">${data.error}</p>`;
      } else {
        resultBox.innerHTML = `
          <div class="bg-white p-4 shadow rounded">
            <p><strong>Rute:</strong> ${data.route.join(" → ")}</p>
            <p><strong>Total Waktu:</strong> ${data.total_time}</p>
            <h3 class="mt-4 font-bold">Bus Berikutnya:</h3>
            <ul class="list-disc list-inside">
              ${data.next_buses.map(b => `<li>${b.bus} - ${b.waktu} (tiba: ${b.estimasi_sampai})</li>`).join('')}
            </ul>
          </div>
        `;
      }
    } catch (err) {
      resultBox.innerHTML = `<p class="text-red-500">Gagal mengambil data rute.</p>`;
    }
  });
}
//cek jadwal skrg
async function loadActiveBuses() {
  const container = document.getElementById('active-buses-container');
  container.innerHTML = '<p class="text-gray-500 text-center">Memuat data bus...</p>';

  try {
    const timeInput = document.getElementById('bus-time');
    const time = timeInput.value || getCurrentTime();
    
    // Dapatkan hari saat ini
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const today = new Date().getDay();
    let day = days[today === 0 ? 0 : today]; // Minggu = 0, Senin = 1, dst

    // Untuk keperluan debugging, tampilkan hari asli dan yang akan dikirim
    console.log('Hari asli:', day);
    
    // Panggil API
    const response = await fetch(`http://localhost:3000/api/schedules/active?day=${day}&time=${time}`);
    const data = await response.json();

    // Tampilkan hasil
    displayActiveBuses(data.active_schedules);
  } catch (error) {
    console.error('Error loading active buses:', error);
    container.innerHTML = `
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Gagal memuat data bus. Silakan coba lagi.</p>
        <p class="text-sm">${error.message}</p>
      </div>
    `;
  }
}

// Fungsi untuk menampilkan bus aktif
function displayActiveBuses(buses) {
  const container = document.getElementById('active-buses-container');
  
  if (!buses || buses.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center">Tidak ada bus aktif pada waktu ini.</p>';
    return;
  }

  // Kelompokkan bus berdasarkan kode bus
  const busGroups = buses.reduce((groups, bus) => {
    if (!groups[bus.bus]) {
      groups[bus.bus] = [];
    }
    groups[bus.bus].push(bus);
    return groups;
  }, {});

  // Buat HTML untuk setiap bus
  container.innerHTML = Object.entries(busGroups).map(([busCode, schedules]) => {
    const latestSchedule = schedules[0]; // Ambil jadwal terbaru
    
    return `
      <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-bold text-lg">${busCode}</h3>
          <span class="px-3 py-1 rounded-full text-sm 
            ${latestSchedule.status === 'Aktif' ? 'bg-green-100 text-green-800' : 
              latestSchedule.status === 'Perbaikan' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'}">
            ${latestSchedule.status}
          </span>
        </div>
        
        <div class="space-y-2">
          ${schedules.map(schedule => `
            <div class="flex items-center">
              <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p class="font-medium">${schedule.halte}</p>
                <p class="text-sm text-gray-500">${schedule.waktu}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

// Fungsi untuk mendapatkan waktu saat ini dalam format HH:MM
function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Muat data bus saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  // Set waktu input ke waktu sekarang
  document.getElementById('bus-time').value = getCurrentTime();
  
  // Muat bus aktif
  loadActiveBuses();
});

//-----------------------------------------------cek ETA
// Fungsi untuk memuat daftar halte
async function loadHaltesForETA() {
  try {
    const response = await fetch('http://localhost:3000/api/haltes');
    const haltes = await response.json();
    const halteSelect = document.getElementById('eta-halte');
    
    // Kosongkan select kecuali opsi pertama
    halteSelect.innerHTML = '<option value="">Pilih Halte</option>';
    
    // Isi dengan daftar halte
    haltes.forEach(halte => {
      const option = document.createElement('option');
      option.value = halte.id_halte;
      option.textContent = halte.nama_halte;
      halteSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Gagal memuat daftar halte:', error);
  }
}

// Fungsi untuk mengecek estimasi kedatangan bus
async function checkBusETA() {
  const halteId = document.getElementById('eta-halte').value;
  const resultsContainer = document.getElementById('eta-results');
  
  if (!halteId) {
    resultsContainer.innerHTML = `
      <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        Silakan pilih halte terlebih dahulu
      </div>
    `;
    return;
  }
  
  resultsContainer.innerHTML = `
    <div class="flex justify-center items-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-3">Mencari bus terdekat...</span>
    </div>
  `;
  
  try {
    const response = await fetch(`https://localhost:3000/api/bus/eta?halteId=${halteId}`);
    const data = await response.json();
    
    if (data.error) {
      resultsContainer.innerHTML = `
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          ${data.error}
        </div>
      `;
    } else if (data.message) {
      resultsContainer.innerHTML = `
        <div class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          ${data.message}
        </div>
      `;
    } else {
      displayETAResults(data);
    }
  } catch (error) {
    console.error('Gagal memeriksa ETA:', error);
    resultsContainer.innerHTML = `
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Gagal memeriksa estimasi kedatangan. Silakan coba lagi.
      </div>
    `;
  }
}

// Fungsi untuk menampilkan hasil ETA
function displayETAResults(data) {
  const resultsContainer = document.getElementById('eta-results');
  const halteSelect = document.getElementById('eta-halte');
  const selectedHalte = halteSelect.options[halteSelect.selectedIndex].text;
  
  resultsContainer.innerHTML = `
    <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <h3 class="font-bold text-lg mb-2">Estimasi Kedatangan di Halte ${selectedHalte}</h3>
      
      <div class="space-y-4">
        <div class="flex items-start">
          <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v4m4-4v4m5 4H3a2 2 0 01-2-2V7a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p class="font-medium">Bus ${data.bus}</p>
            <p class="text-sm text-gray-600">Sedang menuju halte ini</p>
          </div>
        </div>
        
        <div class="flex items-start">
          <div class="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="font-medium">Estimasi Kedatangan</p>
            <p class="text-sm text-gray-600">
              ${data.arrivalTime} (${data.etaMinutes} menit lagi)
            </p>
          </div>
        </div>
        
        <div class="flex items-start">
          <div class="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p class="font-medium">Lokasi Saat Ini</p>
            <p class="text-sm text-gray-600">
              ${data.currentHalte || 'Tidak diketahui'}
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Muat daftar halte saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  loadHaltesForETA();
});
window.addEventListener("DOMContentLoaded", () => {
  loadHaltes();
  handleFormCariRute();
});



