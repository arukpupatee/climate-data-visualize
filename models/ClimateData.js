var mongoose = require('mongoose');

const climateDataDailySchema = require('./schema/climateDataDailySchema');
const climateDataMonthlySchema = require('./schema/climateDataMonthlySchema');
const climateDataYearlySchema = require('./schema/climateDataYearlySchema');

var ClimateData = (name, variable, frequency)=> {
    /*
    name = dataset name (ex. MPI_RF, MPI_RCP45)
    variable = variable name (ex. tas, pr)
    frequency = dataset sampling frequency (ex. Daily, Monthly, Yearly)
    */
    if(frequency == 'Daily'){
        return mongoose.model('ClimateData_'+name+'_'+variable+'_'+frequency, climateDataDailySchema, 'ClimateData_'+name+'_'+variable+'_'+frequency)
    } else if(frequency == 'Monthly'){
        return mongoose.model('ClimateData_'+name+'_'+variable+'_'+frequency, climateDataMonthlySchema, 'ClimateData_'+name+'_'+variable+'_'+frequency)
    } else if(frequency == 'Yearly'){
        return mongoose.model('ClimateData_'+name+'_'+variable+'_'+frequency, climateDataYearlySchema, 'ClimateData_'+name+'_'+variable+'_'+frequency)
    } 
};

module.exports = ClimateData;