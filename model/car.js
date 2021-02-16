//создание схемы-модели машины для БД
const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    photo: { type: String, required: true },
    name: { type: String, required: true },
    color: { type: String, required: true },
    price: { type: Number, required: true },
});

const Car = mongoose.model("Сar", carSchema);
module.exports = Car;