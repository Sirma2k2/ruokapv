const express = require('express');
const cors = require('cors'); // Varmista, että tuodaan cors

const pool = require('./database'); // Tuodaan tietokantayhteys
const dotenv = require('dotenv');
const calculateCalories = require('./routes/calorieCalculator'); // Import the calorie calculator function

//const bcrypt = require('bcrypt'); // VOISITTEKO KÄYTTÄÄ TÄTÄ KIRJASTOA SALASANOJEN HASHAAMISEEN //EI!


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
    const result = await pool.query('SELECT * FROM food'); // Hakee kaikki tiedot taulusta tapahtumaid
    res.json(result.rows); // Palautetaan tiedot JSON-muodossa
  } catch (err) {
    console.error('Database query error', err);
    res.status(500).send('Database query failed');
  }
});

// API-reitti POST-pyynnölle (lisää ruoka)
app.post('/api/add-food', async (req, res) => {
  const { knimi, ruokanimi, maarag, kalorit, proteiini, hiilihydraatit, rasvat, tyyppi, picture } = req.body;
  //Tyypillä tarkoitetaan food, salad, drink, other
  console.log("Trying to add: ", req.body);
  if (!knimi || !ruokanimi || !maarag) {
    return res.status(400).json({ error: 'Name, food name, and amount are required' });
  }

  try {
    // Lisätään uusi ruoka tietokantaan
    const query = 'INSERT INTO food(knimi, ruokanimi, tyyppi, maarag, kalorit, proteiini, hiilarit, rasvat, picture, create_time) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
    const values = [knimi, ruokanimi, tyyppi, maarag, kalorit || null, proteiini || null, hiilihydraatit || null, rasvat || null, picture || null, 'NOW()']; // Kalorit voivat olla valinnaisia
    await pool.query(query, values);
    //Haetaan lisätyn ruuan id ja palautetaan se frontendiin.
    const result = await pool.query('SELECT id FROM food ORDER BY id DESC LIMIT 1;');
    res.status(201).json({ message: 'Food added successfully', id: result.rows });
  } catch (err) {
    console.error('Error inserting data into database', err);
    res.status(500).json({ error: 'Failed to add food to database' });
  }
}); 

//aterian tallennus
app.post('/api/add-meal', async (req, res) => {
  const { knimi, ateria, mealname, food, salad, drink, other } = req.body;

  if (!knimi || !mealname ) {
    return res.status(400).json({ error: 'Name, food name, and amount are required' });
  }

  try {
    /*
      food, salad, drink ja other ovat kaikki integerejä jotka vastaavat kyseisen ruuan id:tä food pöydässä.
    */
    const query = `INSERT INTO meals (knimi, mealname, ateria, food_id, salad_id, drink_id, other_id) VALUES($1, $2, $3, $4, $5, $6, $7)`;
    const values = [knimi, mealname, ateria, food, salad || null, drink || null, other || null]; //tyyppi, knimi, mealname ja food pakollisia
    console.log("Executing query:", query, "with values:", values);

    await pool.query(query, values);
    console.log(knimi, " added meal: ", mealname, "with food: ", food, " salad: ", salad, " drink: ", drink, " other: ", other);
    res.status(201).json({ message: 'Meal added successfully' });
  } catch (err) {
    console.error('Error inserting data into database', err);
    res.status(500).json({ error: 'Failed to add meal to database' });
  }
});

//Aterioiden haku
app.get('/api/get-meals', async (req, res) => {
  const { knimi, ateria } = req.query;
  console.log("nimi: ",knimi, " ateria: ", ateria);
  if (!knimi || !ateria) {
    return res.status(400).json({ error: 'Knimi and Ateria are required' });
  }

  try {
    //Hakee knimen ja aterian nimen mukaan aterian ja palauttaa aterian ja siihen kuuluvien ruokien tiedot.
    //Olis ollu proceduuri tietokannassa mutta en saanu toimimaan
    const query = `
      SELECT 
        m.id AS meal_id,
        m.knimi,
        m.mealname,
        f.ruokanimi AS food_ruokanimi,
        f.tyyppi AS food_typpi,
        f.kalorit AS food_kalorit,
        f.proteiini AS food_proteiini,
        f.hiilarit AS food_hiilarit,
        f.rasvat AS food_rasvat,
        f.picture AS food_picture,
        s.ruokanimi AS salad_ruokanimi,
        s.tyyppi AS salad_typpi,
        s.kalorit AS salad_kalorit,
        s.proteiini AS salad_proteiini,
        s.hiilarit AS salad_hiilarit,
        s.rasvat AS salad_rasvat,
        s.picture AS salad_picture,
        dr.ruokanimi AS drink_ruokanimi,
        dr.tyyppi AS drink_typpi,
        dr.kalorit AS drink_kalorit,
        dr.proteiini AS drink_proteiini,
        dr.hiilarit AS drink_hiilarit,
        dr.rasvat AS drink_rasvat,
        dr.picture AS drink_picture,
        o.ruokanimi AS other_ruokanimi,
        o.tyyppi AS other_typpi,
        o.kalorit AS other_kalorit,
        o.proteiini AS other_proteiini,
        o.hiilarit AS other_hiilarit,
        o.rasvat AS other_rasvat,
        o.picture AS other_picture
      FROM meals m
      JOIN food f ON m.food_id = f.id
      JOIN food s ON m.salad_id = s.id
      JOIN food dr ON m.drink_id = dr.id
      JOIN food o ON m.other_id = o.id
      WHERE m.knimi = $1
        AND m.ateria = $2;
    `;
    
    const result = await pool.query(query, [knimi, ateria]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No meals found for this knimi' });
    }
    //ja ei muuta ku kaikki sellasenaan etiä päin aamuja frontendin miehille.
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/get-meal-details', async (req, res) => {
  const { meal_id } = req.query;

  if (!meal_id) {
    return res.status(400).json({ error: 'Meal ID is required' });
  }

  try {
    const query = `
      SELECT 
        m.id AS meal_id,
        m.knimi,
        m.mealname,
        m.ateria,
        m.food_id,
        m.salad_id,
        m.drink_id,
        m.other_id,
        f.ruokanimi AS food_ruokanimi,
        f.tyyppi AS food_typpi,
        f.kalorit AS food_kalorit,
        f.proteiini AS food_proteiini,
        f.hiilarit AS food_hiilarit,
        f.rasvat AS food_rasvat,
        f.picture AS food_picture,
        s.ruokanimi AS salad_ruokanimi,
        s.tyyppi AS salad_typpi,
        s.kalorit AS salad_kalorit,
        s.proteiini AS salad_proteiini,
        s.hiilarit AS salad_hiilarit,
        s.rasvat AS salad_rasvat,
        s.picture AS salad_picture,
        dr.ruokanimi AS drink_ruokanimi,
        dr.tyyppi AS drink_typpi,
        dr.kalorit AS drink_kalorit,
        dr.proteiini AS drink_proteiini,
        dr.hiilarit AS drink_hiilarit,
        dr.rasvat AS drink_rasvat,
        dr.picture AS drink_picture,
        o.ruokanimi AS other_ruokanimi,
        o.tyyppi AS other_typpi,
        o.kalorit AS other_kalorit,
        o.proteiini AS other_proteiini,
        o.hiilarit AS other_hiilarit,
        o.rasvat AS other_rasvat,
        o.picture AS other_picture
      FROM meals m
      LEFT JOIN food f ON m.food_id = f.id
      LEFT JOIN food s ON m.salad_id = s.id
      LEFT JOIN food dr ON m.drink_id = dr.id
      LEFT JOIN food o ON m.other_id = o.id
      WHERE m.id = $1;
    `;
    const result = await pool.query(query, [meal_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching meal details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/search-meals', async (req, res) => {
  const { knimi, searchterm } = req.headers;
  console.log("nimi: ", knimi, " search: ", searchterm);

  if (!knimi) {
    return res.status(400).json({ error: 'Knimi is required' });
  }

  try {
    await pool.query('SET statement_timeout = 10000');

    let query;
    let values;

    if (searchterm) {
      query = `
        SELECT 
          m.id AS meal_id,
          m.knimi,
          m.mealname,
          f.ruokanimi AS food_ruokanimi,
          f.tyyppi AS food_typpi,
          f.kalorit AS food_kalorit,
          f.proteiini AS food_proteiini,
          f.hiilarit AS food_hiilarit,
          f.rasvat AS food_rasvat,
          f.picture AS food_picture,
          s.ruokanimi AS salad_ruokanimi,
          s.tyyppi AS salad_typpi,
          s.kalorit AS salad_kalorit,
          s.proteiini AS salad_proteiini,
          s.hiilarit AS salad_hiilarit,
          s.rasvat AS salad_rasvat,
          s.picture AS salad_picture,
          dr.ruokanimi AS drink_ruokanimi,
          dr.tyyppi AS drink_typpi,
          dr.kalorit AS drink_kalorit,
          dr.proteiini AS drink_proteiini,
          dr.hiilarit AS drink_hiilarit,
          dr.rasvat AS drink_rasvat,
          dr.picture AS drink_picture,
          o.ruokanimi AS other_ruokanimi,
          o.tyyppi AS other_typpi,
          o.kalorit AS other_kalorit,
          o.proteiini AS other_proteiini,
          o.hiilarit AS other_hiilarit,
          o.rasvat AS other_rasvat,
          o.picture AS other_picture,
          similarity(m.mealname, $2) AS similarity_score
        FROM meals m
        LEFT JOIN food f ON m.food_id = f.id
        LEFT JOIN food s ON m.salad_id = s.id
        LEFT JOIN food dr ON m.drink_id = dr.id
        LEFT JOIN food o ON m.other_id = o.id
        WHERE m.knimi = $1
          AND m.mealname % $2
        ORDER BY similarity_score DESC
        LIMIT 10;
      `;
      values = [knimi, searchterm];
    } else {
      query = `
        SELECT 
          m.id AS meal_id,
          m.knimi,
          m.mealname,
          f.ruokanimi AS food_ruokanimi,
          f.tyyppi AS food_typpi,
          f.kalorit AS food_kalorit,
          f.proteiini AS food_proteiini,
          f.hiilarit AS food_hiilarit,
          f.rasvat AS food_rasvat,
          f.picture AS food_picture,
          s.ruokanimi AS salad_ruokanimi,
          s.tyyppi AS salad_typpi,
          s.kalorit AS salad_kalorit,
          s.proteiini AS salad_proteiini,
          s.hiilarit AS salad_hiilarit,
          s.rasvat AS salad_rasvat,
          s.picture AS salad_picture,
          dr.ruokanimi AS drink_ruokanimi,
          dr.tyyppi AS drink_typpi,
          dr.kalorit AS drink_kalorit,
          dr.proteiini AS drink_proteiini,
          dr.hiilarit AS drink_hiilarit,
          dr.rasvat AS drink_rasvat,
          dr.picture AS drink_picture,
          o.ruokanimi AS other_ruokanimi,
          o.tyyppi AS other_typpi,
          o.kalorit AS other_kalorit,
          o.proteiini AS other_proteiini,
          o.hiilarit AS other_hiilarit,
          o.rasvat AS other_rasvat,
          o.picture AS other_picture
        FROM meals m
        LEFT JOIN food f ON m.food_id = f.id
        LEFT JOIN food s ON m.salad_id = s.id
        LEFT JOIN food dr ON m.drink_id = dr.id
        LEFT JOIN food o ON m.other_id = o.id
        WHERE m.knimi = $1
        ORDER BY m.mealname ASC;
      `;
      values = [knimi];
    }

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      console.log("No meals found");
      return res.status(404).json({ message: 'No meals found' });
    }

    console.log("Results sent: ", result.rowCount);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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

  const existingUserQuery = 'SELECT * FROM users WHERE knimi = $1';
  const existingUserValues = [knimi];
  const existingUserResult = await pool.query(existingUserQuery, existingUserValues);

  if (existingUserResult.rowCount > 0) {
    return res.status(400).json({ error: 'Username already exists' });
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

  // Calculate the start and end of the current day
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  try {
    // Fetch calories consumed from midnight to midnight of the current day
    const data = await pool.query(
      'SELECT kalorit FROM food WHERE knimi = $1 AND create_time BETWEEN $2 AND $3',
      [knimi, startOfDay, endOfDay]
    );
    const eaten = data.rows.reduce((total, row) => total + row.kalorit, 0);
    console.log(eaten);
    await pool.query('UPDATE calories SET food = $1 WHERE knimi = $2', [eaten, knimi]);

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
  const query = 'SELECT * FROM food WHERE knimi = $1';
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
