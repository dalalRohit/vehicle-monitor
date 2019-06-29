var mongoose = require('mongoose');
require('dotenv').config();
var { url } = require('./../models/setting');

if (process.env.NODE_ENV === 'test') {
    mongoose.Promise = global.Promise; //setting Promise
    mongoose.connect(url, { useNewUrlParser: true }, function (err) {
        if (!err) {
            console.log("TEST: Connected to MongoDB!");
            console.log(url);

        }
    });
}
else {
    mongoose.Promise = global.Promise; //setting Promise
    mongoose.connect(url, { useNewUrlParser: true }, function (err) {
        if (!err) {
            console.log("PRODUCTION: Connected to mongoDB!");
            console.log(url);

        }
    });
}


module.exports = { mongoose: mongoose };
