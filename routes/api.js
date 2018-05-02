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

router.get('/geodata', async (req, res, next) => {
    var q = req.query;
    var obj = {};
    var climateInfo = await ClimateDataInfo.findOne({name:q.dataset});
    var climateData = await ClimateData(q.dataset, q.geoVariable, q.frequency).getMeanValue(new Date(q.startDate), new Date(q.endDate));
    obj.attribute = q.geoVariable;
    //obj.data = grid2geojson.toGeoJSON(climateInfo.lat, climateInfo.lon, climateData.value);
    obj.geoData = climateData.value;
    //obj.geoLat = climateInfo[0].lat;
    //obj.geoLon = climateInfo[0].lon;
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
    obj.data = await ClimateData(q.dataset, q.geoVariable, q.frequency).getAreaMeanValueList(new Date(q.startDate), new Date(q.endDate));
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

module.exports = router;