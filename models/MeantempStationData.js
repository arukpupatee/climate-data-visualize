var mongoose = require('mongoose');

const stationDataSchema = require('./schema/stationDataSchema');

const StationData = mongoose.model('MeantempStationData', stationDataSchema, 'MeantempStationData');

module.exports = StationData;