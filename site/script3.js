var map;

var markerCluster;
var heatmap;

var cliente1 = {nome: "Victor Hugo", divida: 0, diasematraso: 10, endereco: "Rua Manoel Moreira Andrion, 2399 - Jardim Panorama, Foz do Iguaçu - PR, Brasil", pessoafisica: true, lat: null, lng: null};
var cliente2 = {nome: "Hugo Victor", divida: 0, diasematraso: 200, endereco: "Av. Venezuela, 853 - Jardim América, Foz do Iguaçu - PR", pessoafisica: true, lat: null, lng: null};
var cliente3 = {nome: "Joao da Silva", divida: 12000, diasematraso: 350, endereco: "Av. Juscelino Kubitscheck, 928 - Vila Paraguaia, Foz do Iguaçu - PR", pessoafisica: false, lat: null, lng: null};
var cliente4 = {nome: "Da Silva Joao", divida: 15000, diasematraso: 40, endereco: "R. Santos Dumont, 1014 - Centro, Foz do Iguaçu - PR, 85851-040", pessoafisica: true, lat: null, lng: null};
var cliente5 = {nome: "Maria Joaquina", divida: 20000, diasematraso: 60, endereco: "R. Jorge Sanwais, 2023 - Centro, Foz do Iguaçu - PR, 85851-150", pessoafisica: false, lat: null, lng: null};
var cliente6 = {nome: "Joaquina Maria", divida: 500, diasematraso: 400, endereco: "R. Edmundo de Barros, 1101 - Centro, Foz do Iguaçu - PR, 85851-120", pessoafisica: true, lat: null, lng: null};
var cliente7 = {nome: "Jose Bonifacio", divida: 785, diasematraso: 10, endereco: "R. Pilar, 594 - Jardim das Palmeiras, Foz do Iguaçu - PR, 85869-748", pessoafisica: false, lat: null, lng: null};
var cliente8 = {nome: "Dom Pedro", divida: 4202, diasematraso: 25, endereco: "R. Sales, 241 - Jardim Lancaster, Foz do Iguaçu - PR, 85869-060", pessoafisica: false, lat: null, lng: null};
var cliente9 = {nome: "Dom Joao", divida: 1234, diasematraso: 30, endereco: "R. Florianópolis, 442 - Vila C, Foz do Iguaçu - PR, 85870-120", pessoafisica: false, lat: null, lng: null};
var cliente10 = {nome: "Jose da Cunha", divida: 654, diasematraso: 100, endereco: "R. João XXIII, 1282, Santa Terezinha de Itaipu - PR, 85875-000", pessoafisica: true, lat: null, lng: null};

var vetClientes = [cliente1,cliente2,cliente3,cliente4,cliente5,cliente6,cliente7,cliente8,cliente9,cliente10];
var listaMarkers = [];
var markersVisiveis = [];

function initMap(){

	geocoder = new google.maps.Geocoder();
	enderecoautocomplete = new google.maps.places.Autocomplete((document.getElementById('endereco')),{types: ['geocode']});

	map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: -25.524564, lng: -54.569966},
		zoom: 13,
		streetViewControl: true
	});

	map.addListener('click', function(e) {
		getInfo(e);
	});

	vetClientes.forEach(function (cliente){
		geocodeByAdress(cliente);
	});

	usoMultiplo = new geoambiente.maps.WmsLayer({
		url: 'http://chi95a:8080/ofpr/wms',
		layer: 'uso_multiplo',
		map: map
	});

	abrangencia = new geoambiente.maps.WmsLayer({
		url: 'http://chi95a:8080/ofpr/wms',
		layer: 'ofpr:abrangencia',
		map: map
	});

};

function geoserverLayer(checkbox){
	if(checkbox.checked){
		if(checkbox.name == "usoMultiplo"){
			usoMultiplo.setMap(map);
		}
		if(checkbox.name == "abrangencia"){
			abrangencia.setMap(map);
		}
	}else{
		if(checkbox.name == "usoMultiplo"){
			usoMultiplo.setMap(null);
		}
		if(checkbox.name == "abrangencia"){
			abrangencia.setMap(null);
		}
	}
}

function getInfo(latLng){

	var infowindow = new google.maps.InfoWindow;
	var marker = new google.maps.Marker({
      position: latLng.latLng,
      map: map,
      visible: false
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

function gerarRota(){

	var directionsDisplay = new google.maps.DirectionsRenderer;
	var directionsService = new google.maps.DirectionsService;

	var endereco = document.getElementById("endereco").value;

	var	vetlatlng = [];
	listaMarkers.forEach(function(marker){
		vetlatlng.push({
	      location: new google.maps.LatLng(marker.position.lat(), marker.position.lng()),
	      stopover: true
	    });
	});

	directionsService.route({
      origin: endereco,
      destination: endereco,
      waypoints: vetlatlng,
      optimizeWaypoints: true,
      travelMode: 'DRIVING'
    }, function(response, status) {
      if (status === 'OK') {
      	console.log(response);
      	response.routes[0].legs.forEach(function(leg){
      		vetClientes.forEach(function(cli){
      			if(cli.endereco = leg.end_address){

      			}
      		});
      		console.log(leg.end_address);
      		console.log(leg.distance.text);
	      	console.log(leg.duration.text);
      	});
	      	
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });

    directionsDisplay.setMap(map);
	

}

function atualizaTotalizador(){
	markersVisiveis = [];
	listaMarkers.forEach(function(marker){
		if(marker.getVisible()){
			markersVisiveis.push(marker);
		}
	});

	var nfaixaAzul = document.getElementById("nfaixaAzul");
	var nfaixaVerde = document.getElementById("nfaixaVerde");
	var nfaixaVermelha = document.getElementById("nfaixaVermelha");

	var totalfaixaAzul = document.getElementById("totalfaixaAzul");
	var totalfaixaVerde = document.getElementById("totalfaixaVerde");
	var totalfaixaVermelha = document.getElementById("totalfaixaVermelha");

	var a=0,b=0,c=0;
	var bTOTAL=0,cTOTAL=0;

	markersVisiveis.forEach(function(markerVisivel){

		if(markerVisivel.cliente.divida == 0){
			a++;
		}
		if((markerVisivel.cliente.divida > 0) && ((markerVisivel.cliente.divida <= 5000))){
			b++;
			bTOTAL += markerVisivel.cliente.divida;
		}
		if(markerVisivel.cliente.divida > 5000){
			c++;
			cTOTAL += markerVisivel.cliente.divida;
		}
	});

	nfaixaAzul.innerHTML = a;
	nfaixaVerde.innerHTML = b;
	nfaixaVermelha.innerHTML = c;

	totalfaixaAzul.innerHTML = 0;
	totalfaixaVerde.innerHTML = bTOTAL;
	totalfaixaVermelha.innerHTML = cTOTAL;
}

function filtrarDiaAtraso(){

	var inicio = document.getElementById("inicio").value;
	var fim = document.getElementById("fim").value;

	listaMarkers.forEach(function(marker){
		if((marker.cliente.diasematraso >= inicio) && (marker.cliente.diasematraso <= fim)){
			marker.setVisible(true);
		}else{
			marker.setVisible(false);
		}
	});
	atualizaTotalizador();

}

function tipoVisualizacao(tipo){

	if(tipo == "data"){
		removerTodosMarkers();
		if(markerCluster){
			markerCluster.clearMarkers();
		}
		if(heatmap){
			heatmap.setMap(null);
		}
		listaMarkers.forEach(function(marker){
			marker.setMap(map);
		});
	}
	if(tipo == "cluster"){
		if(heatmap){
			heatmap.setMap(null);	
		}
		markerCluster = new MarkerClusterer(map, listaMarkers, {imagePath: '../marker-clusterer/images/m'});
	}
	if(tipo == "heat"){
		tipoVisualizacao("data");
		var	latlng = [];
		listaMarkers.forEach(function(marker){
			latlng.push(new google.maps.LatLng(marker.position.lat(), marker.position.lng()));
		});
		heatmap = new google.maps.visualization.HeatmapLayer({
		  data: latlng
		});
		heatmap.setMap(map);
	}
}

function pesquisarEndereco(){
	var endereco = document.getElementById('endereco').value;

	geocoder.geocode( { 'address': endereco}, function(results, status) {
      if (status == 'OK') {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
	    
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });

};
function teste(){
	alert();
}

function geocodeByAdress(cli){

	var endereco = cli.endereco;

	geocoder.geocode( {'address': endereco}, function(results, status) {
      if (status == 'OK') {

        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
            cliente: cli
        });

        var infowindow = new google.maps.InfoWindow({
			content: "<b>Nome: </b>"+cli.nome+"<br>"+"<b>Endereço: </b>"+cli.endereco+"<br>"+"<b>Divida: </b>"+cli.divida+" Reais <br>"+"<b>Dias em Atraso: </b>"+cli.diasematraso+"<br>"+"<b>Pessoa Fisica: </b>"+cli.pessoafisica
		});

        marker.addListener('click', function() {
			infowindow.open(map, marker);
	    });

        cli.lat = results[0].geometry.location.lat();
        cli.lng = results[0].geometry.location.lng();

        if(cli.divida == 0){
        	marker.setIcon("http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_blue.png");
        }else{
        	if(cli.divida <= 5000){
        		marker.setIcon("http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_green.png");
        	}else{
        		marker.setIcon("http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_red.png");
        	}
        }

        listaMarkers.push(marker);

      } else {
        alert('Geocode was not successful for the following reason: ' + status);
        console.log(endereco);
      }
    });

}

function removerTodosMarkers(){
	
	listaMarkers.forEach(function(marker){
		marker.setMap(null);
	});
	
}

function filtroTipoPessoa(){
	var tipoPessoa = document.getElementById("tipoPessoa").value;
	
	if(tipoPessoa == "Pessoa Física"){
		listaMarkers.forEach(function(marker){
			if(marker.cliente.pessoafisica){	
				marker.setVisible(true);
			}else{
				marker.setVisible(false);
			}
		});
	}
	if(tipoPessoa == "Pessoa Jurídica"){
		listaMarkers.forEach(function(marker){
			if(!marker.cliente.pessoafisica){	
				marker.setVisible(true);
			}else{
				marker.setVisible(false);
			}
		});
	}
	if(tipoPessoa == "Todos"){
		listaMarkers.forEach(function(marker){
			marker.setVisible(true);
		});
	}
	atualizaTotalizador();
}