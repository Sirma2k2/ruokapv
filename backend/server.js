const express = require('express');
const cors = require('cors'); // Varmista, että tuodaan cors

const pool = require('./database'); // Tuodaan tietokantayhteys
const dotenv = require('dotenv');

dotenv.config();

const app = express(); // Määrittele app ensin
const port = 3000;

// Käytetään CORS ja JSON-dataa POST-pyynnöissä
app.use(cors());
app.use(express.json());

// API-reitti, joka hakee tietoja tietokannasta
app.get('/api/ruokadata', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ruoka'); // Hakee kaikki tiedot taulusta tapahtumaid
    res.json(result.rows); // Palautetaan tiedot JSON-muodossa
  } catch (err) {
    console.error('Database query error', err);
    res.status(500).send('Database query failed');
  }
});

// API-reitti POST-pyynnölle (lisää ruoka)
app.post('/api/add-food', async (req, res) => {
  const { knimi, ruokanimi, maarag, kalorit } = req.body;

  if (!knimi || !ruokanimi || !maarag) {
    return res.status(400).json({ error: 'Name, food name, and amount are required' });
  }

  try {
    // Lisätään uusi ruoka tietokantaan
    const query = 'INSERT INTO ruoka(knimi, ruokanimi, maarag, kalorit) VALUES($1, $2, $3, $4)';
    const values = [knimi, ruokanimi, maarag, kalorit || null]; // Kalorit voivat olla valinnaisia

    await pool.query(query, values);
    res.status(201).json({ message: 'Food added successfully' });
  } catch (err) {
    console.error('Error inserting data into database', err);
    res.status(500).json({ error: 'Failed to add food to database' });
  }
});
app.get('/get-user', async( req,res)=> {
  try {
    const result = await pool.query('SELECT * FROM users')
    res.json(result.rows)
  } catch(err){
    console.error('Query error', err)
    res.status(500).send('database query failed')
  }
})

app.post('/add-user', async(req,res) => {
  const {knimi, ika, paino, pituus, aktiviteetti, tyyppi, tavoite } = req.body

  if(!knimi || !ika || !paino || !pituus || !aktiviteetti || !tyyppi || !tavoite) {
    return res.status(400).json({ error: 'something missing'})
  }
  try { 
    const query = 'INSERT INTO users(knimi, ika, paino, pituus, aktiviteetti, tyyppi, tavoite) VALUES($1, $2, $3, $4, $5, $6, $7)'
    const values = [knimi, ika, paino, pituus, aktiviteetti, tyyppi, tavoite || null]
    await pool.query(query, values)
    res.status(201).json({ message: 'user added successfully' })
  } catch(err) {
    console.error('Error inserting user to the database', err)
    res.status(500).json({ error: 'Failed to add user to the database' })
  }
})

app.get('/get-food', async(req,res)=> {
  try { 
    const result = await pool.query('SELECT ruokanimi, maarag, kalorit FROM ruoka')
    res.json(result.rows)

  } catch (error) {
    console.error('Error fetching data', error)
    res.status(500).send('Error fetching data')
  }
})
// Palvelimen käynnistys
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});