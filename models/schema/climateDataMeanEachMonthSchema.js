var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var climateDataSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    variable: {
        type: String,
        required: true
    },
    month: {
        type: [String],
        index: true
    },
    value: {
        type: [Number],
        required: true
    }
});

module.exports = climateDataSchema;