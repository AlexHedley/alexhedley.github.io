var map;
var brooklyn = new google.maps.LatLng(54.650588, -1.607931);

var MY_MAPTYPE_ID = 'custom_style';

function initialize() {

  var featureOpts = [
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [
      { color: "#f0f0f0" }
    ]
  },{
    featureType: "water",
    stylers: [
      { color: "#74b6e6" }
    ]
  },{
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [
      { color: "#ffffff" }
    ]
  },{
    elementType: "geometry.stroke",
    stylers: [
      { "saturation": -100 },
      { "color": "#e0e0e0" }
    ]
  },{
    elementType: "labels.text.fill",
    stylers: [
      { "color": "#666666" }
    ]
  },{
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      { color: "#e0e0e0" }
    ]
  },{
    elementType: "labels.text.stroke",
    stylers: [
      { color: "#f0f0f0" }
      ]
    }
  ];

  var mapOptions = {
    zoom: 10,
	scrollwheel: false,
	draggable: false,
    center: new google.maps.LatLng(54.650588, -1.607931),
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
    },
    mapTypeId: MY_MAPTYPE_ID
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

marker = new google.maps.Marker({
    map:map,
    // draggable:true,
    // animation: google.maps.Animation.DROP,
    position: new google.maps.LatLng(54.650588, -1.607931),
    icon: 'images/marker.png' // null = default icon
  });

  var styledMapOptions = {
    name: 'Custom Style'
  };

  var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);

  map.mapTypes.set(MY_MAPTYPE_ID, customMapType);
}

google.maps.event.addDomListener(window, 'load', initialize);

		