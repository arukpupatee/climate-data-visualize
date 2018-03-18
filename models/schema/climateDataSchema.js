var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var climateDataSchema = new Schema({
    name: String,
    variable: String,
    date: {type: Date, index: true},
    value: [[Number]]
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

    return meanValue;
}

module.exports = climateDataSchema;