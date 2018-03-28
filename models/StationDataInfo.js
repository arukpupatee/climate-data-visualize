var mongoose = require('mongoose');

const stationDataInfoSchema = require('./schema/stationDataInfoSchema');

const StationDataInfo = mongoose.model('StationDataInfo', stationDataInfoSchema, 'StationDataInfo');

module.exports = StationDataInfo;