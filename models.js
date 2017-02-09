const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    phone: { type: String },
    position: { type: String, required: true },
    stores: [{
        name: String,
        store_id: String,
        address: String,
        city: String,
        state: String,
        generalComments: String,
        tier: String,
        person: [{
            name: String,
            position: String,
            comment: String
        }],
        havePaperwork: Boolean,
        wantPaperworkBack: Boolean,
        lastRedeemed: Date
    }]
});

userSchema.methods.apiRepr = function() {
    return {
        id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        address: this.address,
        city: this.city,
        state: this.state,
        zip: this.zip,
        phone: this.phone,
        position: this.position,
        stores: this.stores
    };
}

const User = mongoose.model('User', userSchema);

module.exports = { User };
