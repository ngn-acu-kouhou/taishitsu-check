# 体質チェック

東洋医学の考え方をもとに、現在の体質傾向を振り返るための静的なセルフチェックページです。

チェック数が最も多いタイプを表示します。同数の場合は複数タイプを表示します。

## トップページの構成（1ページ完結）

`index.html` は上から下へ、この順に並んでいます。

1. **体質チェック** … チェック項目 →「判定する」→ 結果（気・血・津液の解説つき）
2. **東洋医学コラム** … 8本すべての本文を、見出しタップで開く `<details>` 形式で掲載
3. **中信鍼灸師会 名簿** … 所属治療院の一覧ページへのリンク（ページ末尾の大きなボタン）

コラムの本文は `columns/` 配下の各ページと同じ内容です。`columns/` のページも残してあり、
印刷や個別共有のために各コラムの末尾からリンクしています。

### スタイルの構成

| ファイル | 役割 |
| --- | --- |
| `themes/b-botanical.css` | 本番のテーマ（チェック部分・結果・フッター） |
| `home.css` | 開閉式コラム `.columns-inline` と名簿 `.roster`。テーマ非依存で、4テーマどれでも動く |
| `columns/columns.css` | `columns/` 配下の個別コラムページ用 |

コラム本文を直すときは、**`index.html` 内の該当 `<details>` と `columns/<名前>.html` の両方**を更新してください。

## 使い方

`index.html` をブラウザで開くだけで利用できます。ビルドやサーバーは不要です。

## 注意

このページの結果は医療上の診断ではありません。強い痛み、急な出血・むくみ、息苦しさ、めまいなどがある場合や、症状が続く場合は医療機関に相談してください。

## デザインの差し替え

`themes/` に見た目の別バージョン（CSS のみ）を用意しています。HTML と JavaScript は共通なので、`index.html` の `<link rel="stylesheet" href="...">` の `href` を差し替えるだけで切り替わります。**現在の本番採用は `themes/b-botanical.css`（ボタニカル・ガーデン）です。**

| ファイル | テイスト |
| --- | --- |
| `themes/b-botanical.css` | ★現行採用★ ボタニカル・ガーデン。淡い虹色グラデーションとすりガラスのカード |
| `styles.css` | 旧デザイン。グリーン基調のやさしい配色 |
| `themes/a-wamodern.css` | 和モダン・金彩。藍 × 金 × 朱の格式ある華やかさ |
| `themes/c-aurora.css` | オーロラ・ナイト。夜空にネオンが光るダークテーマ |

見比べるには `theme-preview.html` をブラウザで開き、右下のパネルで切り替えてください。`theme-preview.html?theme=2` のように URL で指定することもできます。

### 公開URL（デザイン案の見比べ用）

| 案 | URL |
| --- | --- |
| 旧デザイン | https://ngn-acu-kouhou.github.io/taishitsu-check/v/00-current/ |
| 和モダン・金彩 | https://ngn-acu-kouhou.github.io/taishitsu-check/v/01-wamodern/ |
| ボタニカル・ガーデン（★現行採用） | https://ngn-acu-kouhou.github.io/taishitsu-check/v/02-botanical/ |
| オーロラ・ナイト | https://ngn-acu-kouhou.github.io/taishitsu-check/v/03-aurora/ |

### プレビューは自動生成（手で編集しない）

`theme-preview.html` と `v/` 配下の4ページは、**`index.html` から自動生成しています**。
チェック・コラム・名簿すべて本番と同じ内容で、参照するテーマ CSS だけが違います。

```bash
python tools/build-previews.py          # index.html から5ファイルを生成し直す
python tools/build-previews.py --check  # 生成物が index.html より古くないか確認（書き換えない）
```

`index.html` を編集したら、**必ず `python tools/build-previews.py` を実行してから**コミットしてください。
生成ファイルを直接編集しても、次の生成で上書きされます。

### テーマを増やすとき

1. `themes/` に CSS を追加し、`:root` に `--heading-font` / `--heading-weight` を書く
   （コラム見出しがそのテーマの書体に揃います）
2. `tools/build-previews.py` の `THEMES` に1行足して、スクリプトを実行

コラムと名簿のスタイル（`home.css`）は、テーマ変数のフォールバック連鎖で色を決めているため、
`--coral` などを持たないテーマでも破綻しません。明るいテーマ・暗いテーマの両方で確認済みです。

## 体験会アンケート

`survey/` に、体験ブース参加者向けの啓蒙型アンケート（スマホ・QR配布用）があります。
設置手順・設問の意図・集計の見方は [`survey/README.md`](survey/README.md) を参照してください。

公開URL: `https://ngn-acu-kouhou.github.io/taishitsu-check/survey/`
