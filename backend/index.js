const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const sampleBuses = [
  { id: 1, bus_number: 'A1', route_start: 'Station A', route_end: 'Station B', departure_time: '08:00' },
  { id: 2, bus_number: 'B2', route_start: 'Station C', route_end: 'Station D', departure_time: '09:15' }
];

app.get('/api/buses', (req, res) => {
  res.json(sampleBuses);
});

app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000');
});
