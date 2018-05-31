var mongoose = require('mongoose');

const predictDataDailySchema = require('./schema/predictDataDailySchema');
const predictDataMonthlySchema = require('./schema/predictDataMonthlySchema');
const predictDataYearlySchema = require('./schema/predictDataYearlySchema');

var PredictData = (name, variable, frequency)=> {
    /*
    name = dataset name (ex. MPI_RF, MPI_RCP45)
    variable = variable name (ex. meantemp)
    frequency = dataset sampling frequency (ex. Daily, Monthly, Yearly)
    */
    if(frequency == 'Daily'){
        return mongoose.model('PredictData_'+name+'_'+variable+'_'+frequency, predictDataDailySchema, 'PredictData_'+name+'_'+variable+'_'+frequency)
    } else if(frequency == 'Monthly'){
        return mongoose.model('PredictData_'+name+'_'+variable+'_'+frequency, predictDataMonthlySchema, 'PredictData_'+name+'_'+variable+'_'+frequency)
    } else if(frequency == 'Yearly'){
        return mongoose.model('PredictData_'+name+'_'+variable+'_'+frequency, predictDataYearlySchema, 'PredictData_'+name+'_'+variable+'_'+frequency)
    }
};

module.exports = PredictData;