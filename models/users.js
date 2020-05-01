let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let date = new Date();
date.setDate(date.getDate() + 1);
 // set token's end of validity to 30 days from now
let adminsSchema = new Schema(
    {
        email: String,
        username: String,
        firstName: String,
        lastName: String,
        password: String,
        role: {
            type: String,
            default: 'admin'
        },
        tokenSession: {
            token: {type: String, default: "token"},
            expire: {type: Date, default: date}
        },
        registerDate: Date,
        lastVisit: Date,
        sex: {
            type: String,
            enum: ['male', 'female']
        },
        isLocked: {
            value: {type: Boolean, default: false},
            reason: String,
            until: Date
        },
        phone: {value: String, kind: String},
    }
);
let admins = mongoose.model('admins', adminsSchema);

module.exports = {
    admins
};