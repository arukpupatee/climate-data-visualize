var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stationInfoSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    variable: {
        type: String,
        required: true
    },
    is_real_data: {
        type: Boolean,
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