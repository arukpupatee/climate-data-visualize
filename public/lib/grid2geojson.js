const toGeoJSON = (lats, lons, data, padding=true) => {
    var arr = [];

    if(padding){
        for(let latIdx = 0; latIdx < lats.length; latIdx++){
            for(let lonIdx = 0; lonIdx < lons.length; lonIdx++){
                let lat1 = lats[latIdx]
                let lon1 = lons[lonIdx];
                let lat2, lon2;
                if(latIdx != lats.length-1){
                    lat2 = lats[latIdx+1];
                } else {
                    lat2 = lats[latIdx] + (lats[latIdx] - lats[latIdx-1]); 
                }
                if(lonIdx != lons.length-1){
                    lon2 = lons[lonIdx+1];
                } else {
                    lon2 = lons[lonIdx] + (lons[lonIdx] - lons[lonIdx-1]); 
                }

                let feature = { "type": "Feature" };
                feature.properties = { value: data[latIdx][lonIdx] };
                feature.geometry = {
                    "type": "Polygon",
                    "coordinates": [[
                        [lon1, lat1],
                        [lon2, lat1],
                        [lon2, lat2],
                        [lon1, lat2]
                    ]]
                };
                arr.push(feature);
            }
        }
    } else {
        for(let latIdx = 0; latIdx < lats.length-1; latIdx++){
            for(let lonIdx = 0; lonIdx < lons.length-1; lonIdx++){
                let lat1 = lats[latIdx]
                let lon1 = lons[lonIdx];
                let lat2 = lats[latIdx+1];
                let lon2 = lons[lonIdx+1];
                
                let feature = { "type": "Feature" };
                feature.properties = { value: data[latIdx][lonIdx] };
                feature.geometry = {
                    "type": "Polygon",
                    "coordinates": [[
                        [lon1, lat1],
                        [lon2, lat1],
                        [lon2, lat2],
                        [lon1, lat2]
                    ]]
                };
                arr.push(feature);
            }
        }
    }
    return arr;
};