var express = require('express');
var router = express.Router();
var moment = require('moment');
var grid2geojson = require('grid2geojson');

var ClimateDataInfo = require('../models/ClimateDataInfo');
var StationInfo = require('../models/StationDataInfo');
var ClimateData = require('../models/ClimateData');
var StationData = require('../models/StationData');
var ClimateDataMeanEachMonthInYearly = require('../models/ClimateDataMeanEachMonthInYearly');

function fixedArray(arr, n){
  let a;
  a = arr.map(function(each_element){
    return Number(each_element.toFixed(2));
  });
  return a;
}

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

  /* default selector is MPI_RF */
  var defaultIndex;
  for(let i=0; i < selector.length; i++){
    if(selector[i].dataset == 'MPI_RF'){
      var temp = selector[0];
      selector[0] = selector[i];
      selector[i] = temp;
      defaultIndex = i;
    }
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
  obj.geoLat = climateInfo[defaultIndex].lat;
  obj.geoLon = climateInfo[defaultIndex].lon;
  obj.landMask = climateInfo[defaultIndex].mask;
  obj.stationData = stationData;

  obj.graphData = {};
  obj.graphData.geoData = await ClimateData(dataset, geoAttr, freq).getAreaMeanValueList(dateStart, dateEnd);
  obj.graphData.stationData = await StationData(dataset, sAttr, freq).getAllStationMeanValueList(dateStart, dateEnd);
  obj.graphData.geoData.valueList = fixedArray(obj.graphData.geoData.valueList, 2);
  obj.graphData.stationData.valueList = fixedArray(obj.graphData.stationData.valueList, 2);

  var geoAttrUnit = climateInfo[defaultIndex].variables[geoAttr].units;
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
    obj.graphEachMonthData.valueList = fixedArray(obj.graphEachMonthData.valueList, 2);
    obj.graphEachMonthData.geoAttrLongName = geoAttrLongName;
    obj.graphEachMonthData.unit = geoAttrUnit;
  }

  obj.graphLongTerm = {};
  obj.graphLongTerm.mpi_rf = await ClimateData('MPI_RF', geoAttr, 'Yearly').getAreaMeanValueList(selector[0].date.min, selector[0].date.max);
  obj.graphLongTerm.mpi_rcp45 = await ClimateData('MPI_RCP45', geoAttr, 'Yearly').getAreaMeanValueList(selector[1].date.min, selector[1].date.max);
  obj.graphLongTerm.mpi_rf.valueList = fixedArray(obj.graphLongTerm.mpi_rf.valueList, 2);
  obj.graphLongTerm.mpi_rcp45.valueList = fixedArray(obj.graphLongTerm.mpi_rcp45.valueList, 2);
  obj.graphLongTerm.geoAttrLongName = geoAttrLongName;
  if(geoAttr == 'pr') {
    obj.graphLongTerm.unit = 'mm/year';
  } else {
    obj.graphLongTerm.unit = geoAttrUnit;
  }

  res.render('home', obj);
});

module.exports = router;
