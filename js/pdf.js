const selectFile = document.querySelector("#file-upload");
selectFile.addEventListener("change", (e) => {
    if (e.target.files[0] === undefined) return;
  
    // 透過 input 所選取的檔案
    const file = e.target.files[0];
  
    // 產生fileReader物件
    const fileReader = new FileReader();
  
    // 將資料做處理
    fileReader.readAsArrayBuffer(file);
  
    // 綁入事件監聽
    fileReader.addEventListener("load", () => {
  
      // 獲取readAsArrayBuffer產生的結果，存在 localStorage
      const typedarray = new Uint8Array(fileReader.result);
      localStorage.setItem('selectFile',typedarray);

    });
    
    if (localStorage.getItem('selectFile') === undefined) return;
    localStorage.setItem('lottiePath','loading.json');
    localStorage.setItem('lottieText','上傳中...');
    localStorage.setItem('nextPage','sign');
    location.href="lottiePage.html";
  });



// pdfjsLib.GlobalWorkerOptions.workerSrc = "https://mozilla.github.io/pdf.js/build/pdf.worker.js";
// const selectFile = document.querySelector(".select");
// const canvas = document.querySelector("#canvas");
// const ctx = canvas.getContext("2d");

// async function renderPDF(data) {
//   const pdfDoc = await pdfjsLib.getDocument(data).promise; // 載入檔案
//   const pdfPage = await pdfDoc.getPage(1); // 抓取第 1 頁
//   const viewport = pdfPage.getViewport({ scale: 1 });  // 設定 PDF 內容的顯示比例
//   canvas.width = viewport.width; // 設定 canvas 的大小與 PDF 相等
//   canvas.height = viewport.height;
//   pdfPage.render({ // 渲染 PDF
//     canvasContext: ctx, // 指 canvans 環境
//     viewport: viewport, // 尺寸比例
//   });
// }

