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
    } else {
        obj.data.geoData = await ClimateData(q.dataset, q.geoVariable, q.frequency).getSpecificAreaMeanValueList(new Date(q.startDate), new Date(q.endDate), climateInfo, q.lat1, q.lon1, q.lat2, q.lon2);
        obj.data.stationData = await StationData(q.dataset, q.stationVariable, q.frequency).getSpecificAreaStationMeanValueList(q.startDate, q.endDate, q.lat1, q.lon1, q.lat2, q.lon2);
    }

    obj.data.geoData.valueList = fixedArray(obj.data.geoData.valueList, 2);
    obj.data.stationData.valueList = fixedArray(obj.data.stationData.valueList, 2);
    
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
    obj.data = {};
    var mpi_rf_date_min = moment(Math.min.apply(null, climateInfo[0].date)).format('YYYY-MM-DD');
    var mpi_rf_date_max = moment(Math.max.apply(null, climateInfo[0].date)).format('YYYY-MM-DD');
    var mpi_rcp45_date_min = moment(Math.min.apply(null, climateInfo[1].date)).format('YYYY-MM-DD');
    var mpi_rcp45_date_max = moment(Math.max.apply(null, climateInfo[1].date)).format('YYYY-MM-DD');
    obj.data.mpi_rf = await ClimateData(climateInfo[0].name, q.geoVariable, 'Yearly').getAreaMeanValueList(mpi_rf_date_min, mpi_rf_date_max);
    obj.data.mpi_rcp45 = await ClimateData(climateInfo[1].name, q.geoVariable, 'Yearly').getAreaMeanValueList(mpi_rcp45_date_min, mpi_rcp45_date_max);
    
    obj.data.mpi_rf.valueList = fixedArray(obj.data.mpi_rf.valueList, 2);
    obj.data.mpi_rcp45.valueList = fixedArray(obj.data.mpi_rcp45.valueList, 2);
    
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