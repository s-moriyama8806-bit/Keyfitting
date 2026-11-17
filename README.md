# KEYFITTING — Netlify Functions 版

iTunes Search API への通信を、端末ではなく Netlify Functions（サーバー側）で行います。

## 構成
- index.html … アプリ本体（iTunes検索は /api/itunes を呼ぶ）
- netlify/functions/itunes.js … Appleへ問い合わせる関数
- netlify.toml … /api/itunes を関数へ転送する設定

## 公開手順
Netlify Drop（ドラッグ&ドロップ）は関数を動かせません。次のどちらかで公開してください。
1. GitHubにこのフォルダ一式をpush → Netlifyで「Import from Git」（Build command は空、Publish directory は . ）
2. Netlify CLI: `npm i -g netlify-cli` → `netlify deploy --prod`

動作確認: 公開URLの `/api/itunes?term=YOASOBI` をブラウザで開き、JSONが表示されればOKです。
