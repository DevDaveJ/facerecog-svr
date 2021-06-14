const express = require('express');
const Clarifai = require('clarifai');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

require("dotenv").config();
const capp = new Clarifai.App({
    apiKey: process.env.CLARIFAI_API_KEY
});

const handleClarifaiCall = (req, res) => {
    capp.models
      .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
      .then(data => {
        return res.json(data)
    })
    .catch(err => res.status(400).json('data error in Clarifai'))
}

const handleImage = (req, res, db) => {
    const { id } = req.body;

    db('users')
        .increment('entries', 1)
        .where({id: id})
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json(err.detail))
}

module.exports = {
    handleImage,
    handleApiCall: handleClarifaiCall
};
