const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tarea = require('./models/Tareas');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

app.post('/api/tareas', async (req, res) => {
  const { nombre, estado } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre de la tarea es obligatorio.' });
  }

  try {
    const nuevaTarea = new Tarea({ nombre, estado });
    await nuevaTarea.save();
    res.status(201).json(nuevaTarea);
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar la tarea.' });
  }
});

app.get('/api/tareas', async (req, res) => {
  try {
    const tareas = await Tarea.find();
    res.json(tareas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener las tareas.' });
  }
});

app.put('/api/tareas/:id', async (req, res) => {
  const { estado } = req.body;
  try {
    const tareaActualizada = await Tarea.findByIdAndUpdate(req.params.id, { estado }, { new: true });
    if (!tareaActualizada) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json(tareaActualizada);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar la tarea.' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
