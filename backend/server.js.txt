// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

mongoose.connect('mongodb://localhost:27017/culturahabana');

const EventoSchema = new mongoose.Schema({
    nombre: String, categoria: String, descripcion: String,
    fechaInicio: String, fechaFin: String, horaInicio: String,
    horaFin: String, precio: Number, ubicacion: String,
    poster: String, organizador: String, telefono: String,
    lat: Number, lng: Number
});

const Evento = mongoose.model('Evento', EventoSchema);

app.get('/api/eventos', async (req, res) => {
    const eventos = await Evento.find();
    res.json(eventos);
});

app.post('/api/eventos', async (req, res) => {
    const evento = new Evento(req.body);
    await evento.save();
    res.json(evento);
});

app.listen(3000, () => console.log('Servidor en puerto 3000'));
