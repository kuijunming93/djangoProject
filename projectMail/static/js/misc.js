
// CALLING JQUERY FOR SCREEN LOADER
$(window).on("load", function(){
    setTimeout(function(){
        $(".loader").fadeOut("slow");
    },200);
});