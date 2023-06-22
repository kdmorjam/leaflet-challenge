// Store our API endpoint as queryUrl.
let quakeurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
//reading tectonic plate info from local file; Issues conecting to the original GitHub file
let tectonicurl = "static/data/PB2002_boundaries.json"

// Perform a GET request for both JSON files/
Promise.all([
    d3.json(quakeurl),
    d3.json(tectonicurl)
]).then(function([q_data, t_data]){
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(q_data.features,t_data.features);

});


function createFeatures(earthquakeData, platesData) {
// Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the pointToLayer function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
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
       
  });


    let plates = L.geoJSON(platesData, {
        color: "#000000", //#ff4e20",
        weight: 2
        });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes, plates);

}


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
    
    return d > 800 ? '#7f0000' :
           d > 500  ? '#b30000' :
           d > 200  ? '#d7301f' :
           d > 100  ? '#ef6548' :
           d > 50   ? '#fc8d59' :
           d > 20   ? '#fdbb84' :
           d > 10   ? '#fdd49e' :
                      '#fee8c8';
}


function createMap(earthquakes, plates) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  


  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes,
    Tectonic: plates
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let quakemap = L.map("map", {
    center: [
        43.65,79.38
    ],
    zoom: 3,
    //layers: [street, earthquakes]
    layers: [street, topo, earthquakes, plates]
  });

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

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(quakemap);


 
}
