#!/usr/bin/env python3
"""index.html を単一の情報源として、派生ページをすべて生成する。

生成先:
  columns/<slug>.html      … コラム個別ページ（印刷・共有用のパーマリンク）
  columns/index.html       … 旧・コラム一覧。トップのコラムへ転送するだけのページ
  theme-preview.html       … 本番と同じボタニカル・ガーデンの1枚
  v/00-current/index.html  … 旧デザイン（styles.css）
  v/01-wamodern/index.html … 和モダン・金彩
  v/02-botanical/index.html… ボタニカル・ガーデン（本番と同じ見た目）
  v/03-aurora/index.html   … オーロラ・ナイト

コラム本文もプレビューも index.html から写すので、内容がずれることがない。
index.html を編集したら、このスクリプトを実行し直すこと。

    python tools/build.py          # 生成
    python tools/build.py --check  # 生成物が最新か確認（CI 用、書き換えない）
"""

from __future__ import annotations

import argparse
import io
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

BANNER = (
    "    <!-- このファイルは tools/build.py が index.html から生成しています。\n"
    "         直接編集せず、index.html を直してからスクリプトを実行し直してください。 -->"
)

THEMES = [
    # (キー, テーマCSSのパス, 表示名, 説明)
    ("00-current", "styles.css", "現行", "グリーン基調のやさしい配色"),
    ("01-wamodern", "themes/a-wamodern.css", "和モダン・金彩", "藍 × 金 × 朱。格式ある華やかさ"),
    ("02-botanical", "themes/b-botanical.css", "ボタニカル・ガーデン", "淡い虹色グラデ × すりガラス"),
    ("03-aurora", "themes/c-aurora.css", "オーロラ・ナイト", "夜空にネオンが光るダーク"),
]

FONTS = (
    '    <link rel="preconnect" href="https://fonts.googleapis.com" />\n'
    '    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n'
    '    <link href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700'
    '&family=Zen+Old+Mincho:wght@600;700&display=swap" rel="stylesheet" />'
)

COLUMN_FONTS = (
    '    <link rel="preconnect" href="https://fonts.googleapis.com" />\n'
    '    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n'
    '    <link href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700'
    '&display=swap" rel="stylesheet" />'
)

COLUMNS_INDEX_URL = "../#columns"

# index.html の <details class="column-item"> 1件ぶん
COLUMN_RE = re.compile(
    r'<details class="column-item" id="column-(?P<slug>[\w-]+)" '
    r'data-description="(?P<description>[^"]*)">\s*'
    r'<summary>\s*'
    r'<span class="column-for">(?P<audience>.*?)</span>\s*'
    r'<h3>(?P<title>.*?)</h3>\s*'
    r'<p class="column-desc">(?P<blurb>.*?)</p>\s*'
    r'<p class="column-meta">(?P<minutes>.*?)</p>\s*'
    r'</summary>\s*'
    r'<div class="column-body">\n(?P<body>.*?)\n\s*</div>\s*</details>',
    re.S,
)


def read(path: Path) -> str:
    # Windows の core.autocrlf=true だと作業ツリーは CRLF になる。リポ内は LF なので LF にそろえて扱う。
    return io.open(path, encoding="utf-8", newline="").read().replace("\r\n", "\n")


def extract_body(html: str) -> str:
    """index.html の <body> の中身を取り出す。"""
    match = re.search(r"<body>\n(.*)\n  </body>", html, re.S)
    if not match:
        raise SystemExit("index.html の <body>…</body> を取り出せませんでした")
    return match.group(1)


def extract_footer(html: str) -> str:
    match = re.search(r"^ {4}<footer>.*?</footer>$", html, re.S | re.M)
    if not match:
        raise SystemExit("index.html の <footer> を取り出せませんでした")
    return match.group(0)


def asset_version(html: str) -> str:
    """index.html が home.css に付けているキャッシュバスターを流用する。"""
    match = re.search(r"home\.css\?v=([\w-]+)", html)
    return match.group(1) if match else "1"


def reprefix(body: str, prefix: str) -> str:
    """相対パスの href/src に prefix を足す（外部URL・アンカーは触らない）。"""
    if not prefix:
        return body
    return re.sub(
        r'(href|src)="(?!https?:|//|#|mailto:|tel:|data:|/)([^"]*)"',
        lambda m: f'{m.group(1)}="{prefix}{m.group(2)}"',
        body,
    )


def reindent(block: str, spaces: int) -> str:
    """ブロック全体の字下げを spaces 桁に揃える。"""
    lines = block.split("\n")
    widths = [len(l) - len(l.lstrip()) for l in lines if l.strip()]
    base = min(widths) if widths else 0
    pad = " " * spaces
    return "\n".join(pad + l[base:] if l.strip() else "" for l in lines)


# ---- コラム個別ページ ------------------------------------------------

def parse_columns(index_html: str) -> list[dict]:
    """index.html の <details> をコラムの一覧として読み取る。"""
    columns = []
    for match in COLUMN_RE.finditer(index_html):
        item = match.groupdict()
        body = item["body"]

        # 「このコラムだけのページを開く」はトップページ用。個別ページには出さない
        body = re.sub(r'\n?\s*<p class="column-permalink">.*?</p>', "", body, flags=re.S)

        # リード文は記事ヘッダーへ移す
        lead = re.search(r'<p class="article-lead">(.*?)</p>', body, re.S)
        if not lead:
            raise SystemExit(f'{item["slug"]}: <p class="article-lead"> が見つかりません')
        item["lead"] = lead.group(1).strip()
        body = body.replace(lead.group(0), "", 1)
        body = re.sub(r"\A[ \t]*\n+", "", body)

        # トップページでは h4/h5、記事ページでは h2/h3（columns.css がそう想定している）
        body = re.sub(r"<(/?)h4>", r"<\g<1>h2>", body)
        body = re.sub(r"<(/?)h5>", r"<\g<1>h3>", body)

        item["body"] = reindent(body.strip("\n"), 8)
        columns.append(item)

    if not columns:
        raise SystemExit("index.html からコラムを1件も読み取れませんでした")
    return columns


def column_nav(columns: list[dict], i: int) -> str:
    prev_link = (
        f'<a href="{COLUMNS_INDEX_URL}">← コラム一覧</a>'
        if i == 0
        else f'<a href="{columns[i - 1]["slug"]}.html">← 前：{columns[i - 1]["title"]}</a>'
    )
    next_link = (
        f'<a href="{COLUMNS_INDEX_URL}">コラム一覧へ →</a>'
        if i == len(columns) - 1
        else f'<a href="{columns[i + 1]["slug"]}.html">次：{columns[i + 1]["title"]} →</a>'
    )
    return (
        '        <nav class="article-nav" aria-label="コラムの移動">\n'
        f"          {prev_link}\n"
        f"          {next_link}\n"
        "        </nav>"
    )


def column_page(columns: list[dict], i: int, *, version: str, footer: str) -> str:
    item = columns[i]
    return f"""<!doctype html>
<html lang="ja">
  <head>
{BANNER}
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="{item['description']}" />
    <title>{item['title']} | 東洋医学コラム</title>
{COLUMN_FONTS}
    <link rel="stylesheet" href="../themes/b-botanical.css?v={version}" />
    <link rel="stylesheet" href="columns.css?v={version}" />
  </head>
  <body>
    <main>
      <p class="breadcrumb"><a href="../">体質チェック</a> ／ <a href="{COLUMNS_INDEX_URL}">東洋医学コラム</a></p>

      <article class="article">
        <header class="article-head">
          <p class="eyebrow">COLUMN {i + 1:02d} · {item['audience']}</p>
          <h1>{item['title']}</h1>
          <p class="article-lead">{item['lead']}</p>
          <p class="article-meta">{item['minutes']}で読めます</p>
        </header>

{item['body']}

{column_nav(columns, i)}
      </article>
    </main>

{footer}
  </body>
</html>
"""


def columns_redirect(*, version: str, footer: str) -> str:
    """旧・コラム一覧ページ。トップページのコラムへ転送する。"""
    return f"""<!doctype html>
<html lang="ja">
  <head>
{BANNER}
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="refresh" content="0; url={COLUMNS_INDEX_URL}" />
    <meta name="robots" content="noindex" />
    <link rel="canonical" href="{COLUMNS_INDEX_URL}" />
    <meta name="description" content="東洋医学コラムは体質チェックのページにまとめました。" />
    <title>東洋医学コラム | 体質チェック</title>
{COLUMN_FONTS}
    <link rel="stylesheet" href="../themes/b-botanical.css?v={version}" />
    <link rel="stylesheet" href="columns.css?v={version}" />
    <script>location.replace('{COLUMNS_INDEX_URL}');</script>
  </head>
  <body>
    <main>
      <section class="intro" aria-label="ページの移動">
        <p>東洋医学コラムは<a href="{COLUMNS_INDEX_URL}">体質チェックのページ</a>にまとめました。自動で移動します。切り替わらないときは、リンクをタップしてください。</p>
      </section>
    </main>

{footer}
  </body>
</html>
"""


# ---- デザインプレビュー ----------------------------------------------

def page(*, title: str, description: str, theme_href: str, prefix: str,
         body: str, version: str) -> str:
    return f"""<!doctype html>
<html lang="ja">
  <head>
{BANNER}
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="{description}" />
    <meta name="robots" content="noindex" />
    <title>{title}</title>
{FONTS}
    <link rel="stylesheet" href="{theme_href}?v={version}" />
    <link rel="stylesheet" href="{prefix}home.css?v={version}" />
  </head>
  <body>
{body}
  </body>
</html>
"""


def build() -> dict[Path, str]:
    index = read(ROOT / "index.html")
    body = extract_body(index)
    footer = extract_footer(index)
    version = asset_version(index)
    out: dict[Path, str] = {}

    # --- コラム個別ページ＋旧一覧の転送 ---
    columns = parse_columns(index)
    for i, item in enumerate(columns):
        out[ROOT / "columns" / f"{item['slug']}.html"] = column_page(
            columns, i, version=version, footer=footer
        )
    out[ROOT / "columns" / "index.html"] = columns_redirect(version=version, footer=footer)

    # --- デザインプレビュー ---
    out[ROOT / "theme-preview.html"] = page(
        title="体質チェック（ボタニカル・ガーデン）",
        description="体質チェックのプレビューです。内容は本番ページと同じものを表示しています。",
        theme_href="themes/b-botanical.css",
        prefix="",
        body=body,
        version=version,
    )
    for key, css, label, _note in THEMES:
        out[ROOT / "v" / key / "index.html"] = page(
            title=f"体質チェック（デザイン案：{label}）",
            description="体質チェックのデザイン案です。内容は本番ページと同じものを表示しています。",
            theme_href=f"../../{css}",
            prefix="../../",
            body=reprefix(body, "../../"),
            version=version,
        )
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true",
                        help="生成せず、既存ファイルが最新かどうかだけ確認する")
    args = parser.parse_args()

    stale = []
    for path, content in build().items():
        rel = path.relative_to(ROOT).as_posix()
        if args.check:
            if not path.exists() or read(path) != content:
                stale.append(rel)
            continue
        path.parent.mkdir(parents=True, exist_ok=True)
        io.open(path, "w", encoding="utf-8", newline="\n").write(content)
        print(f"generated: {rel}")

    if args.check:
        if stale:
            print("index.html より古いファイルがあります:")
            for rel in stale:
                print(f"  - {rel}")
            print("python tools/build.py を実行してください。")
            return 1
        print("生成物はすべて最新です。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
