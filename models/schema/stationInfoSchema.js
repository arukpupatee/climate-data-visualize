var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stationInfoSchema = new Schema({
    variable: {
        type: String,
        required: true
    },
    code: {
        type: [String],
        required: true
    },
    lat: {
        type: [Number],
        required: true
    },
    lon: {
        type: [Number],
        required: true
    }
});

module.exports = stationInfoSchema;