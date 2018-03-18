var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var fs = require('fs');

var moment = require('moment');

var ClimateDataInfo = require('../models/ClimateDataInfo');
var TemperatureData = require('../models/TemperatureData');
var PrecipitationData = require('../models/PrecipitationData');
var StationInfo = require('../models/StationInfo');
var MeantempStationData = require('../models/MeantempStationData');
var RainStationData = require('../models/RainStationData');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

/* GET users listing. */
router.get('/', async (req, res, next) => {
    var d;
    
    ClimateDataInfo.
        findOne({
            name: 'MPI_RF'
        }).
        exec((err, data)=>{
            if (err) throw err;
            d = data;
            res.json(d);
        });
    
    
    /*
    var d = await TemperatureData.
        findOne({
            //name: 'MPI_RF'
            //variable: 'tas',
            //time: '01/01/1970'
        }).
        exec();
    res.json(d);
    */
});

module.exports = router;