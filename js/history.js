var renderData = {
    history: true,
}
const historyList = getStorageArray("historyList");

$(window).on('load', async (e) => {
    localStorage.setItem("selectFile", "");
    loadPdfList();
    if(historyList){
        $('.historyMessage').hide();
    }

});

$(document).on('click','.cardList__item', function () {
    let pdfTitle = $(this).find('.card__content').text();
    let pdfSrc = '';
    historyList.find(function(item){
        let itemData = JSON.parse(item);
        if (itemData.title == pdfTitle){
            pdfSrc = itemData.src;
            return true;
        }
    })
    console.log(pdfSrc);
    localStorage.setItem("selectFile", pdfSrc);

    let paramStr = $.param(renderData);
    location.href = "renderPDF.html?" + paramStr;
})

function loadPdfList() {
    // 若 localStorage 有資料才放入   
    if (historyList) {
        historyList.forEach(function (item) {
            let historyPDF = JSON.parse(item);
            let li = "<li class='d-flex justify-content-between align-items-center bg-tertiary radius-12 cardList__item'>"
                + "<p class='card__content'>" + historyPDF.title + "</p>"
                + "<img class='img-details m-20' src='image/details.svg' alt='前往預覽檔案'>"
                + "<div class='pdfSrc d-none'>" + historyPDF.src + "</div>"
                + "</li>";
            $('.cardList').append(li);
        })
    }
}
