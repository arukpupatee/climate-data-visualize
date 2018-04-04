var mongoose = require('mongoose');

const stationDataDailySchema = require('./schema/stationDataDailySchema');
const stationDataMonthlySchema = require('./schema/stationDataMonthlySchema');
const stationDataYearlySchema = require('./schema/stationDataYearlySchema');

var StationData = (name, variable, frequency)=> {
    /*
    name = dataset name (ex. MPI_RF, MPI_RCP45)
    variable = variable name (ex. meantemp)
    frequency = dataset sampling frequency (ex. Daily, Monthly, Yearly)
    */
    if(frequency == 'Daily'){
        return mongoose.model('StationData_'+name+'_'+variable+'_'+frequency, stationDataDailySchema, 'StationData_'+name+'_'+variable+'_'+frequency)
    } else if(frequency == 'Monthly'){
        return mongoose.model('StationData_'+name+'_'+variable+'_'+frequency, stationDataMonthlySchema, 'StationData_'+name+'_'+variable+'_'+frequency)
    } else if(frequency == 'Yearly'){
        return mongoose.model('StationData_'+name+'_'+variable+'_'+frequency, stationDataYearlySchema, 'StationData_'+name+'_'+variable+'_'+frequency)
    }
};

module.exports = StationData;