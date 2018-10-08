function getAtributosCamada(camada, map, args, urlgeoserver) {
	var es = (map.getBounds().getSouthWest().toString()).replace(/[()]/g, '').split(", ");
	var ne = (map.getBounds().getNorthEast().toString()).replace(/[()]/g, '').split(", ");

	var url = urlgeoserver;

	url = url.concat("?REQUEST=GetFeatureInfo");
	url = url.concat("&EXCEPTIONS=application/vnd.ogc.se_xml");
	url = url.concat("&BBOX=" + es[1] + "," + es[0] + "," + ne[1] + "," + ne[0]);
	url = url.concat("&X=" + parseInt(args.pixel.x));
	url = url.concat("&Y=" + parseInt(args.pixel.y));
	url = url.concat("&INFO_FORMAT=application/json");
	url = url.concat("&QUERY_LAYERS=" + camada);
	url = url.concat("&LAYERS=" + camada);
	url = url.concat("&SRS=EPSG:4674");
	url = url.concat("&WIDTH=" + map.getDiv().offsetWidth);
	url = url.concat("&HEIGHT=" + map.getDiv().offsetHeight);
	url = url.concat("&VERSION=1.1.1");

	return url;
}