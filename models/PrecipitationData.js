var mongoose = require('mongoose');

const climateDataSchema = require('./schema/climateDataSchema');

const PrecipitationData = mongoose.model('PrecipitationData', climateDataSchema, 'PrecipitationData');

module.exports = PrecipitationData;