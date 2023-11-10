import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
    id: { type: String },
    title: { type: String, required: true },
    ticket_price: { type: Number, required: true },
    from_location: { type: String, required: true },
    to_location: { type: String, required: true },
    to_location_photo_url: { type: String, required: true }
});

export default mongoose.model('tickets', TicketSchema);