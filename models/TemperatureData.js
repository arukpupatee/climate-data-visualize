var mongoose = require('mongoose');

const climateDataSchema = require('./schema/climateDataSchema');

const TemperatureData = mongoose.model('TemperatureData', climateDataSchema, 'TemperatureData');

module.exports = TemperatureData;