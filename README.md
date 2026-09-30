# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


## 專案設定

每個帳號的專案設定存於 `{email}/user_info`，保留文件原有欄位：

```json
{
  "project_selected": "2026y",
  "projects_available": ["2024y", "2026y", "夏季活動"]
}
```

- 專案名稱直接對應資料表名稱，介面顯示 `2025y` 就會使用 `2025y`，新增輸入 `2028` 就建立 `2028`。不自動加上或省略 `y`。
- 專案可使用中文、英文或數字名稱；新增輸入會去除前後空白，名稱需符合 Firestore 集合 ID 限制。
- 已有 `project_selected` 時沿用該專案，不會自動補歷史專案清單。
- `projects_available` 缺少或為空時，設定頁顯示空清單，仍可新增專案。直接修改資料庫後，重新進入專案設定頁會讀取最新清單。
- 未設定 `project_selected` 時，主選單只顯示「設定」與「登出」，設定頁只開放專案設定。登入與讀取清單不會補欄位、建立預設專案或轉換舊欄位；選擇或新增專案後才開放資料操作。
- 訂單路徑為 `{email}/eos_invioces/{project}/{docId}`，菜單路徑為 `{email}/eos_menu/{project}/current`。空專案不建立假訂單。
- 「設定 → 專案設定」可切換或新增專案；新增會加入清單並直接選用，菜單不會從其他專案複製。
- 已有菜單、訂單或登記的專案不會被覆蓋；介面提供「加入並切換」保留已有資料。
- 新增以 transaction 同時更新菜單與設定，並以 merge 保留 `exp_date` 等其他欄位。
- 切換後清空訂單、菜單及編號快取；新專案載入成功前阻擋資料操作。舊專案的請求不會覆蓋目前快取。
- 設定只讀取 `project_selected`／`projects_available`，不讀取或轉換舊年度欄位。既有帳號可自行在資料庫補上新欄位，完整專案名稱保持與既有資料表一致，例如 `2025y`，不需搬移訂單或菜單。
- 設定頁路徑改為 `#/setting/projects`；原本 `#/setting/years` 連結會轉到新頁面。

合併前請以測試帳號驗收：舊欄位尚未手動補入新欄位的登入、未設定專案的登入、空專案清單、完整名稱顯示、既有專案切換、新增中文名稱專案、已有專案的加入，以及資料庫權限拒絕時的錯誤處理。

## 正式版與測試版部署

- 正式版： https://cyui.github.io/chef_eos_js/ ，推送至 `main` 時自動部署。
- 測試版： https://cyui.github.io/chef_eos_js/test/ ，只會手動部署，所有功能分支共用此網址。
- 更新任一版本時，會保留另一個版本；`gh-pages` 分支保存兩個版本的建置結果。請勿用本機 `npm run deploy` 覆寫此分支。

手動部署測試版：

1. 進入 GitHub repository → **Actions** → **Deploy to GitHub Pages**。
2. 按 **Run workflow**，**Use workflow from** 選 `main`（使用最新版部署流程）。
3. 在 **test_branch** 輸入要測試的分支，例如 `feature/year-selection`。
4. 按 **Run workflow**，等待 Test、Build 與 Deploy 完成後開啟測試網址。

測試 branch 本身不需要先合併。每次部署會取代原本測試版；輸入 `main` 或 `gh-pages` 會被拒絕。正式版需先成功部署一次。

測試版使用該 branch 的 Firebase 設定，通常與正式版連到同一個資料庫；請使用測試帳號操作。
