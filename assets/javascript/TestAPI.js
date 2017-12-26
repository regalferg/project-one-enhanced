 
	var artist = "";
  var title = "";

  function searchLyrics(){
    if (artist.toLowerCase() === "nickelback") {
          artist= "Rick Astley";
          title  = "never gonna give you up"
        }


		var queryURL = "https://api.lyrics.ovh/v1/"+ artist + "/" + title ;
      $.ajax({
      url: queryURL,
      method: "GET"
    }).done(function(response) {
    	 console.log(response);
        document.preventDefault;


        
        $("table tbody ").html("<tr><td>" + response.lyrics + "</td></tr>");


  

});

  }



      $("#add-band").on("click", function(event) {
        event.preventDefault();
 
        
         artist = $("#band-input").val().trim();
        console.log(artist);
        ;
        
        });



		$("#add-lyrics").on("click", function(event) {
        event.preventDefault();
        
        title = $("#lyrics-input").val().trim();

    
       	console.log(title);
        //$("#band-display").html("<h3>" + artist + "</h3>");
        searchLyrics();        
      });

        


//    $(document).on("click", searchLyrics);




