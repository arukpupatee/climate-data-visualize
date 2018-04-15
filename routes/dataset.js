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
var ClimateDataMeanEachMonth = require('../models/ClimateDataMeanEachMonth');

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
    
});

router.get('/station', async (req, res, next) => {
    res.send('uploading station');
    
    let dirname_meantemp = 'D:/Lesson/Project/Dataset/Climate/upload_to_web/data/station/meantemp/';
    var d = fs.readFileSync(dirname_meantemp+'Station_Info.json', 'utf8');
    d = JSON.parse(d);
    d.is_real_data = (d.is_real_data == 'true');
    var meantemp_info = await StationDataInfo.create(d);

    let dirname_rain = 'D:/Lesson/Project/Dataset/Climate/upload_to_web/data/station/rain/';
    d = fs.readFileSync(dirname_rain+'Station_Info.json', 'utf8');
    d = JSON.parse(d);
    d.is_real_data = (d.is_real_data == 'true');
    var rain_info = await StationDataInfo.create(d);
    
    console.log('meantemp');
    var MeantempStationData = StationData('MPI_RF', 'meantemp', 'Daily');
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

    console.log('rain');
    var RainStationData = StationData('MPI_RF', 'rain', 'Daily');
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
    
});

router.get('/monthly', async (req, res, next) => {

    res.send('monthly');
    
    //mean MPI_RF
    var TemperatureDataDaily = ClimateData('MPI_RF','tas','Daily');
    var TemperatureDataMonthly = ClimateData('MPI_RF','tas','Monthly');
    var PrecipitationDataDaily = ClimateData('MPI_RF','pr','Daily');
    var PrecipitationDataMonthly = ClimateData('MPI_RF','pr','Monthly');
    var MeantempStationDaily = StationData('MPI_RF','meantemp','Daily');
    var MeantempStationMonthly = StationData('MPI_RF','meantemp','Monthly');
    var RainStationDaily = StationData('MPI_RF','rain','Daily');
    var RainStationMonthly = StationData('MPI_RF','rain','Monthly');
    var start_date = moment('1970-01-01');
    var end_date = moment('2005-02-28');
    //var end_date = moment('1970-06-30');
    for(let m = moment(start_date); m.isBefore(end_date, 'days'); m.add(1, 'months')){
        var startDate = new Date(m.format('YYYY-MM-')+'01'+'T00:00:00+07:00');
        var endDate = m.endOf('month').toDate();
        /*
        console.log("--------------------------");
        console.log(startDate+' to '+endDate);

        var meanTemperatureValue = await TemperatureDataDaily.getMeanValue(startDate, endDate);
        //console.log(meanTemperatureValue.startDate+' to '+meanTemperatureValue.endDate);
        await TemperatureDataMonthly.create(meanTemperatureValue);
        
        var sumPrecipitationValue = await PrecipitationDataDaily.getSumValue(startDate, endDate);
        await PrecipitationDataMonthly.create(sumPrecipitationValue);
        
        var meanMeantempValue = await MeantempStationDaily.getMeanValue(startDate, endDate);
        await MeantempStationMonthly.create(meanMeantempValue);
        
        var sumRainValue = await RainStationDaily.getSumValue(startDate, endDate);
        await RainStationMonthly.create(sumRainValue);
        */
    }
});

router.get('/mean_each_month', async (req, res, next) => {

    res.send('mean_each_month');
    
    //mean MPI_RF
    var TemperatureDataMonthly = ClimateData('MPI_RF','tas','Monthly');
    var PrecipitationDataMonthly = ClimateData('MPI_RF','pr','Monthly');

    var TemperatureDataMeanEachMonth = ClimateDataMeanEachMonth('MPI_RF', 'tas');
    var PrecipitationDataMeanEachMonth = ClimateDataMeanEachMonth('MPI_RF', 'pr');
    
    var start_date = moment('1970-01-01');
    var end_date = moment('2006-01-01');

    var countT = [0,0,0,0,0,0,0,0,0,0,0,0];
    var countP = [0,0,0,0,0,0,0,0,0,0,0,0];

    var sumTemperatureEachMonth = null;
    var sumPrecipitationEachMonth = null;

    for(let m = moment(start_date); m.isBefore(end_date, 'days'); m.add(1, 'years')){
        var startDate = new Date(m.format('YYYY')+'-01-01'+'T00:00:00+06:59');
        var endDate = m.endOf('year').toDate();
        console.log(startDate+' to '+endDate);

        let temperatureEachMonth = await await TemperatureDataMonthly.getAreaMeanValueList(startDate, endDate);
        let valueTemperature = temperatureEachMonth.valueList;

        let precipitationEachMonth = await await PrecipitationDataMonthly.getAreaMeanValueList(startDate, endDate);
        let valuePrecipitation = precipitationEachMonth.valueList;

        if (sumTemperatureEachMonth == null) {
            sumTemperatureEachMonth = valueTemperature;
        } else {
            for(let i=0; i<value.lenth; i++){
                sumTemperatureEachMonth[i] = sumTemperatureEachMonth[i] + valueTemperature[i]
                countT[i] = countT[i] + 1;
            }
        }

        if (sumPrecipitationEachMonth == null) {
            sumPrecipitationEachMonth = valuePrecipitation;
        } else {
            for(let i=0; i<value.lenth; i++){
                sumPrecipitationEachMonth[i] = sumPrecipitationEachMonth[i] + valuePrecipitation[i]
                countP[i] = countP[i] + 1;
            }
        }
    }

    var meanTemperatureEachMonth = []
    for(let i=0; i<value.lenth; i++){
        meanTemperatureEachMonth.append(sumTemperatureEachMonth[i]/countT[i]);
    }

    var meanPrecipitationEachMonth = []
    for(let i=0; i<value.lenth; i++){
        meanPrecipitationEachMonth.append(sumPrecipitationEachMonth[i]/countP[i]);
    }

    var monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    TemperatureDataMeanEachMonth.create({
        name: 'MPI_RF',
        variable: 'tas',
        month: monthList,
        value: meanTemperatureEachMonth
    });

    PrecipitationDataMeanEachMonth.create({
        name: 'MPI_RF',
        variable: 'pr',
        month: monthList,
        value: meanPrecipitationEachMonth
    });
});

router.get('/yearly', async (req, res, next) => {

    res.send('yearly');
    
    //mean MPI_RF
    var TemperatureDataMonthly = ClimateData('MPI_RF','tas','Monthly');
    var TemperatureDataYearly = ClimateData('MPI_RF','tas','Yearly');
    var PrecipitationDataMonthly = ClimateData('MPI_RF','pr','Monthly');
    var PrecipitationDataYearly = ClimateData('MPI_RF','pr','Yearly');
    var MeantempStationMonthly = StationData('MPI_RF','meantemp','Monthly');
    var MeantempStationYearly = StationData('MPI_RF','meantemp','Yearly');
    var RainStationMonthly = StationData('MPI_RF','rain','Monthly');
    var RainStationYearly = StationData('MPI_RF','rain','Yearly');
    var start_date = moment('1970-01-01');
    var end_date = moment('2006-01-01');
    for(let m = moment(start_date); m.isBefore(end_date, 'days'); m.add(1, 'years')){
        var startDate = new Date(m.format('YYYY')+'-01-01'+'T00:00:00+06:59');
        var endDate = m.endOf('year').toDate();
        console.log(startDate+' to '+endDate);
        
        var meanTemperatureValue = await TemperatureDataMonthly.getMeanValue(startDate, endDate);
        console.log(meanTemperatureValue.startDate+' to '+meanTemperatureValue.endDate);
        await TemperatureDataYearly.create(meanTemperatureValue);
        
        var sumPrecipitationValue = await PrecipitationDataMonthly.getSumValue(startDate, endDate);
        await PrecipitationDataYearly.create(sumPrecipitationValue);
        
        var meanMeantempValue = await MeantempStationMonthly.getMeanValue(startDate, endDate);
        await MeantempStationYearly.create(meanMeantempValue);
        
        var sumRainValue = await RainStationMonthly.getSumValue(startDate, endDate);
        await RainStationYearly.create(sumRainValue);
    }
});

module.exports = router;
