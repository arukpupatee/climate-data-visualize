var mongoose = require('mongoose');

const stationDataSchema = require('./schema/stationDataSchema');

const StationData = mongoose.model('RainStationData', stationDataSchema, 'RainStationData');

module.exports = StationData;