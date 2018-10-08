var map;

var listaMarkers = [];
var listaWaypoint = [];

function initMap(){
	
	geocoder = new google.maps.Geocoder();

	map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: -24.397, lng: -54.644},
		zoom: 8,
		streetViewControl: true
	});

	origemautocomplete = new google.maps.places.Autocomplete((document.getElementById('origem')),{types: ['geocode']});
	destinoautocomplete = new google.maps.places.Autocomplete((document.getElementById('destino')),{types: ['geocode']});
	enderecoautocomplete = new google.maps.places.Autocomplete((document.getElementById('endereco')),{types: ['geocode']});

	map.addListener('click', function(e) {
		getInfo(e);
	});

	/*
	map.addListener('click', function(e) {
		addWaypoint(e.latLng);
	});
	*/
	/*
	map.addListener('click', function(e) {
		//createCircle(e.latLng);
		addMarker(e.latLng);
	});
	*/	
	var drawingManager = new google.maps.drawing.DrawingManager({
	    drawingControl: true,
	    drawingControlOptions: {
	      position: google.maps.ControlPosition.TOP_CENTER,
	      drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle']
	    },
	    circleOptions: {
	      editable: true,
	    }
	  });

	google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
	  if (event.type == 'circle') {
	    var radius = event.overlay.getRadius();
	  }
	  alert(event.type);
	});

	drawingManager.setMap(map);

	cargaRegioes = new geoambiente.maps.WmsLayer({
		url: 'http://chi95a:8080/ofpr/wms',
		layer: 'ofpr:abrangencia',
		map: map
	});

	cargaRegioes = new geoambiente.maps.WmsLayer({
		url: 'http://chi95a:8080/ofpr/wms',
		layer: 'ofpr:uso_multiplo',
		map: map
	});

	
};

function getInfo(latLng){

	var infowindow = new google.maps.InfoWindow;
	var marker = new google.maps.Marker({
      position: latLng.latLng,
      map: map
    });


	cargaRegioes = new geoambiente.maps.WmsLayer({
		url: 'http://chi95a:8080/ofpr/wms',
		layer: 'ofpr:uso_multiplo',
		map: map
	});

	var args = getAtributosCamada('ofpr:uso_multiplo',map,latLng,'http://chi95a:8080/ofpr/wms');

	$.get(args, function(data) {
		if(data.features.length>0){
			infowindow.setContent(data.features[0].properties.ds_denominacao_ocupacao);
			infowindow.open(map, marker);
		}
	});


}

function geocodificar(){

	var latitude = parseFloat(document.getElementById('latitude').value);
	var longitude = parseFloat(document.getElementById('longitude').value);
	var endereco = document.getElementById('endereco').value;

	var latlng = new google.maps.LatLng(latitude, longitude);
	var infowindow = new google.maps.InfoWindow;

	if(endereco == ''){
		geocoder.geocode( { 'location': latlng}, function(results, status) {
	      	if (status === 'OK') {
		      if (results[1]) {
		        var marker = new google.maps.Marker({
		          position: latlng,
		          map: map
		        });
		        infowindow.setContent(results[1].formatted_address);
		        infowindow.open(map, marker);
		      } else {
		        window.alert('No results found');
		      }
	  		}	
	    });
	}else{
		geocoder.geocode( { 'address': endereco}, function(results, status) {
	      if (status == 'OK') {
	        map.setCenter(results[0].geometry.location);
	        var marker = new google.maps.Marker({
	            map: map,
	            position: results[0].geometry.location
	        });

	        document.getElementById('latitude').value = results[0].geometry.location.lat();
	        document.getElementById('longitude').value = results[0].geometry.location.lng();
		    
	      } else {
	        alert('Geocode was not successful for the following reason: ' + status);
	      }
	    });
	}
}

function applyRoute(){
	
    var directionsDisplay = new google.maps.DirectionsRenderer;
	var directionsService = new google.maps.DirectionsService;

	directionsService.route({
      origin: document.getElementById('origem').value,
      destination: document.getElementById('destino').value,
      waypoints: listaWaypoint,
      optimizeWaypoints: document.getElementById("otimizar").checked,
      travelMode: 'DRIVING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });

    directionsDisplay.setMap(map);
}

function addWaypoint(latLng){
	var marker = new google.maps.Marker({
		position: latLng,
		title: 'teste'
	});
	listaWaypoint.push({
      location: latLng,
      stopover: true
    });
	marker.setMap(map);

}

function createCircle(addMarker){

	var raio = parseInt(document.getElementById('raio').value);
	var cor = document.getElementById('cor').value;

	var circulo = new google.maps.Circle({
      fillColor: cor,
      map: map,
      center: latLng,
      radius: raio
    });

};

function addMarker(latLng){
	
	
	var marker = new google.maps.Marker({
		position: latLng,
		title: 'teste'
	});
	
	listaMarkers.push(latLng);
	
	marker.addListener('click', function() {
	  infowindow.open(map, marker);
	});
	marker.setMap(map);
}

function applyLine(){

	if(listaMarkers.length > 1){
		var linha = new google.maps.Polyline({
		    path: listaMarkers,
	 	});

	 	linha.setMap(map);
	}

};


function applyPolygon(){

	if(listaMarkers.length > 2){
		var poligono = new google.maps.Polygon({
			paths: listaMarkers,
		});

		poligono.setMap(map);
	}

};