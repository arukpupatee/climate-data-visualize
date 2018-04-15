var mongoose = require('mongoose');

const climateDataMeanEachMonthSchema = require('./schema/climateDataMeanEachMonthSchema');

var ClimateDataMeanEachMonth = (name, variable)=> {
    return mongoose.model('ClimateDataMeanEachMonth_'+name+'_'+variable, climateDataDailySchema, 'ClimateData_'+name+'_'+variable)
};

module.exports = ClimateDataMeanEachMonth;