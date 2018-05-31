var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/climate_data_visualization', { config: { autoIndex: false } });
mongoose.Promise = global.Promise;
// for autoIndex
var ClimateDataInfo = require('./models/ClimateDataInfo');
var StationDataInfo = require('./models/StationDataInfo');
var ClimateData = require('./models/ClimateData');
var StationData = require('./models/StationData');
var PredictData = require('./models/PredictData');
var ClimateDataMeanEachMonthInYearly = require('./models/ClimateDataMeanEachMonthInYearly');
/*
var ClimateData_MPI_RF_tas_Daily = ClimateData('MPI_RF','tas','Daily');
var ClimateData_MPI_RF_pr_Daily = ClimateData('MPI_RF','pr','Daily');
var ClimateData_MPI_RCP45_tas_Daily = ClimateData('MPI_RCP45','tas','Daily');
var ClimateData_MPI_RCP45_pr_Daily = ClimateData('MPI_RCP45','pr','Daily');
var StationData_MPI_RF_meantemp_Daily = StationData('MPI_RF','meantemp','Daily');
var StationData_MPI_RF_rain_Daily = StationData('MPI_RF','rain','Daily');
var StationData_MPI_RCP45_meantemp_Daily = StationData('MPI_RCP45','meantemp','Daily');
var StationData_MPI_RCP45_rain_Daily = StationData('MPI_RCP45','rain','Daily');
*/
/*
var PredictData_MPI_RF_meantemp_Daily = PredictData('MPI_RF','meantemp','Daily');
var PredictData_MPI_RCP45_meantemp_Daily = PredictData('MPI_RCP45','meantemp','Daily');
*/
/*
var PredictData_MPI_RF_meantemp_Monthly = PredictData('MPI_RF','meantemp','Monthly');
var PredictData_MPI_RCP45_meantemp_Monthly = PredictData('MPI_RCP45','meantemp','Monthly');
*/
/*
var TemperatureDataMonthly = ClimateData('MPI_RF','tas','Monthly');
var PrecipitationDataMonthly = ClimateData('MPI_RF','pr','Monthly');
var MeantempStationMonthly = StationData('MPI_RF','meantemp','Monthly');
var RainStationMonthly = StationData('MPI_RF','rain','Monthly');
*/

/*
var TemperatureDataMonthly = ClimateData('MPI_RCP45','tas','Monthly');
var PrecipitationDataMonthly = ClimateData('MPI_RCP45','pr','Monthly');
var MeantempStationMonthly = StationData('MPI_RCP45','meantemp','Monthly');
var RainStationMonthly = StationData('MPI_RCP45','rain','Monthly');
*/

/*
var TemperatureDataYearly = ClimateData('MPI_RF','tas','Yearly');
var PrecipitationDataYearly = ClimateData('MPI_RF','pr','Yearly');
var MeantempStationYearly = StationData('MPI_RF','meantemp','Yearly');
var RainStationYearly = StationData('MPI_RF','rain','Yearly');
*/
/*
var TemperatureDataYearly = ClimateData('MPI_RCP45','tas','Yearly');
var PrecipitationDataYearly = ClimateData('MPI_RCP45','pr','Yearly');
var MeantempStationYearly = StationData('MPI_RCP45','meantemp','Yearly');
var RainStationYearly = StationData('MPI_RCP45','rain','Yearly');
*/
/*
var TemperatureDataMeanEachMonthInYearly = ClimateDataMeanEachMonthInYearly('MPI_RF', 'tas');
var PrecipitationDataMeanEachMonthInYearly = ClimateDataMeanEachMonthInYearly('MPI_RF', 'pr');
*/
/*
var TemperatureDataMeanEachMonthInYearly = ClimateDataMeanEachMonthInYearly('MPI_RCP45', 'tas');
var PrecipitationDataMeanEachMonthInYearly = ClimateDataMeanEachMonthInYearly('MPI_RCP45', 'pr');
*/

var home = require('./routes/home');
var train_model = require('./routes/train_model');
var dataset = require('./routes/dataset');
var api = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', home);
app.use('/train_model', train_model);
app.use('/dataset', dataset);
app.use('/api', api);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
