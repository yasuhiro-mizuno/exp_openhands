# ToDoアプリ

Openhands検証用のToDoアプリケーションです。

## 機能

- ✅ タスクの追加・編集・削除
- 📅 作成日時の自動記録
- ⏰ 期限の設定
- 🚨 期限まで1日の場合は赤字で警告表示
- ✏️ 既存タスクの編集機能
- ✔️ タスクの完了状態管理

## 使用方法

### 開発環境での起動

```bash
npm install
npm start
```

サーバーはポート12000で起動します。
ブラウザで `http://localhost:12000` にアクセスしてください。

### 本番環境での起動

```bash
npm install --production
npm start
```

## 技術スタック

- **フロントエンド**: HTML, CSS, JavaScript (Vanilla JS)
- **バックエンド**: Node.js + Express
- **データ保存**: JSON ファイル

## API エンドポイント

- `GET /api/todos` - 全てのToDoを取得
- `POST /api/todos` - 新しいToDoを追加
- `PUT /api/todos/:id` - ToDoを更新
- `DELETE /api/todos/:id` - ToDoを削除
