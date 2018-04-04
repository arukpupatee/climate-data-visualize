var express = require('express');
var router = express.Router();
var moment = require('moment');
var grid2geojson = require('grid2geojson');

var ClimateDataInfo = require('../models/ClimateDataInfo');
var StationInfo = require('../models/StationDataInfo');
var ClimateData = require('../models/ClimateData');
var StationData = require('../models/StationData');

/* GET home page. */
router.get('/', async (req, res, next) => {
  var info = await ClimateDataInfo.findOne({name:'MPI_RF'});
  
  var obj = {
    dataset: 'MPI_RF',
    attribute: 'tas',
    frequency: 'Daily',
    date: {
      //min: moment(new Date(Math.min.apply(null, info.date))).format('YYYY-MM-DD'),
      //max: moment(new Date(Math.max.apply(null, info.date))).format('YYYY-MM-DD')
      min: '1970-01-02',
      max: '2005-01-31'
    }
  };
  obj.date.start = obj.date.min;
  obj.date.end = obj.date.min;

  if( Object.keys(req.query).length != 0 ) { // if req.query != {}
    obj.dataset = req.query.dataset_select;
    obj.attribute = req.query.attribute_select;
    obj.frequency = req.query.frequency_select
    obj.date.start = req.query.start_date;
    obj.date.end = req.query.end_date;
  }
  
  var dateStart = new Date(obj.date.start);
  dateStart.setSeconds(dateStart.getSeconds() - 1);

  var dateEnd = new Date(obj.date.end);
  dateEnd.setSeconds(dateEnd.getSeconds() - 1);

  var climateData = await ClimateData(obj.dataset, obj.attribute, obj.frequency).getMeanValue(dateStart, dateEnd);
  
  var sAttr;
  if(obj.attribute == 'tas'){
    sAttr = 'meantemp';
  } else if(obj.attribute == 'pr'){
    sAttr = 'rain'
  }
  var stationData = await StationData(obj.dataset, sAttr, obj.frequency).getMeanValue(dateStart, dateEnd);
  if(obj.frequency != 'Daily') {
    obj.date.start = moment(climateData.startDate).format('YYYY-MM-DD');
    obj.date.end = moment(climateData.endDate).format('YYYY-MM-DD');
  }
  obj.geojson = grid2geojson.toGeoJSON(info.lat, info.lon, climateData.value);
  obj.stationData = stationData;

  obj.graphData = await ClimateData(obj.dataset, obj.attribute, obj.frequency).getAreaMeanValueList(dateStart, dateEnd);
  obj.graphData.title = 'Mean '+obj.attribute+' from '+obj.date.start+' to '+obj.date.end;
  res.render('home', obj);
});

module.exports = router;
