const mongoose = require('mongoose');

var ListSchema = new mongoose.Schema({
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
    is: {
        type: String,
        required: true
    },
    numberplate: {
        type: String,
        required: true
    }
}, { strict: false });

ListSchema.statics.getAllList = function () {
    var List = this;
    return List.find({})
}
var List = mongoose.model('List', ListSchema);

module.exports = List;