const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const clearBtn = document.querySelector(".clear");
const saveBtn = document.querySelector(".save");

// 設定線條的相關數值
ctx.lineWidth = 4;
ctx.lineCap = "round";

// 設置狀態來確認滑鼠 / 手指是否按下或在畫布範圍中
let isPainting = false;

$('.colorPicker').click(function (e) {
  e.preventDefault();
  $('.colorPicker').removeClass('active');
  $(this).addClass('active');
  let lineColor = $(this).children().css("background-color");
  ctx.strokeStyle = lineColor;
})

// listener 電腦版
canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", finishedPosition);
canvas.addEventListener("mouseleave", finishedPosition);
canvas.addEventListener("mousemove", draw);

// listener 手機板
canvas.addEventListener("touchstart", startPosition);
canvas.addEventListener("touchend", finishedPosition);
canvas.addEventListener("touchcancel", finishedPosition);
canvas.addEventListener("touchmove", draw);

clearBtn.addEventListener("click", reset);
saveBtn.addEventListener("click", saveImage);

// 取得滑鼠 / 手指在畫布上的位置
function getPaintPosition(e) {
  const canvasSize = canvas.getBoundingClientRect();

  if (e.type === "mousemove") {
    return {
      x: e.clientX - canvasSize.left,
      y: e.clientY - canvasSize.top,
    };
  } else {
    return {
      x: e.touches[0].clientX - canvasSize.left,
      y: e.touches[0].clientY - canvasSize.top,
    };
  }
}

// 開始繪圖時，將狀態開啟
function startPosition(e) {
  e.preventDefault();
  $('.canvas-content').css("display", "none");
  isPainting = true;
}

// 結束繪圖時，將狀態關閉，並產生新路徑
function finishedPosition() {
  isPainting = false;
  ctx.beginPath();
}

// 繪圖過程
function draw(e) {
  // 滑鼠移動過程中，若非繪圖狀態，則跳出
  if (!isPainting) return;

  // 取得滑鼠 / 手指在畫布上的 x, y 軸位置位置
  const paintPosition = getPaintPosition(e);

  // 移動滑鼠位置並產生圖案
  ctx.lineTo(paintPosition.x, paintPosition.y);
  ctx.stroke();
}

// 重新設定畫布
function reset() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  $('.canvas-content').css("display", "block");
}

//儲存圖片
function saveImage() {
  // 圖片儲存的類型選擇 png ，並將值放入 img 的 src
  const newImg = canvas.toDataURL("image/png");
  addItem('signList', newImg);

  if (!localStorage.getItem('signList')) return;
  localStorage.setItem('lottiePath', 'loading.json');
  localStorage.setItem('lottieText', '簽名優化中...');
  localStorage.setItem('lottieLoop',true);
  localStorage.setItem('nextPage', 'renderPDF');
  location.href = "lottiePage.html";
}

