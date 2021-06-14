const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const app = express();

app.use(express.json());
app.use(cors());

require("dotenv").config();
const PORT = process.env.PORT || process.env.LOCAL_PORT;
const HOST = process.env.HOST || 'localhost';

const db = knex({
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT
    }
});

app.get('/api', (req, res) => { 
  console.log('GET on /',
    db.select('count(*)').from('users')
  );
  res.send(db.users) 
});

app.post('/api/signin', (req, res) => { signin.handleSignin(bcrypt, db)(req, res)});

app.post('/api/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });

app.get('/api/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });

app.put('/api/image', (req, res) => { image.handleImage(req, res, db) });

app.post('/api/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(PORT, HOST, () => {
  console.log(`Smartbrain server listening at http://${HOST}:${PORT}`)
})