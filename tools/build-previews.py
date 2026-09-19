#!/usr/bin/env python3
"""index.html から、デザイン見比べ用のページを生成する。

生成先:
  theme-preview.html       … 右下のパネルでテーマを切り替えられる1枚
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

SWITCHER_STYLE = """    <style>
      /* 切替パネル（テーマCSSの影響を受けないよう全て指定） */
      #theme-switcher { position: fixed; right: 16px; bottom: 16px; z-index: 9999; width: 220px; padding: 12px 12px 10px; border-radius: 14px; background: #1f2430; color: #f4f4f8; font: 700 12px/1.5 system-ui, "Zen Kaku Gothic New", sans-serif; box-shadow: 0 16px 40px rgb(0 0 0 / 35%); letter-spacing: 0; }
      #theme-switcher p { margin: 0 0 8px; font-size: 11px; color: #aab0c4; letter-spacing: .08em; }
      #theme-switcher button { display: block; width: 100%; min-height: 0; margin: 0 0 6px; padding: 8px 10px; border: 1px solid rgb(255 255 255 / 15%); border-radius: 8px; background: rgb(255 255 255 / 6%); color: inherit; font: inherit; text-align: left; cursor: pointer; letter-spacing: 0; transform: none; box-shadow: none; animation: none; }
      #theme-switcher button:hover { background: rgb(255 255 255 / 14%); transform: none; box-shadow: none; }
      #theme-switcher button.is-active { background: #ffd66b; border-color: #ffd66b; color: #1f2430; }
      #theme-switcher button small { display: block; font-weight: 400; font-size: 10.5px; opacity: .8; }
      #theme-switcher code { display: block; margin-top: 6px; padding: 6px 8px; border-radius: 6px; background: rgb(0 0 0 / 35%); color: #ffd66b; font: 11px/1.4 ui-monospace, Consolas, monospace; word-break: break-all; }
      #theme-switcher .toggle { position: absolute; top: -12px; right: -6px; width: 26px; height: 26px; margin: 0; padding: 0; border-radius: 50%; background: #ffd66b; border: 0; color: #1f2430; text-align: center; line-height: 26px; font-size: 14px; }
      #theme-switcher.is-collapsed { width: auto; padding: 8px 12px; }
      #theme-switcher.is-collapsed > :not(.toggle):not(.title) { display: none; }
      @media (max-width: 760px) { #theme-switcher { right: 10px; bottom: 10px; width: 190px; } }
    </style>"""

SWITCHER_SCRIPT = """    <script>
      (function () {
        var link = document.getElementById('theme-css');
        var panel = document.getElementById('theme-switcher');
        var pathEl = document.getElementById('theme-path');
        var buttons = Array.prototype.slice.call(panel.querySelectorAll('button[data-theme]'));
        function apply(path) {
          link.href = path;
          pathEl.textContent = path;
          buttons.forEach(function (b) { b.classList.toggle('is-active', b.dataset.theme === path); });
          try { localStorage.setItem('taishitsu-theme', path); } catch (e) {}
        }
        buttons.forEach(function (b) { b.addEventListener('click', function () { apply(b.dataset.theme); }); });
        panel.querySelector('.toggle').addEventListener('click', function () {
          panel.classList.toggle('is-collapsed');
          this.textContent = panel.classList.contains('is-collapsed') ? '+' : '\\u2212';
        });
        var saved = null;
        try { saved = localStorage.getItem('taishitsu-theme'); } catch (e) {}
        var q = new URLSearchParams(location.search).get('theme');
        var initial = q && buttons[parseInt(q, 10)] ? buttons[parseInt(q, 10)].dataset.theme : (saved || 'styles.css');
        apply(initial);
      })();
    </script>"""


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
         body: str, version: str, theme_link_id: str = "",
         extra_head: str = "", extra_body: str = "") -> str:
    id_attr = f' id="{theme_link_id}"' if theme_link_id else ""
    head_extra = f"\n{extra_head}" if extra_head else ""
    body_extra = f"\n\n{extra_body}" if extra_body else ""
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
    <link{id_attr} rel="stylesheet" href="{theme_href}?v={version}" />
    <link rel="stylesheet" href="{prefix}home.css?v={version}" />{head_extra}
  </head>
  <body>
{body}{body_extra}
  </body>
</html>
"""


def switcher_markup() -> str:
    buttons = "\n".join(
        f'      <button type="button" data-theme="{css}">{i}. {label}'
        f"<small>{note}</small></button>"
        for i, (_key, css, label, note) in enumerate(THEMES)
    )
    return f"""    <!-- ▼ デザイン切替パネル（見比べ専用。本番の index.html には含めない） -->
    <div id="theme-switcher" role="region" aria-label="デザイン切替">
      <button class="toggle" type="button" aria-label="パネルを畳む／開く">−</button>
      <p class="title">デザイン切替</p>
{buttons}
      <code id="theme-path">styles.css</code>
    </div>
{SWITCHER_SCRIPT}"""


def build() -> dict[Path, str]:
    index = read(ROOT / "index.html")
    body = extract_body(index)
    version = asset_version(index)
    out: dict[Path, str] = {}

    out[ROOT / "theme-preview.html"] = page(
        title="デザイン見比べ | 体質チェック",
        description="体質チェックのデザイン案を切り替えて見比べるページです。",
        theme_href="styles.css",
        prefix="",
        body=body,
        version=version,
        theme_link_id="theme-css",
        extra_head=SWITCHER_STYLE,
        extra_body=switcher_markup(),
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
