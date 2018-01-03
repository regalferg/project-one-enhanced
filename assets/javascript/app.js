var eventName = '';
var eventCity = '';
var map;
var infowindow;
var mapLat = 0;
var mapLong = 0;
var myLatlng = {
    lat: 40.752664,
    lng: -73.994309
};

//Google Maps Initialize
function initMap() {

    myLatlng = {
        lat: parseFloat(mapLat),
        lng: parseFloat(mapLong)
    };
    //console.log(myLatlng);
    //Zooms to center of map
    map = new google.maps.Map(document.getElementById('map'), {
        center: myLatlng,
        zoom: 18
    });
    //Custom Icon for Event Location
    var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
    var mainMarker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        icon: iconBase + 'parking_lot_maps.png',
        title: 'EVENT LOCATION'
    });
    // 5 seconds after the center of the map has changed, pan back to the
    // marker.
    map.addListener('center_changed', function() {
        window.setTimeout(function() {
            map.panTo(mainMarker.getPosition());
        }, 5000);
    });

    // Displays infowindows details and shows restaurants 800 meter radius
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: myLatlng,
        radius: 800,
        type: ['restaurant']
    }, callback);
}

//Calls createmarker for each of the results
function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

//creates markers for each location of the results
function createMarker(place) {
    //console.log(place.name);
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
   });

    //Event to zoom and recenter map once marker is clicked
    google.maps.event.addListener(marker, 'click', function() {
        //console.log(place.name);
        map.setZoom(18);
        map.setCenter(marker.getPosition());
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

//Begin Form Validation
$("#eventSearch").validate({
    rules: {
        "bandinput": {
            required: true,
            minlength: 2
        },
        venueinput: "required"
    },
    messages: {
        "bandinput": {
            required: "*Please enter an Event",
            minlength: "Your data must be at least 2 characters"
        },
        venueinput: "*Please provide a City Name"
    },

    // $("#add-band").on("click", function(event)

    //Function call attached to form submission and Ajax API call
    submitHandler: function(form) {
        event.preventDefault();
        eventName = $("#bandinput").val().trim();
        eventCity = $("#venueinput").val().trim();
        var queryURL =
            "https://app.ticketmaster.com/discovery/v2/events?apikey=Y68sacNOAQxxvGbr0Du9KNZNykWVrE3m&keyword=" + eventName + "&city=" + eventCity;
        //console.log(queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(response) {
            document.preventDefault;
            console.log(response._embedded);
            //Catch undefined results
            if (response._embedded === undefined) {
                console.log("Not Found");
                $("#band-display").html("<tr><td><strong> EVENT NOT FOUND</strong><br> ");
                return "Not Found";
            }
            //API results for each display item as well as error catching for missing items
            var results = response._embedded.events[0]._embedded.venues;
            //console.log(results);
            for (var i = 0; i < results.length; i++) {
                var eventsObj = results[i];
                console.log(eventsObj);
                try {
                    $("#band-display").html("<tr><td><strong> Venue Name:</strong><br> " + eventsObj.name + "</td></tr>");
                } catch (error) {}
                try {
                    $("#band-display").append("<tr><td><strong> Address: </strong><br>" + eventsObj.address.line1 + "</td></tr>");
                } catch (error) {}
                try {
                    $("#band-display").append("<tr><td><strong> General Rules:</strong><br> " + eventsObj.generalInfo.generalRule + "</td></tr>");
                } catch (error) {}
                try {
                    $("#band-display").append("<tr><td><strong> Parking:</strong><br> " + eventsObj.parkingDetail + "</td></tr>");
                } catch (error) {}
                try {
                    $("#band-display").append("<tr><td><strong> Social: </strong><br>" + eventsObj.social.twitter.handle + "</td></tr>");
                } catch (error) {}
                try {
                    var posterImage = eventsObj.images[0].url;
                    //console.log(posterImage);
                    var img = $('<img>').attr('src', posterImage);
                    $("#band-display").append(img);
                } catch (error) {}

                mapLat = eventsObj.location.latitude;
                mapLong = eventsObj.location.longitude;
                //console.log(mapLat + " " + mapLong);
                initMap();
            }
        });
    }
});