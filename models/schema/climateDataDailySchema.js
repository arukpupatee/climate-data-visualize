var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var climateDataSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    variable: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        index: true
    },
    value: {
        type: [[Number]],
        required: true
    }
});

climateDataSchema.statics.findByDateRange = function (dateStart, dateEnd){
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

climateDataSchema.statics.getMeanValue = async function (dateStart, dateEnd){
    var data = await this.findByDateRange(dateStart, dateEnd);

    var sumValue = data[0].value;
    for(let d=1; d < data.length; d++) {
        let value = data[d].value;
        for(let r=0; r < value.length; r++) {
            for(let c=0; c < value[r].length; c++) {
                sumValue[r][c] = sumValue[r][c] + value[r][c];
            }
        }
    }

    var meanValue = sumValue;
    for(let r=0; r < sumValue.length; r++) {
        for(let c=0; c < sumValue[r].length; c++) {
            meanValue[r][c] = meanValue[r][c] / data.length;
        }
    }
    var response = data[0];
    response.startDate = data[0].date;
    response.endDate = data[data.length-1].date;
    response.value = meanValue;
    return response;
}

climateDataSchema.statics.getAreaMeanValueList = async function (dateStart, dateEnd){
    var data = await this.findByDateRange(dateStart, dateEnd);

    var valueList = [];
    var dateList = [];

    for(let d=1; d < data.length; d++) {
        let value = data[d].value;
        let sumValue = 0;
        for(let r=0; r < value.length; r++) {
            for(let c=0; c < value[r].length; c++) {
                sumValue = sumValue + value[r][c];
            }
        }
        let meanValue = sumValue/ (value.length * value[0].length)
        valueList.push(meanValue);
        dateList.push(data[d].date);
    }

    return {
        valueList: valueList,
        dateList: dateList
    };
}

climateDataSchema.statics.getSpecificAreaMeanValueList = async function (dateStart, dateEnd, climateInfo, lat1, lon1, lat2, lon2){
    var data = await this.findByDateRange(dateStart, dateEnd);

    var valueList = [];
    var dateList = [];

    var lats = climateInfo.lat;
    var lons = climateInfo.lon;

    var latMin, lonMin, latMax, lonMax;
    if(lat1 >= lat2) {
        latMax = lat1;
        latMin = lat2;
    } else {
        latMax = lat2;
        latMin = lat1;
    }
    if(lon1 >= lon2) {
        lonMax = lon1;
        lonMin = lon2;
    } else {
        lonMax = lon2;
        lonMin = lon1;
    }

    var latMinIdx = lats[0]
    var lonMinIdx = lons[0]
    var latMaxIdx = lats[lats.length-1]
    var lonMaxIdx = lons[lons.length-1]

    for(let i=0; i<lats.length; i++) {
        if(latMin >= lats[i]){
            latMinIdx = i;
            break;
        }
    }

    for(let i=0; i<lons.length; i++) {
        if(lonMin >= lons[i]){
            lonMinIdx = i;
            break;
        }
    }

    for(let d=1; d < data.length; d++) {
        let value = data[d].value;
        let sumValue = 0;
        for(let r=0; r < value.length; r++) {
            for(let c=0; c < value[r].length; c++) {
                sumValue = sumValue + value[r][c];
            }
        }
        let meanValue = sumValue/ (value.length * value[0].length)
        valueList.push(meanValue);
        dateList.push(data[d].date);
    }

    return {
        valueList: valueList,
        dateList: dateList
    };
}

climateDataSchema.statics.getSumValue = async function (dateStart, dateEnd){
    var data = await this.findByDateRange(dateStart, dateEnd);

    var sumValue = data[0].value;
    for(let d=1; d < data.length; d++) {
        let value = data[d].value;
        for(let r=0; r < value.length; r++) {
            for(let c=0; c < value[r].length; c++) {
                sumValue[r][c] = sumValue[r][c] + value[r][c];
            }
        }
    }

    var response = data[0];
    response.startDate = data[0].date;
    response.endDate = data[data.length-1].date;
    response.value = sumValue;
    return response;
}

module.exports = climateDataSchema;