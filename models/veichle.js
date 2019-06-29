const mongoose = require('mongoose');

var VeichleSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    series: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    numberplate: {
        type: String,
        required: true
    },
    entry: {
        type: String,
    },
    exit: {
        type: String,
    },
    image: {
        type: Buffer,
        required: true
    },
    permission: {
        type: Boolean,
        required: true
    },
    new: {
        type: Boolean
    }
}, { strict: false });

//methdos

VeichleSchema.statics.getTotalTime = function () {
    var Veichle = this;

}

VeichleSchema.statics.getTotalVeichles = function () {
    var Veichle = this;
    return Veichle.find({}, { image: 0 });
}
var Veichle = mongoose.model('Veichle', VeichleSchema);

module.exports = Veichle;