// CALLING JQUERY FOR SCREEN LOADER
$(window).on("load", function(){
    setTimeout(function(){
        $(".loader").fadeOut("slow");
    },500);
});

//RATING SYSTEM
// ratingStars = document.querySelectorAll('.rating-btn-grp .star');
// console.log("Running")
// console.log(ratingStars)
// ratingStars.forEach((item,idx)=>{
//     item.addEventListener('click', function(){
//         console.log("invoked!")
//         for (let i=0; i<ratingStars.length; i++){
//             if (i<= idx){
//                 ratingStars[i].classList.replace('fa-regular', 'fa-solid');
//             }
//         }
//     })
// })
// ratingStars.forEach(i=>{
//     i.classList.replace('.fa-solid', '.fa-regular');
// })
