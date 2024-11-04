const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const foodRoutes = require('./routes/foodRoutes');

// Määrittele reitit
app.use('/api', foodRoutes);
// Perusreitti
app.get('/', (req, res) => {
    res.send('Backend is running');
});

// Käynnistä palvelin
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});