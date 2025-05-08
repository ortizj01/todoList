const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'completada', 'aplazada', 'rechazada'],
    default: 'pendiente'
  }
});

module.exports = mongoose.model('Tarea', tareaSchema);
