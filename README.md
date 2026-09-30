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


## 年度資料設定

每個帳號的年度設定存於 `{email}/user_info`，保留文件原有欄位：

```json
{
  "year_selected": "2026y",
  "years_available": ["2024y", "2026y"]
}
```

- 介面顯示與新增輸入使用 `2026`；資料庫使用 `2026y`。
- 已有 `year_selected` 時沿用該年度；不會自動加入任何歷史年度。
- `years_available` 缺少或為空時，設定頁顯示空清單，仍可新增年度。直接修改資料庫後，重新進入年度設定頁會讀取最新清單。
- `year_selected` 缺少時，依瀏覽器本地年份初始化當年：保留已有菜單，缺少時建立空白菜單，將當年加入可用清單並設為選定年度。
- 訂單路徑為 `{email}/eos_invioces/{year}y/{docId}`，菜單路徑為 `{email}/eos_menu/{year}y/current`。空年度不建立假訂單。
- 「設定 → 年度資料設定」可切換或新增年度；新增會將年度加入清單並直接選用，菜單不會從其他年度複製。
- 已有菜單、訂單或登記的年度不會被覆蓋；介面提供「加入並切換」保留已有資料。
- 年度初始化／新增以 transaction 同時更新菜單與設定，並以 merge 保留 `exp_date` 等其他欄位。
- 切換後清空訂單、菜單及編號快取；新年度載入成功前阻擋資料操作。跨年度的舊請求不會覆蓋目前快取。

合併前請以測試帳號驗收：未設定年度的登入、空年度清單、既有年度切換、新增年度、已有年度的加入，以及資料庫權限拒絕時的錯誤處理。
