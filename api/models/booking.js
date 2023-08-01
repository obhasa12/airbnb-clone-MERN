const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema({
    place: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Place'
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    name: {type: String, required: true},
    phone: {type: String, required: true},
    price: Number
})

const BookingModel = mongoose.model('Booking', bookingSchema);

module.exports = BookingModel;