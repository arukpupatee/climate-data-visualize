var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var fs = require('fs');
var moment = require('moment');

var ClimateDataInfo = require('../models/ClimateDataInfo');
var StationDataInfo = require('../models/StationDataInfo');
var ClimateData = require('../models/ClimateData');
var StationData = require('../models/StationData');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

router.get('/', async (req, res, next) => {
    res.render('dataset/index');
});

router.get('/create', async (req, res, next) => {
    res.render('dataset/create');
});

router.post('/create', async (req, res, next) => {
    var datasetType = req.body;
    var files = req.files;
    console.log(datasetType);
    console.log(files);
    res.redirect(req.baseUrl);
});

router.get('/rcm', async (req, res, next) => {

    res.send('uploading');

    //upload mpi_rf
    
    /*
    let dirname_rf = 'D:/Lesson/Project/Dataset/Climate/upload_to_web/data/MPI_RF/';
    var d = fs.readFileSync(dirname_rf+'Climate_Data_Info.json', 'utf8');
    d = JSON.parse(d);
    d.date = d.date.map( (date_string)=>{ return new Date(date_string) } );
    ClimateDataInfo.create(d, (err)=>{
        if (err) throw err;
    });

    var TemperatureData = ClimateData('MPI_RF', 'tas', 'Daily');
    var PrecipitationData = ClimateData('MPI_RF', 'pr', 'Daily');

    var insert_MPI_RF = async ()=>{
        var start_date = moment('1970-01-01');
        var end_date = moment('2005-01-31');
        for(let m = moment(start_date); m.isBefore(end_date, 'days'); m.add(1, 'months')){
            console.log(m.format('YYYY-MM-DD'));
            let dir = 'D:/Lesson/Project/Dataset/Climate/upload_to_web/data/MPI_RF/';
            let obj1 = fs.readFileSync(dir+'tas-'+m.format('YYYYMM')+'.json', 'utf8');
            let obj2 = fs.readFileSync(dir+'pr-'+m.format('YYYYMM')+'.json', 'utf8');
            obj1 = JSON.parse(obj1);
            obj2 = JSON.parse(obj2);

            obj1.map((obj)=>{
                obj.date = new Date(obj.date);
                obj.value = obj.value.map((row)=>{
                    let newRow = row.map((col)=>{
                        return col.toFixed(4);
                    });
                    return newRow;
                });
            });
            obj2.map((obj)=>{
                obj.date = new Date(obj.date);
            });

            await TemperatureData.create(obj1);
            await PrecipitationData.create(obj2);

            obj1 = null;
            obj2 = null;
        }
    }
    await insert_MPI_RF();

    // upload mpi_rcp45

    let dirname_rcp = 'D:/Lesson/Project/Dataset/Climate/upload_to_web/data/MPI_RCP45/';
    d = fs.readFileSync(dirname_rcp+'Climate_Data_Info.json', 'utf8');
    d = JSON.parse(d);
    d.date = d.date.map( (date_string)=>{ return new Date(date_string) } );
    ClimateDataInfo.create(d, (err)=>{
        if (err) throw err;
    });

    TemperatureData = ClimateData('MPI_RCP45', 'tas', 'Daily');
    PrecipitationData = ClimateData('MPI_RCP45', 'pr', 'Daily');

    var insert_MPI_RCP = async ()=>{
        var start_date = moment('2006-01-01');
        var end_date = moment('2100-03-31');
        for(let m = moment(start_date); m.isBefore(end_date, 'days'); m.add(1, 'months')){
            console.log(m.format('YYYY-MM-DD'));
            let dir = 'D:/Lesson/Project/Dataset/Climate/upload_to_web/data/MPI_RCP45/';
            let obj1 = fs.readFileSync(dir+'tas-'+m.format('YYYYMM')+'.json', 'utf8');
            let obj2 = fs.readFileSync(dir+'pr-'+m.format('YYYYMM')+'.json', 'utf8');
            obj1 = JSON.parse(obj1);
            obj2 = JSON.parse(obj2);

            obj1.map((obj)=>{
                obj.date = new Date(obj.date);
                obj.value = obj.value.map((row)=>{
                    let newRow = row.map((col)=>{
                        return col.toFixed(4);
                    });
                    return newRow;
                });
            });
            obj2.map((obj)=>{
                obj.date = new Date(obj.date);
            });

            await TemperatureData.create(obj1);
            await PrecipitationData.create(obj2);

            obj1 = null;
            obj2 = null;
        }
    }
    await insert_MPI_RCP();
    */
});

router.get('/station', async (req, res, next) => {
    res.send('uploading station');
    /*
    let dirname_meantemp = 'D:/Lesson/Project/Dataset/Climate/upload_to_web/data/station/meantemp/';
    var d = fs.readFileSync(dirname_meantemp+'Station_Info.json', 'utf8');
    d = JSON.parse(d);
    var meantemp_info = await StationInfo.create(d);

    let dirname_rain = 'D:/Lesson/Project/Dataset/Climate/upload_to_web/data/station/rain/';
    d = fs.readFileSync(dirname_rain+'Station_Info.json', 'utf8');
    d = JSON.parse(d);
    var rain_info = await StationInfo.create(d);
    
    console.log('meantemp');
    var insert_meantemp = async(code) => {
        for(let i=0; i<code.length; i++){
            let s_code = code[i];
            console.log(s_code);
            let data = fs.readFileSync(dirname_meantemp+s_code+'.json', 'utf8');
            data = JSON.parse(data);
            await MeantempStationData.create(data);
            data = null;
        }
    };
    await insert_meantemp(meantemp_info.code);

    console.log('rain')
    var insert_rain = async(code) => {
        for(let i=0; i<code.length; i++){
            let s_code = code[i];
            console.log(s_code);
            let data = fs.readFileSync(dirname_rain+s_code+'.json', 'utf8');
            data = JSON.parse(data);
            await RainStationData.create(data);
            data = null;
        }
    };
    await insert_rain(rain_info.code);
    */
});

router.get('/rcm_mean_monthly', async (req, res, next) => {
    var start_date = moment('1970-01-01');
    //var end_date = moment('2005-01-31');
    var end_date = moment('1970-03-31');
    for(let m = moment(start_date); m.isBefore(end_date, 'days'); m.add(1, 'months')){
        var startDate = new Date(m.format('YYYY-MM-')+'01');
        var endDate = m.endOf('month');
        //console.log(m);
        //var info = await TemperatureData.findOne({}).where()
        //var meanValue = await TemperatureData.getMeanValue(dateStart, dateEnd);
    }
    res.send('rcm_mean_monthly');
});

router.get('/rcm_mean_yearly', async (req, res, next) => {

    res.send('rcm_mean_monthly');
});

module.exports = router;
