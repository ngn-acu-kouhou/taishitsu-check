# 体質チェック

東洋医学の考え方をもとに、現在の体質傾向を振り返るための静的なセルフチェックページです。

チェック数が最も多いタイプを表示します。同数の場合は複数タイプを表示します。

## 使い方

`index.html` をブラウザで開くだけで利用できます。ビルドやサーバーは不要です。

## 注意

このページの結果は医療上の診断ではありません。強い痛み、急な出血・むくみ、息苦しさ、めまいなどがある場合や、症状が続く場合は医療機関に相談してください。

## デザインの差し替え

`themes/` に見た目の別バージョン（CSS のみ）を用意しています。HTML と JavaScript は共通なので、`index.html` の `<link rel="stylesheet" href="styles.css?...">` の `href` を差し替えるだけで切り替わります。

| ファイル | テイスト |
| --- | --- |
| `styles.css` | 現行。グリーン基調のやさしい配色 |
| `themes/a-wamodern.css` | 和モダン・金彩。藍 × 金 × 朱の格式ある華やかさ |
| `themes/b-botanical.css` | ボタニカル・ガーデン。淡い虹色グラデーションとすりガラスのカード |
| `themes/c-aurora.css` | オーロラ・ナイト。夜空にネオンが光るダークテーマ |

見比べるには `theme-preview.html` をブラウザで開き、右下のパネルで切り替えてください。`theme-preview.html?theme=2` のように URL で指定することもできます。

### 公開URL（デザイン案の見比べ用）

| 案 | URL |
| --- | --- |
| 現行 | https://ngn-acu-kouhou.github.io/taishitsu-check/v/00-current/ |
| 和モダン・金彩 | https://ngn-acu-kouhou.github.io/taishitsu-check/v/01-wamodern/ |
| ボタニカル・ガーデン | https://ngn-acu-kouhou.github.io/taishitsu-check/v/02-botanical/ |
| オーロラ・ナイト | https://ngn-acu-kouhou.github.io/taishitsu-check/v/03-aurora/ |

`v/` 配下の各 index.html は共通の `script.js` と各テーマ CSS を参照しているだけです。本番（トップページ）は `index.html` のまま変わりません。
