﻿var geocoder = new google.maps.Geocoder();

var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 2,
    center: new google.maps.LatLng(0, 0),
    mapTypeId: google.maps.MapTypeId.HYBRID
});



var addresses;
var locations;
var dist;
var overlays = [];
var path;
var airports = [
      [document.getElementById("Origin").value + '<br>' + '<span style="color:white">' +"Origin Airport" +'</span>',document.getElementById("LatOrig").value,document.getElementById("LongOrig").value, 4],
      [document.getElementById("Stop1").value+ '<br>' + '<span style="color:white">' +"IMAP 1 Airport" +'</span>',document.getElementById("LatStop1").value,document.getElementById("LongStop1").value, 3],
      [document.getElementById("Stop2").value+ '<br>' + '<span style="color:white">' +"IMAP 2 Airport" +'</span>',document.getElementById("LatStop2").value,document.getElementById("LongStop2").value, 2],
      [document.getElementById("Destination").value+ '<br>' + '<span style="color:white">' +"Destination Airport" +'</span>',document.getElementById("LatDest").value,document.getElementById("LongDest").value, 1]
    ];

var bounds = new google.maps.LatLngBounds();	


 var marker, i;
    var markers = new Array();
    var marker_image = 'http://maps.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png';
    for (i = 0; i < airports.length; i++) {  
      marker = new google.maps.Marker({
       position: new google.maps.LatLng(airports[i][1], airports[i][2]),
        map: map,
        icon: marker_image,
        title:"AIRPORT",
      
 });

	var infowindow = new google.maps.InfoWindow();
	
   
   google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
   return function() {
infowindow.setContent('<div style="font-size:90%;font-family:arial;text-align:center;padding:8px;background-color:#00002f;color:yellow">' + airports[i][0] + '</div>' + '<br>' + '<center style="margin-top:-10px;font:family:calibri;font-weight:500">'+ "Click Left to Zoom In Airport" + '<br>' + "and Click Right to Zoom Out!" +'</center>');
        infowindow.open(map, marker);
    }

    })(marker, i));


google.maps.event.addListener(marker, 'mouseout', (function(marker, i) {
        return function() {
                 infowindow.close(map,marker);
        }

      })(marker, i));



google.maps.event.addListener(marker, 'click', (function(marker, i) {
        
 return function() {
 map.setZoom(13);
 map.setCenter(marker.getPosition());

}

      })(marker, i));


google.maps.event.addListener(marker, 'rightclick', (function(marker, i) {
        return function() {
                 initialize();
        }

      })(marker, i));

    }



function initialize() {

    while (overlays[0]) {
        overlays.pop().setMap(null);
    }
	addresses = [
        document.getElementById("origfrom").value,
        document.getElementById("iwpto").value,
        document.getElementById("iwpto2").value,
        document.getElementById("destto").value
    ];

    locations = [];
    geocode();
}

function geocode() {
    if (locations.length === 4) {
        return route();
    }
	geocoder.geocode( { 'address': addresses.shift() }, function(res, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			locations.push(res[0]);
		}
		else {
			locations.push({});
		}
        geocode();
    });
}

function route() {
    var coords = [];
    var path;
	var bounds = new google.maps.LatLngBounds();

 function addMarker(location, latlng) {
       // latlng = latlng || new google.maps.LatLng(location.geometry.location.lat(), location.geometry.location.lng());
      //  var marker_image = 'http://maps.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png';

var marker = new google.maps.Marker({
     //map: map,
      // icon: marker_image,
      // position: latlng

        });

   }


    locations.forEach(function (location) {
        if (location.geometry) {
            var latlng = new google.maps.LatLng(location.geometry.location.lat(), location.geometry.location.lng());
            coords.push(latlng);
            addMarker(location, latlng);
            bounds.extend(latlng);
        }
    });

    map.fitBounds(bounds);

    path = new google.maps.Polyline({
      path: coords,
      strokeColor: "#FF0000",
      strokeOpacity: 0.5,
      geodesic: true,
      strokeWeight: 2
    });

 
	path.setMap(map);

google.maps.event.addListener(map, 'zoom_changed', function() {
  var zoom = map.getZoom();
  if (zoom >= 13) {
  path.setOptions({strokeWeight: 0});
  } else {
    path.setOptions({strokeWeight: 2});
  }

google.maps.event.addDomListener(window, 'load', initialize);

});



  overlays.push(path);

var distanceKm = google.maps.geometry.spherical.computeLength(coords);
document.getElementById("dist").value= Math.round(distanceKm/1852,0) + " Nm";

    }
