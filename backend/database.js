const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

// Luodaan yhteys PostgreSQL-tietokantaan ympäristömuuttujilla
const pool = new Pool({
  host: process.env.DB_HOST,       // Ympäristömuuttuja host
  port: process.env.DB_PORT || 5432, // Oletusportti, jos ei määritetty .env-tiedostossa
  user: process.env.DB_USER,       // Käyttäjätunnus
  password: process.env.DB_PASSWORD, // Salasana
  database: process.env.DB_NAME,   // Tietokannan nimi
  ssl: {
    rejectUnauthorized: false      // SSL-vahvistus pois käytöstä kehityksessä
  }
});

module.exports = pool;