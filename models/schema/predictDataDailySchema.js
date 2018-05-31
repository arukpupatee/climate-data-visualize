var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var moment = require('moment');

var stationDataSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    variable: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lon: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        index: true
    },
    value: {
        type: Number,
        required: true 
    },
    rainfall: {
        type: Number
    }
});

stationDataSchema.statics.findByDateRange = function (dateStart, dateEnd){
    var query = this.find({
        date: {
            $gte: dateStart,
            $lte: dateEnd
        }
    }).lean();
    return new Promise((resolve, reject) =>{
        query.exec((err, results) =>{
            if (err) reject(error);
            resolve(results);
        });
    });
}

stationDataSchema.statics.getMeanValue = async function (dateStart, dateEnd){
    var data = await this.findByDateRange(dateStart, dateEnd);

    var sumData = {};
    var count = {}
    for(let i=0; i < data.length; i++) {
        s_code = data[i].code;
        if (sumData[s_code] == null) {
            sumData[s_code] = data[i];
            sumData[s_code].startDate = data[i].date;
            sumData[s_code].endDate = data[i].date;
            if(data[i].rainfall != null){
                sumData[s_code].rainfall = data[i].rainfall;
            }
            count[s_code] = 1;
        } else {
            if(data[i].date <= sumData[s_code].startDate) {
                sumData[s_code].startDate = data[i].date;
            }
            if(data[i].date >= sumData[s_code].endDate) {
                sumData[s_code].endDate = data[i].date;
            }
            sumData[s_code].value = sumData[s_code].value + data[i].value;
            if(data[i].rainfall != null){
                sumData[s_code].rainfall = sumData[s_code].rainfall + data[i].rainfall;
            }
            count[s_code]++;
        }
    }

    var meanData = [];
    Object.keys(sumData).map((s_code) => {
        sumData[s_code].value = (sumData[s_code].value / count[s_code]).toFixed(2);
        if(sumData[s_code].rainfall != null){
            sumData[s_code].rainfall = (sumData[s_code].rainfall / count[s_code]).toFixed(2);
        }
        meanData.push(sumData[s_code]);
    });

    return meanData;
}

stationDataSchema.statics.getAllStationMeanValueList = async function (dateStart, dateEnd){
    var data = await this.findByDateRange(dateStart, dateEnd);

    var valueList = [];
    var dateList = [];

    var dataEachDate = {

    }

    for(let i=0; i < data.length; i++){
        let d = data[i];
        let date = moment(d.date).format('YYYY-MM-DD');
        if(dataEachDate[d] == null){
            dataEachDate[d] = {}
            dataEachDate[d].sum = d.value;
            dataEachDate[d].count = 1
        } else {
            dataEachDate[d].sum = dataEachDate[d].sum + d.value;
            dataEachDate[d].count = dataEachDate[d].count + 1;
        }
    }

    Object.keys(dataEachDate).map((date) => {
        valueList.push( (dataEachDate[date].sum/dataEachDate[date].count) )
        dateList.push(new Date(date));
    });

    return {
        valueList: valueList,
        dateList: dateList
    };
}

stationDataSchema.statics.getSumValue = async function (dateStart, dateEnd){
    var data = await this.findByDateRange(dateStart, dateEnd);

    var sumData = {};
    for(let i=0; i < data.length; i++) {
        s_code = data[i].code;
        if (sumData[s_code] == null) {
            sumData[s_code] = data[i];
            sumData[s_code].startDate = data[i].date;
            sumData[s_code].endDate = data[i].date;
            if(data[i].rainfall != null){
                sumData[s_code].rainfall = data[i].rainfall;
            }
        } else {
            if(data[i].date <= sumData[s_code].startDate) {
                sumData[s_code].startDate = data[i].date;
            }
            if(data[i].date >= sumData[s_code].endDate) {
                sumData[s_code].endDate = data[i].date;
            }
            sumData[s_code].value = sumData[s_code].value + data[i].value;
            if(data[i].rainfall != null){
                sumData[s_code].rainfall = sumData[s_code].rainfall + data[i].rainfall;
            }
        }
    }

    var sumDataList = [];
    Object.keys(sumData).map((s_code) => {
        sumDataList.push(sumData[s_code]);
    });

    return sumDataList;
}

stationDataSchema.statics.getAllStationMeanValueList = async function (dateStart, dateEnd){
    var data = await this.findByDateRange(dateStart, dateEnd);

    var valueList = [];
    var dateList = [];

    var dataEachDate = {};

    for(let i=0; i < data.length; i++){
        let d = data[i];
        let date = moment(d.date).format('YYYY-MM-DD');
        if(dataEachDate[date] == null){
            dataEachDate[date] = {}
            dataEachDate[date].sum = d.value;
            dataEachDate[date].count = 1
        } else {
            dataEachDate[date].sum = dataEachDate[date].sum + d.value;
            dataEachDate[date].count = dataEachDate[date].count + 1;
        }
    }

    Object.keys(dataEachDate).map((date) => {
        valueList.push( (dataEachDate[date].sum/dataEachDate[date].count) )
        dateList.push(new Date(date));
    });

    return {
        valueList: valueList,
        dateList: dateList
    };
}

stationDataSchema.statics.getSpecificAreaStationMeanValueList = async function (dateStart, dateEnd, lat1, lon1, lat2, lon2){
    var data = await this.findByDateRange(dateStart, dateEnd);

    var valueList = [];
    var dateList = [];

    var dataEachDate = {};

    var latMin, lonMin, latMax, lonMax;
    latMin = lat2;
    latMax = lat1;
    lonMin = lon1;
    lonMax = lon2;

    for(let i=0; i < data.length; i++){
        let d = data[i];
        if(latMin < d.lat && d.lat < latMax && lonMin < d.lon && d.lon < lonMax){
            let date = moment(d.date).format('YYYY-MM-DD');
            if(dataEachDate[date] == null){
                dataEachDate[date] = {}
                dataEachDate[date].sum = d.value;
                dataEachDate[date].count = 1
            } else {
                dataEachDate[date].sum = dataEachDate[date].sum + d.value;
                dataEachDate[date].count = dataEachDate[date].count + 1;
            }
        }
    }

    Object.keys(dataEachDate).map((date) => {
        valueList.push( (dataEachDate[date].sum/dataEachDate[date].count) )
        dateList.push(new Date(date));
    });

    return {
        valueList: valueList,
        dateList: dateList
    };
}

module.exports = stationDataSchema;