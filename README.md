# KeyFitting — Netlify 公開用ファイル

## GitHub から Netlify に公開する手順

1. このフォルダの中身（`index.html`、`netlify.toml`、`netlify/`）を GitHub リポジトリのルートにアップロードして push します。
2. Netlify で **Add new site → Import an existing project** を選び、その GitHub リポジトリを接続します。
3. Build command は空欄、Publish directory は `.` のままでデプロイします。Netlify は `netlify.toml` を読み、Function をデプロイします。
4. デプロイ完了後、Netlify の Site configuration で `*.netlify.app` のサイト名（サブドメイン）を設定します。

## 同梱ファイル

- `index.html` — 背景を白にし、サイト名を KeyFitting に統一したアプリ本体。iTunes 検索は `/api/itunes` を使います。
- `netlify/functions/itunes.js` — iTunes Search API を呼び出す Netlify Function。
- `netlify.toml` — 公開ディレクトリ、Functions、`/api/itunes` の転送設定。

デプロイ後、`https://設定したサイト名.netlify.app/api/itunes?term=YOASOBI` を開き、JSON が返ることを確認できます。
