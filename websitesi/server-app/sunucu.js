const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// PostgreSQL bağlantısı
const pool = new Pool({
  user: 'postgres', //postgre adı
  host: 'localhost',
  database: 'login_db',
  password: '1337', //postgre sifre
  port: 5432
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2;', [email, password]);

    if (result.rows.length > 0) { //eger sorgu dogru yanit dondururse.
      res.status(200).json({ message: 'dogru' });
    } else {
      res.status(401).json({ message: 'hatali' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası!' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
