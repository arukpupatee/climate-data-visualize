var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var variablesSchema = new Schema({
    standard_name: String,
    long_name: String,
    dimension: [],
    units: String
});

var climateDataInfoSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String
    },
    references: {
        type: String
    },
    model_revision: {
        type: String
    },
    grid_size_in_meters: {
        type: Number,
        required: true
    },
    date: {
        type: [Date],
        required: true
    },
    lat: {
        type: [Number],
        required: true
    },
    lon: {
        type: [Number],
        required: true
    },
    lat_meshgrid: {
        type: [[Number]],
        required: true
    },
    lon_meshgrid: {
        type: [[Number]],
        required: true
    },
    variables: {
        type: {variablesSchema}
    }
});

module.exports = climateDataInfoSchema;