let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/coprovisit-prod', { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('DB Connection error : ', err);
});

db.once('open', function() {
    console.log('DB Connection successed on mongodb://localhost:27017/coprovisit');
});



module.exports = mongoose;
