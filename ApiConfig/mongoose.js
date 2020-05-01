let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/CO-PRO-VISIT', { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });

module.exports = mongoose;
