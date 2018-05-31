var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var fs = require('fs');
var moment = require('moment');
var grid2geojson = require('grid2geojson');

var ClimateDataInfo = require('../models/ClimateDataInfo');
var StationInfo = require('../models/StationDataInfo');
var ClimateData = require('../models/ClimateData');
var StationData = require('../models/StationData');
var PredictData = require('../models/PredictData');
var ClimateDataMeanEachMonthInYearly = require('../models/ClimateDataMeanEachMonthInYearly');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

function fixedArray(arr, n) {
    let a;
    a = arr.map(function(each_element){
      return Number(each_element.toFixed(2));
    });
    return a;
}

router.get('/geodata', async (req, res, next) => {
    var q = req.query;
    var obj = {};
    var climateInfo = await ClimateDataInfo.findOne({name:q.dataset});
    var climateData = await ClimateData(q.dataset, q.geoVariable, q.frequency).getMeanValue(new Date(q.startDate), new Date(q.endDate));
    obj.attribute = q.geoVariable;
    obj.geoData = climateData.value;
    res.json(obj);
});

router.get('/station', async (req, res, next) => {
    var q = req.query;
    var obj = {};
    var stationInfo = await StationInfo.findOne({name:q.dataset});
    var stationData = await StationData(q.dataset, q.stationVariable, q.frequency).getMeanValue(new Date(q.startDate), new Date(q.endDate));
    obj.attribute = q.stationVariable;
    obj.data = stationData;
    res.json(obj);
});

router.get('/graphData', async (req, res, next) => {
    var q = req.query;
    var obj = {};
    var climateInfo = await ClimateDataInfo.findOne({name:q.dataset});
    obj.data = {};
    if(q.lat1 == 'All') {
        obj.data.geoData = await ClimateData(q.dataset, q.geoVariable, q.frequency).getAreaMeanValueList(new Date(q.startDate), new Date(q.endDate));
        obj.data.stationData = await StationData(q.dataset, q.stationVariable, q.frequency).getAllStationMeanValueList(q.startDate, q.endDate);
        obj.data.predictData = await PredictData(q.dataset, q.stationVariable, q.frequency).getAllStationMeanValueList(q.startDate, q.endDate);
    } else {
        obj.data.geoData = await ClimateData(q.dataset, q.geoVariable, q.frequency).getSpecificAreaMeanValueList(new Date(q.startDate), new Date(q.endDate), climateInfo, q.lat1, q.lon1, q.lat2, q.lon2);
        obj.data.stationData = await StationData(q.dataset, q.stationVariable, q.frequency).getSpecificAreaStationMeanValueList(q.startDate, q.endDate, q.lat1, q.lon1, q.lat2, q.lon2);
        obj.data.predictData = await PredictData(q.dataset, q.stationVariable, q.frequency).getSpecificAreaStationMeanValueList(q.startDate, q.endDate, q.lat1, q.lon1, q.lat2, q.lon2);
    }

    obj.data.geoData.valueList = fixedArray(obj.data.geoData.valueList, 2);
    obj.data.stationData.valueList = fixedArray(obj.data.stationData.valueList, 2);
    obj.data.predictData.valueList = fixedArray(obj.data.predictData.valueList, 2);
    
    var geoAttrLongName = climateInfo.variables[q.geoVariable].long_name;
    var geoAttrUnit = climateInfo.variables[q.geoVariable].units;
    if(q.geoVariable == 'pr') {
        if(q.frequency == 'Monthly') {
            geoAttrUnit = 'mm/month';
        } else if(q.frequency == 'Yearly') {
            geoAttrUnit = 'mm/year';
        }
    }
    obj.data.geoAttrLongName = geoAttrLongName;
    obj.data.unit = geoAttrUnit;
    res.json(obj);
});

router.get('/graphEachMonth', async (req, res, next) => {
    var q = req.query;
    var obj = {};
    var climateInfo = await ClimateDataInfo.findOne({name:q.dataset});
    obj.data = await ClimateDataMeanEachMonthInYearly(q.dataset, q.geoVariable).getValueList(new Date(q.startDate), new Date(q.endDate));
    
    obj.data.valueList = fixedArray(obj.data.valueList, 2);
    
    var geoAttrLongName = climateInfo.variables[q.geoVariable].long_name;
    var geoAttrUnit = climateInfo.variables[q.geoVariable].units;
    if(q.geoVariable == 'pr') {
        if(q.frequency == 'Monthly') {
            geoAttrUnit = 'mm/month';
        } else if(q.frequency == 'Yearly') {
            geoAttrUnit = 'mm/year';
        }
    }
    obj.data.geoAttrLongName = geoAttrLongName;
    obj.data.unit = geoAttrUnit;
    res.json(obj);
});

router.get('/graphLongTerm', async (req, res, next) => {
    var q = req.query;
    var obj = {};
    var climateInfo = await ClimateDataInfo.find({});
    for(let i=0; i < climateInfo.length; i++){
        if(climateInfo[i].name == 'MPI_RF'){
            var temp = climateInfo[0];
            climateInfo[0] = climateInfo[i];
            climateInfo[i] = temp;
        }
    }
    obj.data = {};
    var mpi_rf_date_min = moment(Math.min.apply(null, climateInfo[0].date)).format('YYYY-MM-DD');
    var mpi_rf_date_max = moment(Math.max.apply(null, climateInfo[0].date)).format('YYYY-MM-DD');
    var mpi_rcp45_date_min = moment(Math.min.apply(null, climateInfo[1].date)).format('YYYY-MM-DD');
    var mpi_rcp45_date_max = moment(Math.max.apply(null, climateInfo[1].date)).format('YYYY-MM-DD');

    if(q.lat1 == 'All') {
        obj.data.mpi_rf = await ClimateData(climateInfo[0].name, q.geoVariable, 'Yearly').getAreaMeanValueList(mpi_rf_date_min, mpi_rf_date_max);
        obj.data.mpi_rcp45 = await ClimateData(climateInfo[1].name, q.geoVariable, 'Yearly').getAreaMeanValueList(mpi_rcp45_date_min, mpi_rcp45_date_max);
        obj.data.stationData = await StationData('MPI_RF', q.stationVariable, 'Yearly').getAllStationMeanValueList(mpi_rf_date_min, mpi_rf_date_max);
        obj.data.stationData_mpi_rcp45 = await StationData('MPI_RCP45', q.stationVariable, 'Yearly').getAllStationMeanValueList(mpi_rcp45_date_min, mpi_rcp45_date_max);
        obj.data.predictData = await PredictData('MPI_RF', q.stationVariable, 'Yearly').getAllStationMeanValueList(mpi_rf_date_min, mpi_rf_date_max);
        obj.data.predictData_mpi_rcp45 = await PredictData('MPI_RCP45', q.stationVariable, 'Yearly').getAllStationMeanValueList(mpi_rcp45_date_min, mpi_rcp45_date_max);
    } else {
        obj.data.mpi_rf = await ClimateData(climateInfo[0].name, q.geoVariable, 'Yearly').getSpecificAreaMeanValueList(mpi_rf_date_min, mpi_rf_date_max, climateInfo[0], q.lat1, q.lon1, q.lat2, q.lon2);
        obj.data.mpi_rcp45 = await ClimateData(climateInfo[1].name, q.geoVariable, 'Yearly').getSpecificAreaMeanValueList(mpi_rcp45_date_min, mpi_rcp45_date_max, climateInfo[1], q.lat1, q.lon1, q.lat2, q.lon2);
        obj.data.stationData = await StationData('MPI_RF', q.stationVariable, 'Yearly').getSpecificAreaStationMeanValueList(mpi_rf_date_min, mpi_rf_date_max, q.lat1, q.lon1, q.lat2, q.lon2);
        obj.data.stationData_mpi_rcp45 = await StationData('MPI_RCP45', q.stationVariable, 'Yearly').getSpecificAreaStationMeanValueList(mpi_rcp45_date_min, mpi_rcp45_date_max, q.lat1, q.lon1, q.lat2, q.lon2);
        obj.data.predictData = await PredictData('MPI_RF', q.stationVariable, 'Yearly').getSpecificAreaStationMeanValueList(mpi_rf_date_min, mpi_rf_date_max, q.lat1, q.lon1, q.lat2, q.lon2);
        obj.data.predictData_mpi_rcp45 = await PredictData('MPI_RCP45', q.stationVariable, 'Yearly').getSpecificAreaStationMeanValueList(mpi_rcp45_date_min, mpi_rcp45_date_max, q.lat1, q.lon1, q.lat2, q.lon2);
    }

    
    obj.data.mpi_rf.valueList.push(obj.data.mpi_rcp45.valueList[0])
    obj.data.mpi_rf.dateList.push(obj.data.mpi_rcp45.dateList[0])
    obj.data.mpi_rf.valueList = fixedArray(obj.data.mpi_rf.valueList, 2);
    obj.data.mpi_rcp45.valueList = fixedArray(obj.data.mpi_rcp45.valueList, 2);

    for(let i=0; i < obj.data.stationData_mpi_rcp45.valueList.length; i++){
        obj.data.stationData.valueList.push(obj.data.stationData_mpi_rcp45.valueList[i]);
        obj.data.stationData.dateList.push(obj.data.stationData_mpi_rcp45.dateList[i]);
    }
    obj.data.stationData.valueList = fixedArray(obj.data.stationData.valueList, 2);
    
    for(let i=0; i < obj.data.predictData_mpi_rcp45.valueList.length; i++){
        obj.data.predictData.valueList.push(obj.data.predictData_mpi_rcp45.valueList[i]);
        obj.data.predictData.dateList.push(obj.data.predictData_mpi_rcp45.dateList[i]);
    }
    obj.data.predictData.valueList = fixedArray(obj.data.predictData.valueList, 2);
    
    var geoAttrLongName = climateInfo[0].variables[q.geoVariable].long_name;
    var geoAttrUnit = climateInfo[0].variables[q.geoVariable].units;
    if(q.geoVariable == 'pr') {
        geoAttrUnit = 'mm/year';
    }
    obj.data.geoAttrLongName = geoAttrLongName;
    obj.data.unit = geoAttrUnit;
    res.json(obj);
});

module.exports = router;