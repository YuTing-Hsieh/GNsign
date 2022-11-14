
const lottiePath = localStorage.getItem("lottiePath");
const lottieText = localStorage.getItem("lottieText");
const nextPage = localStorage.getItem("nextPage");
$('.lottie__text').html(lottieText);
var animation = bodymovin.loadAnimation({
    container: document.getElementById('lottie'), // Required
    path: '../image/' + lottiePath, // Required
    renderer: 'svg', // Required
    loop: true, // Optional
    autoplay: true // Optional
})

setTimeout('nextpage()', 5000);

function nextpage() {
    location.href = nextPage + ".html";
}