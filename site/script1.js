var map;
var trafficLayer;
var listaMarkers = [];

var locations = [
        {lat: -31.563910, lng: 147.154312},
        {lat: -33.718234, lng: 150.363181},
        {lat: -33.727111, lng: 150.371124},
        {lat: -33.848588, lng: 151.209834},
        {lat: -33.851702, lng: 151.216968},
        {lat: -34.671264, lng: 150.863657},
        {lat: -35.304724, lng: 148.662905},
        {lat: -36.817685, lng: 175.699196},
        {lat: -36.828611, lng: 175.790222},
        {lat: -37.750000, lng: 145.116667},
        {lat: -37.759859, lng: 145.128708},
        {lat: -37.765015, lng: 145.133858},
        {lat: -37.770104, lng: 145.143299},
        {lat: -37.773700, lng: 145.145187},
        {lat: -37.774785, lng: 145.137978},
        {lat: -37.819616, lng: 144.968119},
        {lat: -38.330766, lng: 144.695692},
        {lat: -39.927193, lng: 175.053218},
        {lat: -41.330162, lng: 174.865694},
        {lat: -42.734358, lng: 147.439506},
        {lat: -42.734358, lng: 147.501315},
        {lat: -42.735258, lng: 147.438000},
        {lat: -43.999792, lng: 170.463352}
      ];
	
function initMap(){
	  
	map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: -24.397, lng: -54.644},
		zoom: 8,
		streetViewControl: true
	});
	 
	var wkt = new Wkt.Wkt();
	var geometry;
	
	wkt.read("POLYGON((25.048828125 31.41342827771443,35.947265625 31.41342827771443,35.947265625 22.08945741873307,25.048828125 22.08945741873307,25.048828125 31.41342827771443))");
	geometry = wkt.toObject();
	geometry.setMap(map);
	
	wkt.read("POINT(29.970703125 26.541237189792536)");
	geometry = wkt.toObject();
	geometry.setMap(map);
	
	wkt.read("POLYGON((23.203125 22.01627038664973,36.8701171875 22.01627038664973,36.8701171875 10.565447149212178,23.203125 10.565447149212178,23.203125 22.01627038664973))");
	geometry = wkt.toObject();
	geometry.setMap(map);
	
	wkt.read("POINT(31.5087890625 15.61444005082232)");
	geometry = wkt.toObject();
	geometry.setMap(map);
	
	wkt.read('{"type": "Point","coordinates": [-54.30267333984375,-24.725003791220075]}');
	geometry = wkt.toObject();
	geometry.setMap(map);
	
	wkt.read('{"type": "Point","coordinates": [-54.36138153076172,-24.783929264304742]}');
	geometry = wkt.toObject();
	geometry.setMap(map);
	
	wkt.read('{"type": "Polygon","coordinates": [[[-54.429359436035156,-24.82195096270788],[-54.263877868652344,-24.82195096270788],[-54.263877868652344,-24.758055381467898],[-54.429359436035156,-24.758055381467898],[-54.429359436035156,-24.82195096270788]]]}');
	geometry = wkt.toObject();
	geometry.setMap(map);
	
	wkt.read('{"type": "Polygon","coordinates": [[[-54.34284210205078,-24.621739036409934],[-54.42558288574219,-24.720949689575324],[-54.29615020751953,-24.737788938814067],[-54.21958923339844,-24.67385006748365],[-54.23503875732422,-24.61299972950006],[-54.34284210205078,-24.621739036409934]]]}');
	geometry = wkt.toObject();
	geometry.setMap(map);
	
	trafficLayer = new google.maps.TrafficLayer();
	
	map.addListener('click', function(e) {
		addMarker(e.latLng);
	});
	
	var markers = locations.map(function(location) {
	  return new google.maps.Marker({
		position: location
	  });
	});
	
	var markerCluster = new MarkerClusterer(map, markers, {imagePath: '../marker-clusterer/images/m'});
}

function applyOptions(){
	var zoom = parseInt(document.getElementById('zoom').value);
	var mapaBase = document.getElementById('mapaBase').value;
	var showTraffic = parseInt(document.getElementById('showTraffic').value);
	var latitude = parseFloat(document.getElementById('latitude').value);
	var longitude = parseFloat(document.getElementById('longitude').value);
	var checkedStyle = document.getElementById('checkstyled');

	var stylesArray = JSON.parse(document.getElementById('estiloMapa').value);
	var styledMapType = new google.maps.StyledMapType(stylesArray);
	
	if(showTraffic == 1){
		trafficLayer.setMap(map);
	}else{
		trafficLayer.setMap(null);
	}
	
	if(checkedStyle.checked){
		map.mapTypes.set('styled_map', styledMapType);
		map.setMapTypeId('styled_map');
	}else{
		map.setMapTypeId(mapaBase);
	}
	
	map.set(mapaBase);
	
	map.setZoom(zoom);
	map.setCenter({lat: latitude, lng: longitude});

}

function addMarker(latLng){
	
	var latitude = parseFloat(document.getElementById('latitude').value);
	var longitude = parseFloat(document.getElementById('longitude').value);
	var urlMarker = document.getElementById('corMarker').value;
	
	var myLatlng = new google.maps.LatLng(latitude,longitude);
	
	var marker = new google.maps.Marker({
		position: latLng,
		title: 'teste'
	});
	
	listaMarkers.push(marker);
	
	var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">Título Personalizado</h1>'+
            '<div id="bodyContent">'+
			'Entre com um Texto'+
            '</div>'+
            '</div>';
	
	var infowindow = new google.maps.InfoWindow({
	  content: contentString
	});
	
	marker.setIcon(urlMarker);
	marker.addListener('click', function() {
	  infowindow.open(map, marker);
	});
	marker.setMap(map);
}

function removerTodosMarkers(){
	
	listaMarkers.forEach(function(marcador){
		marcador.setMap(null);
	});
	
}
