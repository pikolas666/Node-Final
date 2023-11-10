import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    id: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    bought_tickets: { type: Array, required: true },
    money_balance: { type: Number, required: true }
});

export default mongoose.model('users', UserSchema);