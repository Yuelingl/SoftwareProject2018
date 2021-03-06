

/**
 * Calculates and displays the address details of 200 S Mathilda Ave, Sunnyvale, CA
 * based on a free-form text
 *
 *
 * A full list of available request parameters can be found in the Geocoder API documentation.
 * see: http://developer.here.com/rest-apis/documentation/geocoder/topics/resource-geocode.html
 *
 * @param   {H.service.Platform} platform    A stub class to access HERE services
 */
function geocode(platform) {
    var geocoder = platform.getGeocodingService(),
        geocodingParameters = {
            searchText: ORT,
            jsonattributes: 1
        };

    geocoder.geocode(
        geocodingParameters,
        onSuccess,
        onError
    );
}
/**
 * This function will be called once the Geocoder REST API provides a response
 * @param  {Object} result          A JSONP object representing the  location(s) found.
 *
 * see: http://developer.here.com/rest-apis/documentation/geocoder/topics/resource-type-response-geocode.html
 */
function onSuccess(result) {
    var locations = result.response.view[0].result;
    /*
     * The styling of the geocoding response on the map is entirely under the developer's control.
     * A representitive styling can be found the full JS + HTML code of this example
     * in the functions below:
     */
    addLocationsToMap(locations);
    addLocationsToPanel(locations);
    // ... etc.
}

/**
 * This function will be called if a communication error occurs during the JSON-P request
 * @param  {Object} error  The error message received.
 */
function onError(error) {
    alert('Ooops!');
}




/**
 * Boilerplate map initialization code starts below:
 */

//Step 1: initialize communication with the platform
var platform = new H.service.Platform({
    app_id: 'TERY6ac06hlozadvCdyy',
    app_code: '1mqHefqb9ZMTdauG1qNNIQ',
    useHTTPS: true
});
var pixelRatio = window.devicePixelRatio || 1;
var defaultLayers = platform.createDefaultLayers({
    tileSize: pixelRatio === 1 ? 256 : 512,
    ppi: pixelRatio === 1 ? undefined : 320
});

//Step 2: initialize a map - 
var map = new H.Map(document.getElementById('map'),
    defaultLayers.normal.map, {
        
        zoom: 12,
        pixelRatio: pixelRatio
    });

var locationsContainer = document.getElementById('panel');

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Hold a reference to any infobubble opened
var bubble;

/**
 * Opens/Closes a infobubble
 * @param  {H.geo.Point} position     The location on the map.
 * @param  {String} text              The contents of the infobubble.
 */
function openBubble(position, text) {
    if (!bubble) {
        bubble = new H.ui.InfoBubble(
            position,
            { content: text });
        ui.addBubble(bubble);
    } else {
        bubble.setPosition(position);
        bubble.setContent(text);
        bubble.open();
    }
}

/**
 * Creates a series of H.map.Markers for each location found, and adds it to the map.
 * @param {Object[]} locations An array of locations as received from the
 *                             H.service.GeocodingService
 */
function addLocationsToMap(locations) {
    var group = new H.map.Group(),
        position,
        i;

    // Add a marker for each location found
    for (i = 0; i < locations.length; i += 1) {
        position = {
            lat: locations[i].location.displayPosition.latitude,
            lng: locations[i].location.displayPosition.longitude
        };
        marker = new H.map.Marker(position);
        marker.label = locations[i].location.address.label;
        group.addObject(marker);
    }

    group.addEventListener('tap', function (evt) {
        map.setCenter(evt.target.getPosition());
        openBubble(
            evt.target.getPosition(), evt.target.label);
    }, false);

    // Add the locations group to the map
    map.addObject(group);
    map.setCenter(group.getBounds().getCenter());
}

// Now use the map as required...
geocode(platform);