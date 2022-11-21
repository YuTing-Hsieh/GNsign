# GNsign

![12061579703802991521_2022-11-07T05_26_24 368Z](https://user-images.githubusercontent.com/64962514/202937193-030726f7-6616-459a-8cf6-09c273cf1d96.png)

## <i class="fa fa-paper-plane" aria-hidden="true"></i> 作品說明
**UIUX Design：** [K-T](https://2022.thef2e.com/users/12061579703802991521) <br>
**標示文件：** [LINK](https://www.figma.com/file/6ZjDFQSrwRy6OUAXDmJNhz/%E5%B0%8F%E7%B6%A0%E7%B0%BD?node-id=0%3A1)</br>
**Demo：** [小綠簽](https://yuting-hsieh.github.io/GNsign/index)

## <i class="fa fa-paper-plane" aria-hidden="true"></i> 第三方服務
* jquery
* canvas、PDF.js、fabric.js、jsPDF
* Lottie
* localStorage

## <i class="fa fa-paper-plane" aria-hidden="true"></i> Sass 結構
* variables
* mixins
* reset
* modules
* layout
* main

## <i class="fa fa-paper-plane" aria-hidden="true"></i> javascript
* index、history - 頁面用
* localStorage - localStorage操作
* bodymovies - 動畫跳轉頁 
* canvas、pdf - 簽署功能相關

## <i class="fa fa-paper-plane" aria-hidden="true"></i> 作品說明
mobile 為主，主要練習的部分：
1.產生的PDF背景圖隨螢幕寬度調整，長度過長可以下向拉
2.儲存多個簽名檔 (匯入簽名檔功能概念雷同所以略過)
3.簽署功能彈性高-文字、日期可以修改，減少重複輸入
4.簽署圖檔客製化 - 刪除按鈕、框線、canvas.on事件、定位
5.驗證 - 完成簽署時確認有無簽名檔、未儲存時提示
6.歷史訊息完成
7.尚未調整輸出的檔案大小，如果儲存檔案過大會出現狀況，可以按首頁的「清除暫存資訊」
