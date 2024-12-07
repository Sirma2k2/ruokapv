const express = require('express');
const cors = require('cors'); // Varmista, että tuodaan cors

const pool = require('./database'); // Tuodaan tietokantayhteys
const dotenv = require('dotenv');
const calculateCalories = require('./routes/calorieCalculator'); // Import the calorie calculator function

//const bcrypt = require('bcrypt'); // VOISITTEKO KÄYTTÄÄ TÄTÄ KIRJASTOA SALASANOJEN HASHAAMISEEN


dotenv.config();

const app = express(); // Määrittele app ensin
const port = 3000;

// Käytetään CORS ja JSON-dataa POST-pyynnöissä
app.use(cors());
app.use(express.json());



app.get('/api/searchFood', async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).send({ error: 'Query parameter is required' });
  }

  try {
    const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1`);
    const data = await response.json();
    
    if (data.products) {
      res.json(data.products); // Lähetetään hakutulokset takaisin frontendille
    } else {
      res.status(404).send({ error: 'No products found' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch food data' });
  }
});

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

// API-reitti POST-pyynnölle (lisää käyttäjä)
app.post('/add-user', async (req, res) => {
  const { knimi, email, pword, ika, paino, pituus, aktiviteetti, tyyppi, tavoite, sukupuoli } = req.body;

  if (!knimi || !email || !pword || !ika || !paino || !pituus || !aktiviteetti || !tyyppi || !tavoite || !sukupuoli) {
    return res.status(400).json({ error: 'Name, email, password, age, weight, height, activity level, diet type, goal, and gender are required' });
  }

  try {
    const query1 = 'SELECT email FROM users WHERE email = $1 OR knimi = $2';
    const values1 = [email, knimi];

    if ((await pool.query(query1, values1)).rowCount === 0) {
      console.log("knimi ja email vapaa");

      const query = 'INSERT INTO users(knimi, ika, paino, pituus, aktiviteetti, tyyppi, tavoite, email, pword, sukupuoli) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
      const values = [knimi, ika, paino, pituus, aktiviteetti, tyyppi, tavoite, email, pword, sukupuoli];
      await pool.query(query, values);

      // Calculate calories and store in the database
      const calories = calculateCalories({ ika, paino, pituus, aktiviteetti, tyyppi, tavoite, sukupuoli });
      const calorieQuery = 'INSERT INTO calories(knimi, goal, food, remaining) VALUES($1, $2, $3, $4)';
      const calorieValues = [knimi, calories.goal, calories.food, calories.remaining];
      await pool.query(calorieQuery, calorieValues);

      return res.status(201).json({ message: 'User added successfully' });
    } else {
      console.log("knimi tai email jo käytössä");
      return res.status(600).json({ message: "Name or email already in use" });
    }
  } catch (err) {
    console.error('Error inserting user to the database', err);
    res.status(500).json({ error: 'Failed to add user to the database' });
  }
});

// API-reitti GET-pyynnölle (hae kalorit)
app.get('/get-calories', async (req, res) => {
  const knimi = req.headers.knimi;

  if (!knimi) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const query = 'SELECT goal, food, remaining FROM calories WHERE knimi = $1';
    const values = [knimi];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Calories data not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching calories data', err);
    res.status(500).json({ error: 'Failed to fetch calories data' });
  }
});

app.post('/login', async(req,res)=> {
  const {email, pword} = req.body;

  try {
    const query = 'SELECT * FROM users WHERE email = $1 AND pword = $2';
    const values = [email, pword];
    const result = await pool.query(query, values);
    if (result.rowCount != 0){
      console.log(result.rows);
      return res.status(201).json({data: result.rows});
    }else{
      return res.status(401).json({ message: 'Incorrect credidentials' });
    }
  } catch(err){
    console.error('Query error', err)
    res.status(500).send('database query failed')
  }
});

app.get('/get-food', async(req,res)=> {
  const knimi = req.headers.knimi;
  console.log("knimi: ",knimi)
  const query = 'SELECT ruokanimi, maarag, kalorit FROM ruoka WHERE knimi = $1';
  const value = [knimi];

  try { 
    const result = await pool.query(query, value);
    res.json(result.rows)

  } catch (error) {
    console.error('Error fetching data', error)
    res.status(500).send('Error fetching data')
  }
});
// Palvelimen käynnistys
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});