var express = require('express');
var router = express.Router();
var moment = require('moment');
var grid2geojson = require('grid2geojson');

var ClimateDataInfo = require('../models/ClimateDataInfo');
var TemperatureData = require('../models/TemperatureData');
var PrecipitationData = require('../models/PrecipitationData');
var StationInfo = require('../models/StationInfo');
var MeantempStationData = require('../models/MeantempStationData');
var RainStationData = require('../models/RainStationData');

/* GET home page. */
router.get('/', async (req, res, next) => {
  var info = await ClimateDataInfo.findOne({name:'MPI_RF'});
  
  var obj = {
    attribute: 'Temperature',
    seeing: 'Mean',
    date: {
      //min: moment(new Date(Math.min.apply(null, info.date))).format('YYYY-MM-DD'),
      //max: moment(new Date(Math.max.apply(null, info.date))).format('YYYY-MM-DD')
      min: '1970-01-02',
      max: '2100-03-31'
    }
  };
  obj.date.start = obj.date.min;
  obj.date.end = obj.date.min;

  if( Object.keys(req.query).length != 0 ) { // if req.query != {}
    obj.attribute = req.query.attribute_select;
    obj.seeing = req.query.seeing_select;
    obj.date.start = req.query.start_date;
    obj.date.end = req.query.end_date;
  }
  
  var dateStart = new Date(obj.date.start);
  dateStart.setSeconds(dateStart.getSeconds() - 1);

  var dateEnd = new Date(obj.date.end);
  dateEnd.setSeconds(dateEnd.getSeconds() - 1);

  var climateData;
  var stationData;
  if(obj.attribute == 'Temperature') {
    climateData = await TemperatureData.getMeanValue(dateStart, dateEnd);
    stationData = await MeantempStationData.getMeanValue(dateStart, dateEnd);
  } else if(obj.attribute == 'Precipitation') {
    climateData = await PrecipitationData.getMeanValue(dateStart, dateEnd);
    stationData = await RainStationData.getMeanValue(dateStart, dateEnd);
  }

  obj.geojson = grid2geojson.toGeoJSON(info.lat, info.lon, climateData);
  obj.stationData = stationData;
  
  res.render('home', obj);
});

module.exports = router;
