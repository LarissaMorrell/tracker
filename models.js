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
        name: { type: String },
        id: { type: String },
        address: { type: String },
        city: { type: String },
        state: { type: String },
        generalComments: { type: String },
        tier: { type: String },
        person: [{
            name: { type: String },
            position: { type: String },
            comment: { type: String }
        }],
        havePaperwork: { type: Boolean },
        wantPaperworkBack: { type: Boolean },
        lastRedeemed: { type: Date }
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
        stores: [{
            name: this.name,
            id: this.id,  //
            address: this.address,
            city: this.city,
            state: this.state,
            generalComments: this.generalComments,
            tier: this.tier,
            person: [{
                name: this.person,
                position: this.position,
                comment: this.comment
            }],
            havePaperwork: this.havePaperwork,
            wantPaperworkBack: this.wantPaperworkBack,
            lastRedeemed: this.lastRedeemed
        }]
    };
}

const User = mongoose.model('User', userSchema);

module.exports = { User };
