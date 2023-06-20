
let quakemap = L.map("map", {
    center:[43.65,79.38],
    zoom: 3
})

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(quakemap);

let quakeurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


d3.json(quakeurl).then(function (data){

    L.geoJson(data, {
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

//calculate radius for circleMarker
function calcRadius(rad){
    return rad * 2
}


//convert properties.time to date
function convertToDate(unixtime){
    let dateObject = new Date(unixtime);
    let date = dateObject.toLocaleString();
    return date 
}

//create colours for circleMarker
function getColor(d) {
    
    return d > 800 ? '#8c2d04' :
           d > 500  ? '#d94801' :
           d > 200  ? '#f16913' :
           d > 100  ? '#fd8d3c' :
           d > 50   ? '#fdae6b' :
           d > 20   ? '#fdd0a2' :
           d > 10   ? '#fee6ce' :
                      '#c7e9c0';
}


//create lengend and add to map
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (quakemap) {

    var div = L.DomUtil.create('div', 'legend'),
        depth = [0, 10, 20, 50, 100, 200, 500, 800];

    div.innerHTML += "<h4>Depth</h4>";
    // loop through our density intervals and generate a label with a 
    //colored square for each interval
    for (var i = 0; i < depth.length; i++) {
        div.innerHTML +=
           '<i style="background-color:' + getColor(depth[i] + 1) + '"></i> ' +
           depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
};

legend.addTo(quakemap);
