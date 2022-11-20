
pdfjsLib.GlobalWorkerOptions.workerSrc = "https://mozilla.github.io/pdf.js/build/pdf.worker.js";

const selectFile = localStorage.getItem('selectFile'); //檔案路徑
const canvas = new fabric.Canvas("canvas"); // 此處指 html 上的 canvas ID 套用 fabric.js
var pdfDoc = '';
var pageNum = 1
const downloadPDF = new jsPDF();
let isSave = false;
$(window).on('load', async (e) => {
  try {
    pdfDoc = await pdfjsLib.getDocument(selectFile).promise;// 載入檔案 
    $('.page_count').text(pdfDoc.numPages);
    await fabricToCavan(pageNum);
  }
  catch (e) {
    alert("上傳檔案遺失，請重新上傳");
    // window.location.href = "index.html";
  }

  //載入已有的簽名檔
  loadsignList();
});

$('#pdfPage-prev').on('click', function () {
  onPrevPage();
});
$('#pdfPage-next').on('click', function () {
  onNextPage();
});

// editTools
$('.editTools__sign').on('click', function () {
  $($(this).data("target")).modal({
    escapeClose: false,
    clickClose: true,
    showClose: false
  });
})
$('.editTools__check').on('click', function () {
  insertToCanvas('check', '');
});
$('.editTools__date').on('click', function () {
  insertToCanvas('date', '');
});
$('.editTools__word').on('click', function () {
  insertToCanvas('word', '')
});


// editTools canvas 動作
canvas.on({
  'object:modified': function (e) {
    addDeleteBtn(e);
  },
  'mouse:down': function (e) {
    if (!canvas.getActiveObject()) { //按的位置沒有選取到object
      $(".deleteBtn").remove();
    }
    else { //有選取到元素
      addDeleteBtn(e);
    }
  },
  'object:scaling': function (e) {
    $(".deleteBtn").remove();
  },
  'object:moving': function (e) {
    $(".deleteBtn").remove();
  },
  'object:rotating': function (e) {
    $(".deleteBtn").remove();
  },
})

$(document).on('click', ".deleteBtn", function () {
  canvasDeleteObject();
});

$(document).on('click', ".img-delete", function () {
  const li = $(this).parent();
  const deleteData = li.children().children().attr("src");
  li.remove();
  deleteItem('signList', deleteData);
});


//完成簽署
$("#finishSign").on('click', function () {
  const signCount = canvas.getObjects().filter((item) => (item.CSS_CANVAS === "signImage")).length;

  if (signCount > 0) {
    canvasUnEditable();
    $('.nav-bottom__item').prop("onclick", null).off("click");
    $(this).hide();
    $('#editTools').hide();
    $('#toIndex,#savePDF').show();
  } else {
    $('#modal-unfinish').modal({
      escapeClose: false,
      clickClose: false,
      showClose: false
    });
  }
});

//存成PDF
$('#savePDF').on('click', function () {

  const image = canvas.toDataURL("image/png");  // 將 canvas 存為圖片
  
  let fileName = prompt("輸入檔名");
  if (fileName == null || fileName == "") {
    fileName = "我的檔案";
  } 

  const saveResult = savePDF(image, fileName);
  if(saveResult){
    localStorage.setItem('lottiePath','ok.json');
    localStorage.setItem('lottieText','下載成功');   
    localStorage.setItem("selectFile","");
  } else{
    localStorage.setItem('lottiePath','wrong.json');
    localStorage.setItem('lottieText','下載失敗，請稍後再試');
  }
  localStorage.setItem('nextPage','index');
  localStorage.setItem('lottieLoop',false);
  location.href = "lottiePage.html";
});

$('#toIndex').on('click',function(){
  if(isSave){
    location.href = "index.html";
  }else{
    $('#modal-unSave').modal({
      escapeClose: false,
      clickClose: false,
      showClose: false
    });
  }

})

async function printPDF(pageNum) {
  const pdfPage = await pdfDoc.getPage(pageNum); // 抓取指定頁數  
  const canvas_wrap = $('.canvas-wrap');
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });


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


//前一頁
async function onPrevPage() {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  await fabricToCavan(pageNum);
}

//下一頁
async function onNextPage() {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  await fabricToCavan(pageNum);
}

function loadsignList() {
  // 若 localStorage 有資料才放入
  let signList = getStorageArray("signList");
  if (signList) {
    signList.forEach(function (item) {
      let li = "<li class='signList__item mb-12 d-flex align-items-center'>"
        + "<div class='flex-1'>"
        + "<img class='sign bg-tertiary radius-16 flex-1' src='" + item + "' onclick='insertToCanvas(\"" + 'image' + "\",this);'/>"
        + "</div>"
        + "<div class='img-delete'><img src='image/delete.svg'/></div>"
        + "</li>";
      $('.signList').append(li);
    });
  }
}

function insertToCanvas(item, data) {
  fabric.Object.prototype.cornerColor = '#fff';
  fabric.Object.prototype.cornerStrokeColor = '#0C8CE9';
  fabric.Object.prototype.borderColor = '#0C8CE9';
  fabric.Object.prototype.transparentCorners = false;
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
  let top = $(".canvas-wrap").scrollTop() + 100; //顯示在 .canvas-wrap 的 top 100px 
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
        image.CSS_CANVAS = "signImage";
        image.setControlsVisibility(HideControls);
        canvas.add(image);
      });
      $.modal.close();
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
}

function addDeleteBtn(e) {
  $(".deleteBtn").remove();
  var btnLeft = e.target.oCoords.tl.x - 10;
  var btnTop = e.target.oCoords.tl.y - 10;
  var deleteBtn = '<img src="image/close.svg" class="deleteBtn bg-primary" style="position:absolute;top:' + btnTop + 'px;left:' + btnLeft + 'px;cursor:pointer;"/>';
  $(".canvas-wrap").append(deleteBtn);
}

function canvasDeleteObject() {
  if (canvas.getActiveObject()) {
    canvas.remove(canvas.getActiveObject());//刪除圖片
    $(".deleteBtn").remove();
  }
}

function canvasUnEditable() {
  $(".deleteBtn").remove();
  canvas.forEachObject(function (object) {
    object.selectable = false;  //可否選取
    canvas.discardActiveObject(); //取消已經選取的
    canvas.requestRenderAll();
  });
}

function savePDF(image,fileName) {
  //傳入image圖形

  // 設定背景在 PDF 中的位置及大小
  const width = downloadPDF.internal.pageSize.width;
  const height = downloadPDF.internal.pageSize.height;
  downloadPDF.addImage(image, "png", 0, 0, width, height);

  // 將檔案取名並下載
  try{
    let src = downloadPDF.output('dataurlstring');   
    
    const historyPDF = {
      title : fileName,
      src :src
    }
    addItem('historyList', JSON.stringify(historyPDF)); //存歷史紀錄
    
    isSave = true;
    downloadPDF.save("download.pdf");
    
    return true;
  }
  catch (e){
    alert(e.message);
  }
}
