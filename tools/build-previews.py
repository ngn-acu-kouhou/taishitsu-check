#!/usr/bin/env python3
"""index.html から、デザイン見比べ用のページを生成する。

生成先:
  theme-preview.html       … 本番と同じボタニカル・ガーデンの1枚
  v/00-current/index.html  … 旧デザイン（styles.css）
  v/01-wamodern/index.html … 和モダン・金彩
  v/02-botanical/index.html… ボタニカル・ガーデン（本番と同じ見た目）
  v/03-aurora/index.html   … オーロラ・ナイト

本文（<body> の中身）は index.html をそのまま写すので、本番と構成がずれない。
index.html を編集したら、このスクリプトを実行し直すこと。

    python tools/build-previews.py          # 生成
    python tools/build-previews.py --check  # 生成物が最新か確認（CI 用、書き換えない）
"""

from __future__ import annotations

import argparse
import io
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

BANNER = (
    "    <!-- このファイルは tools/build-previews.py が index.html から生成しています。\n"
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


def read(path: Path) -> str:
    return io.open(path, encoding="utf-8", newline="").read()


def extract_body(html: str) -> str:
    """index.html の <body> の中身を取り出す。"""
    match = re.search(r"<body>\n(.*)\n  </body>", html, re.S)
    if not match:
        raise SystemExit("index.html の <body>…</body> を取り出せませんでした")
    return match.group(1)


def asset_version(html: str) -> str:
    """index.html が home.css に付けているキャッシュバスターを流用する。"""
    match = re.search(r'home\.css\?v=([\w-]+)', html)
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
    version = asset_version(index)
    out: dict[Path, str] = {}

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
            print("python tools/build-previews.py を実行してください。")
            return 1
        print("プレビューはすべて最新です。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
