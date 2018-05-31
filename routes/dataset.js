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
var PredictData = require('../models/PredictData');
var ClimateDataMeanEachMonthInYearly = require('../models/ClimateDataMeanEachMonthInYearly');

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

/*
router.get('/clear', async (req, res, next) => {
    var climateInfo = await ClimateDataInfo.findOne({
        name: 'MPI_RCP45'
    }, {
        date:1
      });

    for(let i=climateInfo.date.length-1; i>=0; i--){
        if(climateInfo.date[i] >= new Date('2100-01-01')){
            console.log(climateInfo.date[i]);
            climateInfo.date.pop();
        }
    }
    await ClimateDataInfo.update({name:'MPI_RCP45'},{date:climateInfo.date});
    res.send('clear');
});
*/

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
        //var start_date = moment('1970-01-01');
        var start_date = moment('2005-02-01');
        var end_date = moment('2006-01-01');
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
    //await insert_MPI_RF();

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
    //await insert_MPI_RCP();
    
});

router.get('/station', async (req, res, next) => {
    res.send('uploading station');
    
    let dirname_meantemp = 'D:/Lesson/Project/Dataset/Climate/upload_to_web/data/station/meantemp/';
    var d = fs.readFileSync(dirname_meantemp+'Station_Info.json', 'utf8');
    d = JSON.parse(d);
    d.is_real_data = (d.is_real_data == 'true');
    //var meantemp_info = await StationDataInfo.create(d);

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
    //await insert_meantemp(meantemp_info.code);

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

router.get('/station_rcp45', async (req, res, next) => {
    res.send('uploading station');
    
    let dirname_meantemp = 'F:/Lesson/Project/Dataset/Climate/upload_to_web/data/station/meantemp_rcp45/';
    var d = fs.readFileSync(dirname_meantemp+'Station_Info.json', 'utf8');
    d = JSON.parse(d);
    d.is_real_data = (d.is_real_data == 'true');
    var meantemp_info = await StationDataInfo.create(d);

    let dirname_rain = 'F:/Lesson/Project/Dataset/Climate/upload_to_web/data/station/rain_rcp45/';
    d = fs.readFileSync(dirname_rain+'Station_Info.json', 'utf8');
    d = JSON.parse(d);
    d.is_real_data = (d.is_real_data == 'true');
    var rain_info = await StationDataInfo.create(d);
    
    console.log('meantemp');
    var MeantempStationData = StationData('MPI_RCP45', 'meantemp', 'Daily');
    var insert_meantemp = async(code) => {
        for(let i=0; i<code.length; i++){
            let s_code = code[i];
            console.log(s_code);
            let data = fs.readFileSync(dirname_meantemp+s_code+'.json', 'utf8');
            data = JSON.parse(data);
            for(let j=0; j<data.length; j++){
                data[j].date = new Date(data[j].date);
                data[j].value = Number(data[j].value);
            };
            await MeantempStationData.collection.insert(data);
            data = null;
        }
    };
    await insert_meantemp(meantemp_info.code);

    console.log('rain');
    var RainStationData = StationData('MPI_RCP45', 'rain', 'Daily');
    var insert_rain = async(code) => {
        for(let i=0; i<code.length; i++){
            let s_code = code[i];
            console.log(s_code);
            let data = fs.readFileSync(dirname_rain+s_code+'.json', 'utf8');
            data = JSON.parse(data);
            for(let j=0; j<data.length; j++){
                data[j].date = new Date(data[j].date);
                data[j].value = Number(data[j].value);
            };
            await RainStationData.collection.insert(data);
            data = null;
        }
    };
    await insert_rain(rain_info.code);
    
});

router.get('/station_rcp45_monthly', async (req, res, next) => {

    res.send('monthly');
    
    var MeantempStationDaily = StationData('MPI_RCP45','meantemp','Daily');
    var MeantempStationMonthly = StationData('MPI_RCP45','meantemp','Monthly');
    var RainStationDaily = StationData('MPI_RCP45','rain','Daily');
    var RainStationMonthly = StationData('MPI_RCP45','rain','Monthly');

    var start_date = moment('2006-01-01');
    var end_date = moment('2012-01-01');
    for(let m = moment(start_date); m.isBefore(end_date, 'days'); m.add(1, 'months')){
        var startDate = new Date(m.format('YYYY-MM-')+'01');
        var endDate = m.endOf('month').toDate();
        
        console.log("--------------------------");
        console.log(startDate+' to '+endDate);

        var meanMeantempValue = await MeantempStationDaily.getMeanValue(startDate, endDate);
        await MeantempStationMonthly.create(meanMeantempValue);

        var sumRainValue = await RainStationDaily.getSumValue(startDate, endDate);
        await RainStationMonthly.create(sumRainValue);
    }
    
});

router.get('/station_rcp45_yearly', async (req, res, next) => {

    res.send('yearly');
    
    var MeantempStationDaily = StationData('MPI_RCP45','meantemp','Monthly');
    var MeantempStationMonthly = StationData('MPI_RCP45','meantemp','Yearly');
    var RainStationDaily = StationData('MPI_RCP45','rain','Monthly');
    var RainStationMonthly = StationData('MPI_RCP45','rain','Yearly');

    var start_date = moment('2006-01-01');
    var end_date = moment('2012-01-01');
    for(let m = moment(start_date); m.isBefore(end_date, 'days'); m.add(1, 'years')){
        var startDate = new Date(m.format('YYYY')+'-01-01');
        var endDate = m.endOf('year').toDate();
        
        console.log("--------------------------");
        console.log(startDate+' to '+endDate);

        var meanMeantempValue = await MeantempStationDaily.getMeanValue(startDate, endDate);
        await MeantempStationMonthly.create(meanMeantempValue);

        var sumRainValue = await RainStationDaily.getSumValue(startDate, endDate);
        await RainStationMonthly.create(sumRainValue);
    }
    
});

router.get('/predict', async (req, res, next) => {
    res.send('uploading predict');
    
    let dirname_meantemp = 'F:/Lesson/Project/Dataset/Climate/data/3x3/station_temperature_use_tas_tsmax_sfcwindmax_ps/to_web/';
    var meantemp_info = await StationDataInfo.findOne({variable:"meantemp"});
    console.log(meantemp_info.code);
    
    
    console.log('meantemp');
    var MeantempPredictData = PredictData('MPI_RF', 'meantemp', 'Daily');
    var MeantempPredictData2 = PredictData('MPI_RCP45', 'meantemp', 'Daily');
    var insert_meantemp = async(code) => {
        for(let i=0; i<code.length; i++){
            let s_code = code[i];
            console.log(s_code);
            let data = fs.readFileSync(dirname_meantemp+s_code+'-training.json', 'utf8');
            let data2 = fs.readFileSync(dirname_meantemp+s_code+'-forecasting.json', 'utf8');

            console.log("Read training");
            data = JSON.parse(data);
            console.log("Read forecasting");
            data2 = JSON.parse(data2);

            for(let j=0; j<data.length; j++){
                data[j].date = new Date(data[j].date);
                data[j].value = Number(data[j].value);
            };
            for(let j=0; j<data2.length; j++){
                data2[j].date = new Date(data2[j].date);
                data2[j].value = Number(data2[j].value);
            };

            console.log("Insert");
            await Promise.all([MeantempPredictData.collection.insert(data), MeantempPredictData2.collection.insert(data2)]);
            data = null;
            data2 = null;
        }
    };
    await insert_meantemp(meantemp_info.code);
    

    /*
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
    */
});

router.get('/predict_monthly', async (req, res, next) => {

    res.send('monthly');
    
    var MeantempPredictDaily = PredictData('MPI_RF','meantemp','Daily');
    var MeantempPredictMonthly = PredictData('MPI_RF','meantemp','Monthly');
    var MeantempPredictDaily2 = PredictData('MPI_RCP45','meantemp','Daily');
    var MeantempPredictMonthly2 = PredictData('MPI_RCP45','meantemp','Monthly');
    var start_date = moment('1970-01-01');
    var end_date = moment('2006-01-01');
    
    for(let m = moment(start_date); m.isBefore(end_date, 'days'); m.add(1, 'months')){
        var startDate = new Date(m.format('YYYY-MM-')+'01');
        var endDate = m.endOf('month').toDate();
        
        console.log("--------------------------");
        console.log(startDate+' to '+endDate);

        var meanMeantempValue = await MeantempPredictDaily.getMeanValue(startDate, endDate);
        await MeantempPredictMonthly.create(meanMeantempValue);
        

        
        //var sumRainValue = await RainStationDaily.getSumValue(startDate, endDate);
        //await RainStationMonthly.create(sumRainValue);
        
        
    }
    

    
    start_date = moment('2006-01-01');
    end_date = moment('2100-01-01');
    for(let m = moment(start_date); m.isBefore(end_date, 'days'); m.add(1, 'months')){
        var startDate = new Date(m.format('YYYY-MM-')+'01');
        var endDate = m.endOf('month').toDate();
        
        console.log("--------------------------");
        console.log(startDate+' to '+endDate);

        var meanMeantempValue2 = await MeantempPredictDaily2.getMeanValue(startDate, endDate);
        await MeantempPredictMonthly2.create(meanMeantempValue2);
    }
    
});

router.get('/predict_yearly', async (req, res, next) => {

    res.send('monthly');
    
    var MeantempPredictDaily = PredictData('MPI_RF','meantemp','Monthly');
    var MeantempPredictMonthly = PredictData('MPI_RF','meantemp','Yearly');
    var MeantempPredictDaily2 = PredictData('MPI_RCP45','meantemp','Monthly');
    var MeantempPredictMonthly2 = PredictData('MPI_RCP45','meantemp','Yearly');

    var start_date = moment('1970-01-01');
    var end_date = moment('2006-01-01');
    for(let m = moment(start_date); m.isBefore(end_date, 'days'); m.add(1, 'years')){
        var startDate = new Date(m.format('YYYY')+'-01-01');
        var endDate = m.endOf('year').toDate();
        console.log(startDate+' to '+endDate);
        
        console.log("--------------------------");
        console.log(startDate+' to '+endDate);

        var meanMeantempValue = await MeantempPredictDaily.getMeanValue(startDate, endDate);
        await MeantempPredictMonthly.create(meanMeantempValue);
        

        
        //var sumRainValue = await RainStationDaily.getSumValue(startDate, endDate);
        //await RainStationMonthly.create(sumRainValue);
        
        
    }
    

    
    start_date = moment('2006-01-01');
    end_date = moment('2100-01-01');
    for(let m = moment(start_date); m.isBefore(end_date, 'days'); m.add(1, 'years')){
        var startDate = new Date(m.format('YYYY')+'-01-01');
        var endDate = m.endOf('year').toDate();
        
        console.log("--------------------------");
        console.log(startDate+' to '+endDate);

        var meanMeantempValue2 = await MeantempPredictDaily2.getMeanValue(startDate, endDate);
        await MeantempPredictMonthly2.create(meanMeantempValue2);
    }
    
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
    var end_date = moment('2006-01-01');
    //var end_date = moment('1970-06-30');
    for(let m = moment(start_date); m.isBefore(end_date, 'days'); m.add(1, 'months')){
        var startDate = new Date(m.format('YYYY-MM-')+'01');
        var endDate = m.endOf('month').toDate();
        
        console.log("--------------------------");
        console.log(startDate+' to '+endDate);
        /*
        var meanTemperatureValue = await TemperatureDataDaily.getMeanValue(startDate, endDate);
        //console.log(meanTemperatureValue.startDate+' to '+meanTemperatureValue.endDate);
        
        await TemperatureDataMonthly.create(meanTemperatureValue);
        
        var sumPrecipitationValue = await PrecipitationDataDaily.getSumValue(startDate, endDate);
        await PrecipitationDataMonthly.create(sumPrecipitationValue);
        */
        var meanMeantempValue = await MeantempStationDaily.getMeanValue(startDate, endDate);
        await MeantempStationMonthly.create(meanMeantempValue);
        
        var sumRainValue = await RainStationDaily.getSumValue(startDate, endDate);
        await RainStationMonthly.create(sumRainValue);
        
        
    }
});

router.get('/mean_each_month', async (req, res, next) => {

    res.send('mean_each_month');
    
    //mean MPI_RF
    var TemperatureDataMonthly = ClimateData('MPI_RF','tas','Monthly');
    var PrecipitationDataMonthly = ClimateData('MPI_RF','pr','Monthly');

    var TemperatureDataMeanEachMonthInYearly = ClimateDataMeanEachMonthInYearly('MPI_RF', 'tas');
    var PrecipitationDataMeanEachMonthInYearly = ClimateDataMeanEachMonthInYearly('MPI_RF', 'pr');
    
    var start_date = moment('1970-01-01');
    var end_date = moment('2006-01-01');
    //var end_date = moment('1974-01-01');

    for(let m = moment(start_date); m.isBefore(end_date, 'days'); m.add(1, 'years')){
        var startDate = new Date(m.format('YYYY')+'-01-01');
        var endDate = m.endOf('year').toDate();
        console.log(startDate+' to '+endDate);

        let data = await TemperatureDataMonthly.findByDateRange(startDate, endDate);
        let sumList = [0,0,0,0,0,0,0,0,0,0,0,0];
        let countList = [0,0,0,0,0,0,0,0,0,0,0,0];
        for(let i=0; i < data.length; i++) {
            let value = data[i].value;
            let sumValue = 0;
            for(let r=0; r < value.length; r++) {
                for(let c=0; c < value[r].length; c++) {
                    sumValue = sumValue + value[r][c];
                }
            }
            let meanAreaValue = sumValue/ (value.length * value[0].length)

            sumList[i] = sumList[i] + meanAreaValue;
            countList[i] = countList[i] + 1;
        }
        let meanList = []
        for(let i=0; i < sumList.length; i++){
            if(countList[i] != 0){
                meanList.push(sumList[i]/countList[i]);
            }
        }
        let d = {
            name: data[0].name,
            variable: data[0].variable,
            startDate: data[0].startDate,
            endDate: data[data.length-1].endDate,
            value: meanList
        };
        //await TemperatureDataMeanEachMonthInYearly.create(d);

        data = await PrecipitationDataMonthly.findByDateRange(startDate, endDate);
        sumList = [0,0,0,0,0,0,0,0,0,0,0,0];
        countList = [0,0,0,0,0,0,0,0,0,0,0,0];
        for(let i=0; i < data.length; i++) {
            let value = data[i].value;
            let sumValue = 0;
            for(let r=0; r < value.length; r++) {
                for(let c=0; c < value[r].length; c++) {
                    sumValue = sumValue + value[r][c];
                }
            }
            let meanAreaValue = sumValue/ (value.length * value[0].length)

            sumList[i] = sumList[i] + meanAreaValue;
            countList[i] = countList[i] + 1;
        }
        meanList = []
        for(let i=0; i < sumList.length; i++){
            if(countList[i] != 0){
                meanList.push(sumList[i]/countList[i]);
            }
        }
        d = {
            name: data[0].name,
            variable: data[0].variable,
            startDate: data[0].startDate,
            endDate: data[data.length-1].endDate,
            value: meanList
        };
        //await PrecipitationDataMeanEachMonthInYearly.create(d);
        
        console.log('================================================');
    }
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
        var startDate = new Date(m.format('YYYY')+'-01-01');
        var endDate = m.endOf('year').toDate();
        console.log(startDate+' to '+endDate);
        /*
        var meanTemperatureValue = await TemperatureDataMonthly.getMeanValue(startDate, endDate);
        console.log(meanTemperatureValue.startDate+' to '+meanTemperatureValue.endDate);
        
        await TemperatureDataYearly.create(meanTemperatureValue);
        
        var sumPrecipitationValue = await PrecipitationDataMonthly.getSumValue(startDate, endDate);
        await PrecipitationDataYearly.create(sumPrecipitationValue);
        
        var meanMeantempValue = await MeantempStationMonthly.getMeanValue(startDate, endDate);
        await MeantempStationYearly.create(meanMeantempValue);
        
        var sumRainValue = await RainStationMonthly.getSumValue(startDate, endDate);
        await RainStationYearly.create(sumRainValue);
        */
        
    }
});

router.get('/monthly_rcp45', async (req, res, next) => {

    res.send('monthly');
    
    //mean MPI_RF
    var TemperatureDataDaily = ClimateData('MPI_RCP45','tas','Daily');
    var TemperatureDataMonthly = ClimateData('MPI_RCP45','tas','Monthly');
    var PrecipitationDataDaily = ClimateData('MPI_RCP45','pr','Daily');
    var PrecipitationDataMonthly = ClimateData('MPI_RCP45','pr','Monthly');
    
    var MeantempStationDaily = StationData('MPI_RCP45','meantemp','Daily');
    var MeantempStationMonthly = StationData('MPI_RCP45','meantemp','Monthly');
    var RainStationDaily = StationData('MPI_RCP45','rain','Daily');
    var RainStationMonthly = StationData('MPI_RCP45','rain','Monthly');
    
    var start_date = moment('2006-01-01');
    var end_date = moment('2100-01-01');
    //var end_date = moment('1970-06-30');
    for(let m = moment(start_date); m.isBefore(end_date, 'days'); m.add(1, 'months')){
        var startDate = new Date(m.format('YYYY-MM-')+'01');
        var endDate = m.endOf('month').toDate();
        
        console.log("--------------------------");
        console.log(startDate+' to '+endDate);
        /*
        var meanTemperatureValue = await TemperatureDataDaily.getMeanValue(startDate, endDate);
        console.log(meanTemperatureValue.startDate+' to '+meanTemperatureValue.endDate);
        
        await TemperatureDataMonthly.create(meanTemperatureValue);
        
        var sumPrecipitationValue = await PrecipitationDataDaily.getSumValue(startDate, endDate);
        await PrecipitationDataMonthly.create(sumPrecipitationValue);
        */
        var meanMeantempValue = await MeantempStationDaily.getMeanValue(startDate, endDate);
        await MeantempStationMonthly.create(meanMeantempValue);
        
        var sumRainValue = await RainStationDaily.getSumValue(startDate, endDate);
        await RainStationMonthly.create(sumRainValue);
        
    }
});

router.get('/mean_each_month_rcp45', async (req, res, next) => {

    res.send('mean_each_month');
    
    //mean MPI_RF
    var TemperatureDataMonthly = ClimateData('MPI_RCP45','tas','Monthly');
    var PrecipitationDataMonthly = ClimateData('MPI_RCP45','pr','Monthly');

    var TemperatureDataMeanEachMonthInYearly = ClimateDataMeanEachMonthInYearly('MPI_RCP45', 'tas');
    var PrecipitationDataMeanEachMonthInYearly = ClimateDataMeanEachMonthInYearly('MPI_RCP45', 'pr');
    
    var start_date = moment('2006-01-01');
    var end_date = moment('2100-01-01');
    //var end_date = moment('1974-01-01');

    for(let m = moment(start_date); m.isBefore(end_date, 'days'); m.add(1, 'years')){
        var startDate = new Date(m.format('YYYY')+'-01-01');
        var endDate = m.endOf('year').toDate();
        console.log(startDate+' to '+endDate);

        let data = await TemperatureDataMonthly.findByDateRange(startDate, endDate);
        let sumList = [0,0,0,0,0,0,0,0,0,0,0,0];
        let countList = [0,0,0,0,0,0,0,0,0,0,0,0];
        for(let i=0; i < data.length; i++) {
            let value = data[i].value;
            let sumValue = 0;
            for(let r=0; r < value.length; r++) {
                for(let c=0; c < value[r].length; c++) {
                    sumValue = sumValue + value[r][c];
                }
            }
            let meanAreaValue = sumValue/ (value.length * value[0].length)

            sumList[i] = sumList[i] + meanAreaValue;
            countList[i] = countList[i] + 1;
        }
        let meanList = []
        for(let i=0; i < sumList.length; i++){
            if(countList[i] != 0){
                meanList.push(sumList[i]/countList[i]);
            }
        }
        let d = {
            name: data[0].name,
            variable: data[0].variable,
            startDate: data[0].startDate,
            endDate: data[data.length-1].endDate,
            value: meanList
        };
        await TemperatureDataMeanEachMonthInYearly.create(d);

        data = await PrecipitationDataMonthly.findByDateRange(startDate, endDate);
        sumList = [0,0,0,0,0,0,0,0,0,0,0,0];
        countList = [0,0,0,0,0,0,0,0,0,0,0,0];
        for(let i=0; i < data.length; i++) {
            let value = data[i].value;
            let sumValue = 0;
            for(let r=0; r < value.length; r++) {
                for(let c=0; c < value[r].length; c++) {
                    sumValue = sumValue + value[r][c];
                }
            }
            let meanAreaValue = sumValue/ (value.length * value[0].length)

            sumList[i] = sumList[i] + meanAreaValue;
            countList[i] = countList[i] + 1;
        }
        meanList = []
        for(let i=0; i < sumList.length; i++){
            if(countList[i] != 0){
                meanList.push(sumList[i]/countList[i]);
            }
        }
        d = {
            name: data[0].name,
            variable: data[0].variable,
            startDate: data[0].startDate,
            endDate: data[data.length-1].endDate,
            value: meanList
        };
        await PrecipitationDataMeanEachMonthInYearly.create(d);
        
        console.log('================================================');
    }
});

router.get('/yearly_rcp45', async (req, res, next) => {

    res.send('yearly');
    
    //mean MPI_RF
    var TemperatureDataMonthly = ClimateData('MPI_RCP45','tas','Monthly');
    var TemperatureDataYearly = ClimateData('MPI_RCP45','tas','Yearly');
    var PrecipitationDataMonthly = ClimateData('MPI_RCP45','pr','Monthly');
    var PrecipitationDataYearly = ClimateData('MPI_RCP45','pr','Yearly');
    
    var MeantempStationMonthly = StationData('MPI_RCP45','meantemp','Monthly');
    var MeantempStationYearly = StationData('MPI_RCP45','meantemp','Yearly');
    var RainStationMonthly = StationData('MPI_RCP45','rain','Monthly');
    var RainStationYearly = StationData('MPI_RCP45','rain','Yearly');
    
    var start_date = moment('2006-01-01');
    var end_date = moment('2100-01-01');
    for(let m = moment(start_date); m.isBefore(end_date, 'days'); m.add(1, 'years')){
        var startDate = new Date(m.format('YYYY')+'-01-01');
        var endDate = m.endOf('year').toDate();
        //console.log(startDate+' to '+endDate);
        /*
        var meanTemperatureValue = await TemperatureDataMonthly.getMeanValue(startDate, endDate);
        console.log(meanTemperatureValue.startDate+' to '+meanTemperatureValue.endDate);
        
        await TemperatureDataYearly.create(meanTemperatureValue);
        
        var sumPrecipitationValue = await PrecipitationDataMonthly.getSumValue(startDate, endDate);
        await PrecipitationDataYearly.create(sumPrecipitationValue);
        */
        var meanMeantempValue = await MeantempStationMonthly.getMeanValue(startDate, endDate);
        await MeantempStationYearly.create(meanMeantempValue);
        
        var sumRainValue = await RainStationMonthly.getSumValue(startDate, endDate);
        await RainStationYearly.create(sumRainValue);
        
    }
});

module.exports = router;
