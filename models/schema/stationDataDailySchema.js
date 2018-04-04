var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
            count[s_code] = 1;
        } else {
            if(data[i].date <= sumData[s_code].startDate) {
                sumData[s_code].startDate = data[i].date;
            }
            if(data[i].date >= sumData[s_code].endDate) {
                sumData[s_code].endDate = data[i].date;
            }
            sumData[s_code].value = sumData[s_code].value + data[i].value;
            count[s_code]++;
        }
    }

    var meanData = [];
    Object.keys(sumData).map((s_code) => {
        sumData[s_code].value = (sumData[s_code].value / count[s_code]).toFixed(1);
        meanData.push(sumData[s_code]);
    });

    return meanData;
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
        } else {
            if(data[i].date <= sumData[s_code].startDate) {
                sumData[s_code].startDate = data[i].date;
            }
            if(data[i].date >= sumData[s_code].endDate) {
                sumData[s_code].endDate = data[i].date;
            }
            sumData[s_code].value = sumData[s_code].value + data[i].value;
        }
    }

    var sumDataList = [];
    Object.keys(sumData).map((s_code) => {
        sumDataList.push(sumData[s_code]);
    });

    return sumDataList;
}

module.exports = stationDataSchema;