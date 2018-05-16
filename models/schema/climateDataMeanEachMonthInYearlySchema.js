var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var climateDataMeanEachMonthInYearlySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    variable: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        index: true
    },
    endDate: {
        type: Date,
        index: true
    },
    value: {
        type: [Number],
        required: true
    }
});

climateDataMeanEachMonthInYearlySchema.statics.findByDateRange = function (dateStart, dateEnd){
    var query = this.find({
        startDate: {
            $gte: dateStart
        },
        endDate: {
            $lte: dateEnd
        }
    }).lean();
    return new Promise((resolve, reject) =>{
        query.exec((err, results) =>{
            if (err) throw(err);
            if (err) reject(error);
            resolve(results);
        });
    });
}

climateDataMeanEachMonthInYearlySchema.statics.getValueList = async function (dateStart, dateEnd){
    var data = await this.findByDateRange(dateStart, dateEnd);

    var sumEachMonth = [0,0,0,0,0,0,0,0,0,0,0,0];
    var countEachMonth = [0,0,0,0,0,0,0,0,0,0,0,0];

    var meanList = [];
    
    for(let d=0; d < data.length; d++) {
        let value = data[d].value;
        for(let v=0; v < value.length; v++){
            sumEachMonth[v] = sumEachMonth[v] + value[v]
            countEachMonth[v] = countEachMonth[v] + 1;
        }
        for(let m=0; m < sumEachMonth.length; m++){
            if(countEachMonth[m] != 0){
                let meanValue = sumEachMonth[m] / countEachMonth[m];
                meanList.push(meanValue)
            }
        }
    }

    return {
        valueList: meanList,
        monthList: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    };
}

module.exports = climateDataMeanEachMonthInYearlySchema;