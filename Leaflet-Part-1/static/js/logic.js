
let quakemap = L.map("map", {
    center:[79.38,43.65],
    zoom: 5
})

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(quakemap);

let quakeurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
//"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
//"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson"

let geojsonLayer;

d3.json(quakeurl).then(function (data){

    L.geoJson(data, {
        // style: function(feature) {
        //     return {
        //         fillColor: getColor(feature.geometry.coordinates[2]),
        //         color: "white"
        //     };
        // },
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {
                radius: calcRadius(feature.properties.mag),
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: "white"
                //fillOpacity: calcFillOpacity(feature.geometry.coordinates[2]),
            }).bindPopup("<h2>"+feature.properties.place+"<h2><h3> Magnitude: "+feature.properties.mag+
                        "<h3><h3> Date: "+convertToDate(feature.properties.time));
        }
       
    }).addTo(quakemap);

});


function calcRadius(rad){
    return rad * 2
}

// function calcFillOpacity(depth){
    
//     return depth / 10
// }

//convert properties.time to date
//from https://askjavascript.com/how-to-convert-timestamp-to-date-in-javascript/#:~:text=To%20convert%20a%20timestamp%20to,sensitive%20representation%20of%20the%20Date.
function convertToDate(unixtime){
    let dateObject = new Date(unixtime);
    let date = dateObject.toLocaleString();
    return date 
}

function getColor(d) {
    return d > 800 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (quakemap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 800],
        labels = ['<strong>Depth</strong>'];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            labels.push('<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+'));
    }
    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(quakemap);
