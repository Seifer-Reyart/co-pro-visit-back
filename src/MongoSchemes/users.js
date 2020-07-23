let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let date = new Date();
date.setDate(date.getDate() + 1); // set token's end of validity to 30 days from now

let usersSchema = new Schema(
    {
            email       	: String,
            username    	: String,
            firstName   	: String,
            lastName    	: String,
            password    	: String,
            role        	: {
                    type: String,
                    enum: ['admin', 'auditor', 'cashier', 'player', 'tech'],
                    default: 'player'
            },
            tokenSession	: {
                    token: {type: String, default: "token"},
                    expire: {type: Date, default: date} 		// set, by default, token's end of validity to 1 day from now
            },
            birthDay   		: Date,
            registerDate   	: Date,
            lastVisit		: Date,
            nationality		: String,										// ISO 3166-1 Alpha 3 i.e ENUM [FRA, ...]
            sex             : {
                    type: String,
                    enum: ['male', 'female']
            },
            pin				:{
                    value		: String,
                    tryCounter	: {type: Number, default: 3},
                    tryLimit	: {type: Number, default: 3}
            },
            isLocked		:{
                    value	: { type: Boolean, default: false },
                    reason	: String,
                    until	: Date
            },
            accounts		:[{
                    label	: { type: String, enum: ['cash', 'bonus'], default: 'cash'},
                    counter	: { type: Number, default: 0 },
                    balance : { type: Number, default: 0 },
                    limit	: { type: Number, default: 999999999999},
                    backup	: { type: Number, default: 0 },

            }],
            phone			: {value: String, kind: String},
            address			: {
                    line1: String,
                    line2: String,
                    city: String,
                    country: String,
                    zipcode: String
            },
            isDeleted: {type: Boolean, default: false}

            //  id                              : {?}                                                   // ID information type, picture of id, detail of ID
            //  photo                           : String,                                                // Link to captured photo on server or in database
            //  relatives                       : {?}                                                   //List of User IDs related to this player and their relation
            //  recommendedBy                   : ?,                                                    //User ID of player recommended this user



            //  rank                            : Number,                                               //Player Rank i.e 1 = Silver 10 = Diamond ...
            //  isBarred                        : {type: Boolean, default: false},
            //  isSuspended                     : {
            //                                          status: {type: Boolean, default: false},
            //                                          until:  {type:  Date, default: null}
            //                                  }

    }
);

let users = mongoose.model('users', usersSchema);

module.exports = users;
