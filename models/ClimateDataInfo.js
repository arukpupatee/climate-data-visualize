var mongoose = require('mongoose');

const climateDataInfoSchema = require('./schema/climateDataInfoSchema');

const ClimateDataInfo = mongoose.model('ClimateDataInfo', climateDataInfoSchema, 'ClimateDataInfo');

module.exports = ClimateDataInfo;