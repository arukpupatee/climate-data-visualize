var mongoose = require('mongoose');

const stationInfoSchema = require('./schema/stationInfoSchema');

const StationInfo = mongoose.model('StationInfo', stationInfoSchema, 'StationInfo');

module.exports = StationInfo;