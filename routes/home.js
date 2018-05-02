var express = require('express');
var router = express.Router();
var moment = require('moment');
var grid2geojson = require('grid2geojson');

var ClimateDataInfo = require('../models/ClimateDataInfo');
var StationInfo = require('../models/StationDataInfo');
var ClimateData = require('../models/ClimateData');
var StationData = require('../models/StationData');
var ClimateDataMeanEachMonthInYearly = require('../models/ClimateDataMeanEachMonthInYearly');

/* GET home page. */
router.get('/', async (req, res, next) => {
  //var info = await ClimateDataInfo.findOne({name:'MPI_RF'});

  var climateInfo = await ClimateDataInfo.find({}, {
    name:1, 
    date:1, 
    variables:1, 
    lat:1, 
    lon:1, 
    mask:1
  });
  var stationInfo = await StationInfo.find({});

  var selector = [];
  for(let i=0; i<climateInfo.length; i++){
    let geoVariables = []
    let geoVariablesKeys = Object.keys(climateInfo[i].variables)
    for(let j=0; j<geoVariablesKeys.length; j++){
      /* fix show only tas and pr because now only have this data */
      if( (geoVariablesKeys[j]!='tas') && (geoVariablesKeys[j]!='pr') ){ 
        continue;
      }
      /* -------------------------------------------------------- */
      geoVariables.push({
        name: geoVariablesKeys[j],
        longName: climateInfo[i].variables[geoVariablesKeys[j]].long_name
      });
    }
    let stationVariables = [];
    for(let j=0; j<stationInfo.length; j++){
      if(climateInfo[i].name == stationInfo[j].name){
        stationVariables.push(stationInfo[j].variable)
      }
    }
    selector.push({
      dataset: climateInfo[i].name,
      date: {
        //min: moment(new Date(Math.min.apply(null, climateInfo[i].date))).subtract(1, "days").format('YYYY-MM-DD'),
        //max: moment(new Date(Math.max.apply(null, climateInfo[i].date))).subtract(1, "days").format('YYYY-MM-DD')
        min: moment(Math.min.apply(null, climateInfo[i].date)).format('YYYY-MM-DD'),
        max: moment(Math.max.apply(null, climateInfo[i].date)).format('YYYY-MM-DD')
      },
      geoVariables: [geoVariables[1], geoVariables[0]], //geoVariables, //swap fix because now only have tas and pr
      stationVariables: stationVariables,
      frequency: ['Yearly', 'Monthly', 'Daily']
    });
  }

  var obj = {
    selector: selector
  };

  var defaultSelect = selector[0];

  var dataset = defaultSelect.dataset;
  var geoAttr = defaultSelect.geoVariables[0].name;
  var geoAttrLongName = defaultSelect.geoVariables[0].longName;
  var freq = defaultSelect.frequency[0];
  var sAttr = defaultSelect.stationVariables[0];
  var dStart = defaultSelect.date.min;
  var dEnd = defaultSelect.date.max;
  
  var dateStart = new Date(dStart);
  //dateStart.setSeconds(dateStart.getSeconds() - 1);
  var dateEnd = new Date(dEnd);
  //dateEnd.setSeconds(dateEnd.getSeconds() - 1);

  var climateData = await ClimateData(dataset, geoAttr, freq).getMeanValue(dateStart, dateEnd);
  var stationData = await StationData(dataset, sAttr, freq).getMeanValue(dateStart, dateEnd);
  
  obj.geoData = climateData.value;
  obj.geoLat = climateInfo[0].lat;
  obj.geoLon = climateInfo[0].lon;
  obj.landMask = climateInfo[0].mask;
  obj.stationData = stationData;

  obj.graphData = await ClimateData(dataset, geoAttr, freq).getAreaMeanValueList(dateStart, dateEnd);

  var geoAttrUnit = climateInfo[0].variables[geoAttr].units;
  if(geoAttr == 'pr') {
    if(freq == 'Monthly') {
      geoAttrUnit = 'mm/month';
    } else if(freq == 'Yearly') {
      geoAttrUnit = 'mm/year';
    }
  }
  obj.graphData.geoAttrLongName = geoAttrLongName;
  obj.graphData.unit = geoAttrUnit;

  if(freq == 'Yearly'){
    obj.graphEachMonthData = await ClimateDataMeanEachMonthInYearly(dataset, geoAttr).getValueList(dateStart, dateEnd);
    obj.graphEachMonthData.geoAttrLongName = geoAttrLongName;
    obj.graphEachMonthData.unit = geoAttrUnit;
  }

  res.render('home', obj);
});

module.exports = router;
