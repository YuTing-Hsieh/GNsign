
pdfjsLib.GlobalWorkerOptions.workerSrc = "https://mozilla.github.io/pdf.js/build/pdf.worker.js";


const selectFile = localStorage.getItem('selectFile'); //檔案路徑
const canvas = new fabric.Canvas("canvas"); // 此處指 html 上的 canvas ID 套用 fabric.js
var pdfDoc = '';
var pageNum = 1

$(window).on('load', async (e) => {
  pdfDoc = await pdfjsLib.getDocument(selectFile).promise;// 載入檔案 
  $('.page_count').text(pdfDoc.numPages);
  fabricToCavan(pageNum);


  // 若 localStorage 有資料才放入
  if (localStorage.getItem("signList")) {
    let signList = JSON.parse(localStorage.getItem("signList"));
    signList.forEach(function (item) {
      let li = "<li class='signList__item mb-12 d-flex align-items-center'>"
        + "<div class='flex-1'>"
        + "<img class='sign bg-tertiary radius-16 flex-1' src='" + item + "' onclick='insertToCanvs(\"" + 'image' + "\",this);'/>"
        + "</div>"
        + "<div class='img-delete'><img src='image/delete.svg'/></div>"
        + "</li>";
      $('.signList').append(li);
    });
  }
});

async function printPDF(pageNum) {
  const pdfPage = await pdfDoc.getPage(pageNum); // 抓取指定頁數  
  const canvas_wrap = $('.canvas-wrap');
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");


  const viewport = pdfPage.getViewport({
    scale: (canvas_wrap.width()) / pdfPage.getViewport({ scale: 1 }).width
  });  // 設定 PDF 內容的顯示比例

  canvas.width = viewport.width; // 設定 canvas 的大小與 PDF 相等
  canvas.height = viewport.height;


  const renderTask = pdfPage.render({ // 渲染 PDF
    canvasContext: ctx, // 指 canvans 環境
    viewport: viewport, // 尺寸
  });

  //回傳做好的 PDF
  return renderTask.promise.then(() => canvas);
}

async function pdfToImage(pdfData) {

  // 設定 PDF 轉為圖片時的比例
  const scale = 1;

  // 回傳圖片
  return new fabric.Image(pdfData, {
    id: "renderPDF",
    scaleX: scale,
    scaleY: scale,
  });

}


async function fabricToCavan(pageNum) {
  const pdfData = await printPDF(pageNum, pdfDoc);
  const pdfImage = await pdfToImage(pdfData);

  canvas.requestRenderAll();
  // 調整canvas大小
  canvas.setWidth(pdfImage.width);
  canvas.setHeight(pdfImage.height);
  canvas.setBackgroundImage(pdfImage, canvas.renderAll.bind(canvas));
  $('.page_num').text(pageNum);
}

/**
 * Displays previous page.
 */
function onPrevPage() {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  fabricToCavan(pageNum);
}
$('#pdfPage-prev').on('click', onPrevPage);
/**
 * Displays next page.
 */
function onNextPage() {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  fabricToCavan(pageNum);
}
$('#pdfPage-next').on('click', onNextPage);

$(".nav-bottom__item").on("click", function () {
  $($(this).data("target")).modal({
    escapeClose: false,
    clickClose: true,
    showClose: false
  });
  $(this).toggleClass('unactive');
});

function insertToCanvs(item, data) {
  let HideControls = {
    'tl': false,
    'tr': true,
    'bl': true,
    'br': true,
    'ml': false,
    'mt': false,
    'mr': false,
    'mb': false,
    'mtr': false
  };
  let top = $(".canvas-wrap").scrollTop() + 100; /*顯示在 .canvas-wrap 的 top 100px */
  let left = 150;
  switch (item) {
    case 'image':
      let src = $(data).attr("src");
      fabric.Image.fromURL(src, function (image) {
        // 設定簽名出現的位置及大小，後續可調整
        image.top = top;
        image.left = left;
        image.scaleX = 0.5;
        image.scaleY = 0.5;
        image.setControlsVisibility(HideControls);
        canvas.add(image);
      });
      break;
    case 'check':
      fabric.Image.fromURL("~/../image/check-black.png", function (image) {
        // 設定簽名出現的位置及大小，後續可調整
        image.top = top;
        image.left = left;
        image.scaleX = 1;
        image.scaleY = 1;
        image.setControlsVisibility(HideControls);
        canvas.add(image);
      });
      break;
    case 'date':
      let currentDate = new Date().toJSON().slice(0, 10);
      const iDate = new fabric.IText(currentDate, {
        top: top,
        left: left
      })
      canvas.add(iDate)
      break;
    case 'word':
      const iText = new fabric.IText("點我編輯", {
        top: top,
        left: left
      })
      canvas.add(iText)
      break;

  }



  $.modal.close();

}

function addDeleteBtn(e) {
  $(".deleteBtn").remove();
  var btnLeft = e.target.oCoords.tl.x - 10;
  var btnTop = e.target.oCoords.tl.y - 10; /*100 = image.top */
  var deleteBtn = '<img src="image/close.svg" class="deleteBtn bg-primary" style="position:absolute;top:' + btnTop + 'px;left:' + btnLeft + 'px;cursor:pointer;"/>';
  $(".canvas-wrap").append(deleteBtn);
}

canvas.on('object:modified', function (e) {
  addDeleteBtn(e);
});
canvas.on('mouse:down', function (e) {
  var a = canvas.getActiveObject();
  if (!canvas.getActiveObject()) {
    $(".deleteBtn").remove();
  }
  else {
    addDeleteBtn(e);
  }
});
canvas.on('object:scaling', function (e) {
  $(".deleteBtn").remove();
});
canvas.on('object:moving', function (e) {
  $(".deleteBtn").remove();
});
canvas.on('object:rotating', function (e) {
  $(".deleteBtn").remove();
});

$(document).on('click', ".deleteBtn", function () {
  if (canvas.getActiveObject()) {
    canvas.remove(canvas.getActiveObject());
    $(".deleteBtn").remove();
  }
});

$(document).on('click', ".img-delete", function () {
  $(this).parent().remove();
});

$(".newSign").on('click', function () {
  location.href = "sign.html";
})