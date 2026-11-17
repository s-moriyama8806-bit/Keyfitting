// iTunes Search API を、ブラウザの代わりにサーバー側で呼び出す関数。
// 呼び出し: GET /api/itunes?term=曲名+アーティスト名   （netlify.toml で /.netlify/functions/itunes に転送）
// 返り値  : iTunes Search API のJSONをそのまま返す（クライアントの照合ロジックは変更不要）

const ENDPOINT = 'https://itunes.apple.com/search';
const TIMEOUT_MS = 8000;

const json = (status, body, extra = {}) => ({
  statusCode: status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', ...extra },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') return json(405, { error: 'method_not_allowed' });

  const term = String((event.queryStringParameters || {}).term || '').trim();
  if (!term || term.length > 200) return json(400, { error: 'bad_term' });

  // 検索条件はサーバー側で固定する（この関数を汎用プロキシとして悪用されないため）
  const url = ENDPOINT + '?' + new URLSearchParams({
    media: 'music', entity: 'song', country: 'JP', lang: 'ja_jp', limit: '10', term,
  });

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } });
    // 混雑・制限(403/429)はそのままの番号で返す。クライアント側が待機して再試行する
    if (!res.ok) return json(res.status, { error: 'upstream', status: res.status }, { 'Cache-Control': 'no-store' });
    const text = await res.text();
    let data; try { data = JSON.parse(text); } catch { return json(502, { error: 'upstream_not_json' }, { 'Cache-Control': 'no-store' }); }
    return json(200, data, {
      // 同じ検索はNetlifyのCDNが1日使い回す。Appleへの問い合わせ(=サーバーIPあたりの回数制限)を減らすため
      'Cache-Control': 'public, max-age=3600',
      'Netlify-CDN-Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
    });
  } catch (e) {
    return json(e.name === 'AbortError' ? 504 : 502, { error: e.name === 'AbortError' ? 'timeout' : 'network' }, { 'Cache-Control': 'no-store' });
  } finally {
    clearTimeout(timer);
  }
};
