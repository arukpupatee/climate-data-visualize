var mongoose = require('mongoose');

const climateDataSchema = require('./schema/climateDataSchema');

var ClimateData = (name, variable, frequency)=> {
    /*
    name = dataset name (ex. MPI_RF, MPI_RCP45)
    variable = variable name (ex. tas, pr)
    frequency = dataset sampling frequency (ex. DAILY, MONTHLY, YEARLY)
    */
    return mongoose.model('ClimateData_'+name+'_'+variable+'_'+frequency, climateDataSchema, 'ClimateData_'+name+'_'+variable+'_'+frequency)
};

module.exports = ClimateData;