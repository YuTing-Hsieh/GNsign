$('#file-upload').bind('change', function () {
    var fileName = '';
    fileName = $(this).val();
    $('#file-selected').html(fileName);
})

const selectFile = document.querySelector("#file-upload");
selectFile.addEventListener("change", (e) => {
    if (e.target.files[0] === undefined) return;
  
    // 透過 input 所選取的檔案
    const file = e.target.files[0];

    // 產生fileReader物件
     const fileReader = new FileReader();

    // 將資料做處理，轉成 Base64 (string)
    fileReader.readAsDataURL(file);
  
    // 綁入事件監聽
    fileReader.addEventListener("load", () => {
  
      const result = fileReader.result;
      localStorage.setItem('selectFile',result);
      });

    if (!localStorage.getItem('selectFile')) return;
    localStorage.setItem('lottiePath','loading.json');
    localStorage.setItem('lottieText','上傳中...');
    localStorage.setItem('nextPage','sign');
    location.href = "lottiePage.html";
  });
