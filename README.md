
# AI 腦肌雙能健康系統 (Health Buddy)

這是一個整合了 **Gemini AI**、**認知日記**與**運動處方管理**的專業病患健康管理平台。

## 🚀 如何部署到 GitHub Pages？

請按照以下步驟將此專案變成公開網頁：

### 第一步：建立 GitHub 儲存庫 (Repository)
1. 登入您的 [GitHub](https://github.com/) 帳號。
2. 點擊右上角 `+` 號，選擇 **New repository**。
3. 設定儲存庫名稱 (例如：`health-buddy`)，並設為 **Public**。
4. 點擊 **Create repository**。

### 第二步：上傳檔案
如果您不熟悉 Git 指令，可以直接使用網頁上傳：
1. 在您的儲存庫頁面，點擊 **uploading an existing file**。
2. 將此專案的所有檔案（包含 `.github` 資料夾）拖入網頁中。
3. 點擊 **Commit changes**。

### 第三步：開啟 GitHub Pages 設定
1. 在儲存庫頂部選單點擊 **Settings**。
2. 在左側選單選擇 **Pages**。
3. 在 **Build and deployment** 下的 **Source** 選擇 `GitHub Actions`。
4. 等待約 1-2 分鐘，上方會出現一個網址（例如：`https://yourname.github.io/health-buddy/`），點擊即可進入系統！

## 🛠 技術架構
- **前端框架**: React 19 (ESM Mode)
- **樣式設計**: Tailwind CSS
- **圖示庫**: Lucide React
- **人工智慧**: Google Gemini API (@google/genai)
- **部署工具**: GitHub Actions

## ⚠️ 注意事項
- **API Key**: 本系統需要 Google Gemini API Key 才能運作。在 GitHub Pages 環境下，請確保您的環境變數已正確配置，或透過代理服務進行串接。
- **隱私權**: 系統中所有病患紀錄皆儲存於瀏覽器的 `localStorage` 中，不會上傳至任何雲端資料庫，確保病患隱私。
