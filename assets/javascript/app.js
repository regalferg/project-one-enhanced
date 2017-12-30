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


function initMap() {

    myLatlng = {
        lat: parseFloat(mapLat),
        lng: parseFloat(mapLong)
    };
    console.log(myLatlng);
    map = new google.maps.Map(document.getElementById('map'), {
        center: myLatlng,
        zoom: 18
    });

      var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
        var mainMarker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        icon: iconBase + 'parking_lot_maps.png',
        title: 'EVENT LOCATION'
    });

         map.addListener('center_changed', function() {
    // 3 seconds after the center of the map has changed, pan back to the
    // marker.
    window.setTimeout(function() {
        map.panTo(mainMarker.getPosition());
    }, 10000);
});



    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: myLatlng,
        radius: 800,
        type: ['restaurant']
    }, callback);
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {
    console.log(place.name);
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location


    });


    google.maps.event.addListener(marker, 'click', function() {
        console.log(place.name);
        map.setZoom(18);
        map.setCenter(marker.getPosition());
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });




 

}

 


// marker.addListener('click', function() {
//     map.setZoom(22);
//     map.setCenter(marker.getPosition());
// });

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
  // });


// $("#add-band").on("click", function(event)


 submitHandler: function(form){
  
    event.preventDefault();

//     if (!$('form')[0].checkValidity()) {
// $('form').find('input[type="submit"]').click();
// return false;
// }


    eventName = $("#bandinput").val().trim();
    eventCity = $("#venueinput").val().trim();
    var queryURL =
        "https://app.ticketmaster.com/discovery/v2/events?apikey=Y68sacNOAQxxvGbr0Du9KNZNykWVrE3m&keyword=" + eventName + "&city=" + eventCity;
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(response) {
        console.log(response._embedded);
        document.preventDefault;


        var results = response._embedded.events[0]._embedded.venues;
        for (var i = 0; i < results.length; i++) {
            var eventsObj = results[i];
            console.log(eventsObj);
            try{$("#band-display").html("<tr><td><strong> Venue Name:</strong><br> " + eventsObj.name + "</td></tr>");}catch(error){}
            try{$("#band-display").append("<tr><td><strong> Address: </strong><br>" + eventsObj.address.line1 + "</td></tr>");}catch(error){}
            try{$("#band-display").append("<tr><td><strong> General Rules:</strong><br> " + eventsObj.generalInfo.generalRule + "</td></tr>");}catch(error){}
            try{$("#band-display").append("<tr><td><strong> Parking:</strong><br> " + eventsObj.parkingDetail + "</td></tr>");}catch(error){}
            try{$("#band-display").append("<tr><td><strong> Social: </strong><br>" + eventsObj.social.twitter.handle + "</td></tr>");}catch(error){}
            try{var posterImage = eventsObj.images[0].url;
            console.log(posterImage);
            var img = $('<img>').attr('src', posterImage);
            $("#band-display").append(img);}catch(error){}

            mapLat = eventsObj.location.latitude;
            mapLong = eventsObj.location.longitude;
            console.log(mapLat + " " + mapLong);



            initMap();

        }


    });



}
});