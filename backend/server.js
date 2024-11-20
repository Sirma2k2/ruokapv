const express = require('express');
const cors = require('cors'); // Varmista, että tuodaan cors

const pool = require('./database'); // Tuodaan tietokantayhteys
const dotenv = require('dotenv');
const ax = require('axios');

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


app.get('/search/:keyword', async (req, res) => {
  const { keyword } = req.params;
  try {
      const response = await ax.get(`${"https://www.themealdb.com/api/json/v1/1"}/search.php?s=${keyword}`);
      
      console.log(response.data);

      if (response.data.meals && response.data.meals.length > 0) {
          const meal = response.data.meals[0];
          res.json({
              strMeal: meal.strMeal,
              strMealThumb: meal.strMealThumb
          });
      } else {
          res.status(404).json({ message: "No meals found for this keyword." + keyword });
      }
  } catch (error) {
      res.status(500).json({ message: "Failed to fetch meals by keyword", error: error.message });
  }
});

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