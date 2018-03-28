var mongoose = require('mongoose');

const stationDataSchema = require('./schema/stationDataSchema');

var StationData = (name, variable, frequency)=> {
    /*
    name = dataset name (ex. MPI_RF, MPI_RCP45)
    variable = variable name (ex. meantemp)
    frequency = dataset sampling frequency (ex. DAILY, MONTHLY, YEARLY)
    */
    return mongoose.model('StationData_'+name+'_'+variable+'_'+frequency, stationDataSchema, 'StationData_'+name+'_'+variable+'_'+frequency)
};

module.exports = StationData;