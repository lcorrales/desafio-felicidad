
$(window).bind('hashchange', loadView);

function loadView(){
	$(".page-container").fadeOut();
	var newLocation = window.location.hash;
	
	if(newLocation.length == 0){
		newLocation = "#portada"; 
	}
		
    $(".page-container").fadeOut();
    
    $(newLocation).hide();
    $(newLocation).removeClass("inactive");
	$(newLocation).fadeIn();

}

$(loadView());