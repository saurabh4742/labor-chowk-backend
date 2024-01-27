const mongoose = require('mongoose');
const sahayakSchema =new mongoose.Schema( {
    name: { type: String, required: true },
    password: { type: String, required: true },
    pincode: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    labors: [{ type: Schema.Types.ObjectId, ref: 'Labor' }],
    profileImage: { type: String, required: true },
});
const Sahayak = mongoose.model('Sahayak', sahayakSchema);

module.exports = Sahayak;