let mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

let notificationsSchema = new Schema({
    date_seen           : {
        type: String,
        required: false,
    },
    date_create         : {
        type: String,
        required: true,
    },
    title               : {
        type: String,
        required: true
    },
    message                : {
        type: String,
        required: true
    },
    url                    : {
        type: String,
        required: false
    },
    emitter_id          :  {
        type: Schema.Types.ObjectId,
        required: true
    },
    receiver_id          :  {
        type: Schema.Types.ObjectId,
        required: true
    }
});

let notifications = mongoose.model('notifications', notificationsSchema);

module.exports = notifications;
