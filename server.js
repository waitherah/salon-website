const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'test123';
const BOOKINGS_FILE = 'bookings.json';

let bookings = [];
if (fs.existsSync(BOOKINGS_FILE)) {
  bookings = JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf8'));
}

function saveBookingsToFile() {
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
}

app.get('/', (req, res) => {
  res.send('Salon backend is running');
});

app.post('/bookings', (req, res) => {
  bookings.push(req.body);
  saveBookingsToFile();
  res.json({ message: 'Booking received' });
});

app.get('/bookings', (req, res) => {
  if (req.headers['x-admin-password'] !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Wrong password' });
  }
  res.json(bookings);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});