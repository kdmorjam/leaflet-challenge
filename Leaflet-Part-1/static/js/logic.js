
let quakemap = L.map("map", {
    center:[79.38,43.65],
    zoom: 2
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
        //         //color: getColor(feature.geometry.coordinates[2])
        //         //fillColor: getColor(feature.geometry.coordinates[2])
        //         fillColor: "red",
        //         color: "red"
        //     };
        // },
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {
                radius: calcRadius(feature.properties.mag), //adjust radius based on magnitude
                fillColor: getColor(feature.geometry.coordinates[2]),  //get color based on depth
                color: "white",
                fillOpacity: 0.7   //make colors more visible
            }).bindPopup("<h2>"+feature.properties.place+"<h2><h3> Magnitude: "+feature.properties.mag+
                        "<h3><h3> Depth: "+feature.geometry.coordinates[2]+
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

//from leaflet tutorial
function getColor(d) {
    console.log(`Depth: ${d}`);
    return d > 800 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FFA500' :
           d > 10   ? '#FEF400' :
                      '#AAFF89';
}


//taken from leaflet tutorial
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (quakemap) {

    var div = L.DomUtil.create('div', 'legend'),
        depth = [0, 10, 20, 50, 100, 200, 500, 800];
        //labels = ['<strong>Depth</strong>'];

    div.innerHTML += "<h4>Depth</h4>";
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < depth.length; i++) {
        div.innerHTML +=
           '<i style="background-color:' + getColor(depth[i] + 1) + '"></i> ' +
           depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
};

legend.addTo(quakemap);
