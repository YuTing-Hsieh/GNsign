
const lottiePath = localStorage.getItem("lottiePath");
const lottieText = localStorage.getItem("lottieText");
const nextPage = localStorage.getItem("nextPage");
const lottieLoop = JSON.parse(localStorage.getItem("lottieLoop"));

$('.lottie__text').html(lottieText);
var animation = bodymovin.loadAnimation({
    container: document.getElementById('lottie'), // Required
    path: '~/../image/' + lottiePath, // Required
    renderer: 'svg', // Required
    loop: lottieLoop, // Optional
    autoplay: true // Optional
})

if(nextPage == "index"){
    $('.toIndex').show();
} else{
    // setTimeout('nextpage()', 3000);
}


function nextpage() {
    location.href = nextPage + ".html";
}