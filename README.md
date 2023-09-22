## Vinstagram-api

Vinstagram是一個由Instagram發想的社群平台，提供用戶註冊登入後瀏覽、發佈貼文，也可以對貼文按讚、留言，也可以追蹤其他使用者，而本Repo是後端API，使用Node.js搭配NestJS打造，並且使用GraphQL風格撰寫API

## 使用技術
| 技術                | 用途                |
| ------------------ | ------------------- |
|Node.js + NestJS   |後端框架              |
|Mongoose           |資料庫ORM             |
|MongoDB               |後端NoSQL資料庫         |
|apollo             |GraphQL套件             |

## 在本地運行專案

先將專案下載至本地端
```bash
$ git clone https://github.com/popojk/vinstagram-api.git
```
下載套件
```bash
$ npm install
```
啟動專案
```bash
# 開發環境
$ npm run start

# watch mode
$ npm run start:dev

# 正式環境
$ npm run start:prod
```