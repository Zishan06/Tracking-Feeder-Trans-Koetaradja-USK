fetch('http://localhost:3000/api/buses')
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById('bus-list');
    list.innerHTML = '';
    data.forEach(bus => {
      const div = document.createElement('div');
      div.textContent = `${bus.bus_number}: ${bus.route_start} → ${bus.route_end} at ${bus.departure_time}`;
      list.appendChild(div);
    });
  });
