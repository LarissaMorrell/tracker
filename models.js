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
    company: { type: String },
    position: { type: String },
    store_ids: { type: Array }
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
        store_ids: this.store_ids
    };
}

const storeSchema = mongoose.Schema({
    user_assigned_id: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    generalComments: { type: String },
    tier: { type: String },
    personnel: [{
        name: String,
        position: String,
        comment: String
    }],
    havePaperwork: { type: Boolean },
    wantPaperworkBack: { type: Boolean },
    lastRedeemed: { type: Date }
});

storeSchema.methods.apiRepr = function() {
    return {
        id: this._id,
        user_assigned_id: this.user_assigned_id,
        name: this.name,
        address: this.address,
        city: this.city,
        state: this.state,
        generalComments: this.generalComments,
        tier: this.tier,
        personnel: this.personnel,
        havePaperwork: this.havePaperwork,
        wantPaperworkBack: this.wantPaperworkBack,
        lastRedeemed: this.lastRedeemed
    };
}

const User = mongoose.model('User', userSchema);
const Store = mongoose.model('Store', storeSchema);

module.exports = { User, Store };
