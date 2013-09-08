
$(function (){

    var updateSize = function(){
        $(".explicacion .background").height($(".explicacion").height());
        $(".explicacion .background").width($("body").width());
    }
    
    $(window).bind('orientationchange', function() {
	    updateSize();
    });
    
    $(window).bind('resize', function() {
        updateSize();
    });
    
    

    updateSize();
})