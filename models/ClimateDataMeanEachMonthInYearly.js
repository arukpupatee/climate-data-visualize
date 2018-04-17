var mongoose = require('mongoose');

const climateDataMeanEachMonthInYearlySchema = require('./schema/climateDataMeanEachMonthInYearlySchema');

var ClimateDataMeanEachMonthInYearly = (name, variable)=> {
    return mongoose.model('ClimateData_'+name+'_'+variable+'_MeanEachMonthInYearly', climateDataMeanEachMonthInYearlySchema, 'ClimateData_'+name+'_'+variable+'_MeanEachMonthInYearly')
};

module.exports = ClimateDataMeanEachMonthInYearly;