const mongoose = require('mongoose');
var moment = require('moment');

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
    },
    inside: {
        type: Boolean,
        required: true
    }
}, { strict: false });


VeichleSchema.statics.getVeichleByNumber = function (number) {
    var Veichle = this;
    return Veichle.findOne({ numberplate: number });

}

VeichleSchema.statics.markExit = async function (exit) {
    var Veichle = this;
    return Veichle.updateOne({ 'numberplate': exit }, {
        $set: {
            inside: false,
            exit: moment().format('MMMM Do YYYY, h:mm:ss a')
        }
    })
}
VeichleSchema.statics.getEnteredVeichles = function () {
    var Veichle = this;
    return Veichle.find({ inside: true });
}

VeichleSchema.statics.getTotalVeichles = function () {
    var Veichle = this;
    return Veichle.find({}, { image: 0 });
}
var Veichle = mongoose.model('Veichle', VeichleSchema);

module.exports = Veichle;