/**
 * 体験会アンケート（看護研究学会）の回答受け取り用 Google Apps Script
 *
 * 【設置手順】
 *  1. 書き込み先のスプレッドシートを用意し、URL から ID を控える
 *     （https://docs.google.com/spreadsheets/d/【ここがID】/edit）
 *  2. https://script.google.com/home で「新しいプロジェクト」を作る
 *  3. 既定のコードを全部消して、このファイルの中身を貼り付け、
 *     SPREADSHEET_ID を控えた ID に書き換えて保存
 *  4. 右上の「デプロイ > 新しいデプロイ」→ 種類「ウェブアプリ」
 *       - 次のユーザーとして実行 : 自分
 *       - アクセスできるユーザー   : 全員
 *  5. 表示されたウェブアプリURL（.../exec で終わる）をコピーし、
 *     survey/survey.js の CONFIG.endpoint に貼り付ける
 *
 * ※ 設問を増やしても、回答の受け取り（doPost）は直す必要はありません。
 *    新しい項目は自動で右端の列に追加されます。
 *    集計シートは下の SUMMARY_QUESTIONS を直してから「集計とグラフを作り直す」を実行します。
 */

// 書き込み先のスプレッドシートID（URLの /d/ と /edit のあいだの文字列）
// Drive「看護研究学会 企業出展鍼灸体験会」フォルダの「看護研究学会 鍼灸体験会アンケート回答」
var SPREADSHEET_ID = '1Wb2qZKn7iT1GYw88P-z8_iyQsDT6dJEu0qtQSy4kmfQ';
// この名前のシートがなければ、先頭のシートに書き込む
var SHEET_NAME = '回答';

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet_();
    var headers = getHeaders_(sheet);

    // 未知のキーがあれば見出し行に追加する
    var added = false;
    Object.keys(data).forEach(function (key) {
      if (headers.indexOf(key) === -1) {
        headers.push(key);
        added = true;
      }
    });
    if (added) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
    }

    var row = headers.map(function (key) {
      var value = data[key];
      return value === undefined || value === null ? '' : value;
    });
    sheet.appendRow(row);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: true, message: 'survey endpoint is alive' });
}

function getSheet_() {
  var book = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
  return book.getSheetByName(SHEET_NAME) || book.getSheets()[0];
}

function getHeaders_(sheet) {
  if (sheet.getLastRow() === 0 || sheet.getLastColumn() === 0) {
    return [];
  }
  return sheet.getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0]
    .filter(function (name) { return name !== ''; });
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* =====================================================================
   集計シート（選択式の設問ごとの件数・割合と棒グラフ）
   ---------------------------------------------------------------
   件数は「回答」シートを参照する数式なので、回答が届くたびに自動で更新され、
   グラフも追従します。スクリプトを毎回動かす必要はありません。
   設問や選択肢を変えたときだけ、スプレッドシートのメニュー
   「アンケート集計 > 集計とグラフを作り直す」を実行してください。
   SUMMARY_QUESTIONS は survey/survey.js の STEPS と QUIZ_ITEMS から作ったもので、
   列名（col）と選択肢の文言が survey.js と一致している必要があります。
   ===================================================================== */

var SUMMARY_SHEET_NAME = '集計';
// 複数選択の回答は「A / B / C」のように ' / ' 区切りで1セルに入る
var MULTI_SEPARATOR = ' / ';

var SUMMARY_QUESTIONS = [
  { col: '職種', multi: false, options: [
    '看護師',
    '准看護師',
    '助産師',
    '保健師',
    '看護教員・研究者',
    '看護学生',
    'その他の医療職',
    'その他',
  ] },
  { col: '勤務先', multi: false, options: [
    '病院（急性期）',
    '病院（回復期・慢性期・療養）',
    '診療所・クリニック',
    '訪問看護ステーション',
    '介護施設',
    '教育・研究機関',
    'その他',
  ] },
  { col: '担当領域', multi: true, options: [
    'がん・緩和ケア',
    '整形外科・リハビリ',
    '産科・婦人科',
    '小児',
    '高齢者・認知症',
    '慢性疾患',
    '精神科',
    '在宅',
    'その他',
  ] },
  { col: '鍼の経験', multi: false, options: [
    '今日が初めて',
    '以前に受けたことがある',
    'わからない',
  ] },
  { col: '満足度', multi: false, options: [
    'とても満足',
    '満足',
    'ふつう',
    'やや不満',
    '不満',
  ] },
  { col: '印象の変化', multi: false, options: [
    'よい方向に大きく変わった',
    '少しよくなった',
    'もともとよい印象で変わらない',
    '変わらない',
    '悪くなった',
  ] },
  { col: '相談できそうな場面', multi: true, options: [
    '慢性の腰痛',
    '五十肩',
    '首・肩・腕の痛みやしびれ',
    '坐骨神経痛・肋間神経痛などの神経痛',
    '関節リウマチの痛み',
    'むちうちの後遺症',
    '肩こり・首こり',
    '頭痛',
    'ひざの痛み',
    '便秘・食欲不振などの胃腸の不調',
    '眠れない・気持ちが休まらない',
    '冷え・むくみ（リンパ浮腫を除く）',
    '妊娠中のつわり・逆子',
    '月経のトラブル・更年期の不調',
    'がん治療中・治療後のだるさやしびれ',
    '高齢の方の痛み・フレイル予防',
    'こどもの夜泣き・疳の虫（刺さない小児はり）',
    '夜勤明けや立ち仕事の疲れ（スタッフご自身）',
  ] },
  { col: '紹介の経験', multi: false, options: [
    '紹介したことがある',
    '話題になったことはある',
    'ない',
  ] },
  { col: '紹介の意向', multi: false, options: [
    '紹介してみたい',
    '症状や状況によっては紹介したい',
    'わからない',
    '紹介することはなさそう',
  ] },
  { col: '紹介のハードル', multi: true, options: [
    'どんな症状に対応できるか、よくわからない',
    '効果の根拠（エビデンス）を説明しにくい',
    '安全性・衛生面・副作用が気になる',
    '保険の使い方や同意書の手続きがわかりにくい',
    'どこの鍼灸院を紹介すればよいかわからない',
    '医師の理解・同意が得にくい',
    '費用の負担が気になる',
    '患者さん・ご家族の抵抗感',
    '職場のルール上、紹介しにくい',
    '特にない',
  ] },
  { col: 'あれば説明しやすいもの', multi: true, options: [
    '症状別の適応がひと目でわかる早見表',
    '保険（療養費）と医師の同意書の流れをまとめた資料',
    '患者さんにそのまま渡せるリーフレット',
    '地域ごとの紹介先（施術所）の一覧',
    '研究・エビデンスの要約',
    '安全管理（使い捨て鍼・衛生管理）の説明資料',
    '料金の目安',
    '実際の紹介事例・症例報告',
    '鍼灸師に気軽に相談できる窓口',
  ] },
  { col: '自分で受けたいか', multi: false, options: [
    '受けてみたい',
    '不調が出たときに考えたい',
    'わからない',
    '受けたいとは思わない',
  ] },
  { col: '提携施術所の認知', multi: false, options: [
    '知っていて、利用したことがある',
    '知っていたが利用したことはない',
    '知らなかった',
    '看護協会の会員ではない',
  ] },
  { col: '連携に必要な取り組み', multi: true, options: [
    '院内・地域での勉強会や研修',
    '病棟や外来への資料の配布',
    '紹介状・情報提供書の共通書式',
    '鍼灸師と看護職の情報交換会',
    '共同での研究・症例報告',
    '今回のような体験会の継続',
  ] },
];

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('アンケート集計')
    .addItem('集計とグラフを作り直す', 'buildSummary')
    .addToUi();
}

function buildSummary() {
  var answers = getSheet_();
  // 数式がシート名で参照するので、回答シートの名前をそろえておく
  if (answers.getName() !== SHEET_NAME) answers.setName(SHEET_NAME);
  var book = answers.getParent();
  var headers = getHeaders_(answers);

  var sheet = book.getSheetByName(SUMMARY_SHEET_NAME) || book.insertSheet(SUMMARY_SHEET_NAME);
  sheet.getCharts().forEach(function (chart) { sheet.removeChart(chart); });
  sheet.clear();
  sheet.setColumnWidth(1, 330);
  sheet.setColumnWidths(2, 2, 70);

  var ref = "'" + SHEET_NAME + "'!";
  sheet.getRange('A1:B1').setValues([['回答数', '']]).setFontWeight('bold');
  sheet.getRange('B1').setFormula('=COUNTA(' + ref + 'A2:A)');
  var countCol = headers.indexOf('相談できそうな場面（選んだ数）');
  if (countCol !== -1) {
    var letter = columnLetter_(countCol + 1);
    sheet.getRange('A2').setValue('相談できそうな場面の平均（' + quizTotal_() + '項目中）');
    sheet.getRange('B2').setFormula('=IFERROR(ROUND(AVERAGE(' + ref + letter + '2:' + letter + '),1),"")');
  }

  var row = 4;
  var missing = [];
  SUMMARY_QUESTIONS.forEach(function (item) {
    var index = headers.indexOf(item.col);
    if (index === -1) {
      missing.push(item.col);
      return;
    }
    var letter = columnLetter_(index + 1);
    var range = ref + letter + '2:' + letter;
    var n = item.options.length;

    sheet.getRange(row, 1, 1, 3)
      .setValues([[item.col + (item.multi ? '（複数回答）' : ''), '件数', '割合']])
      .setFontWeight('bold')
      .setBackground('#eef5f0');
    var start = row + 1;
    var formulas = item.options.map(function (option, i) {
      var cell = 'A' + (start + i);
      var count = item.multi ? multiCountFormula_(range, cell) : '=COUNTIF(' + range + ',' + cell + ')';
      // 割合は回答者数に対する割合（複数回答は合計が100%を超える）
      return [option, count, '=IF($B$1=0,0,B' + (start + i) + '/$B$1)'];
    });
    sheet.getRange(start, 1, n, 1).setValues(formulas.map(function (f) { return [f[0]]; }));
    sheet.getRange(start, 2, n, 2).setFormulas(formulas.map(function (f) { return [f[1], f[2]]; }));
    sheet.getRange(start, 3, n, 1).setNumberFormat('0%');

    var height = Math.max(180, 30 * n + 70);
    var chart = sheet.newChart()
      .setChartType(Charts.ChartType.BAR)
      .addRange(sheet.getRange(start, 1, n, 2))
      .setPosition(row, 5, 0, 0)
      .setOption('title', item.col + (item.multi ? '（複数回答）' : ''))
      .setOption('legend', { position: 'none' })
      .setOption('width', 620)
      .setOption('height', height)
      .setOption('hAxis', { minValue: 0, format: '0' })
      .setOption('colors', ['#2b8264'])
      .build();
    sheet.insertChart(chart);

    // 表とグラフの高い方の分だけ下げて、次の設問を置く（既定の行の高さは21px）
    row = start + Math.max(n, Math.ceil(height / 21)) + 2;
  });

  sheet.setFrozenRows(2);
  if (missing.length) {
    sheet.getRange(row, 1).setValue('回答シートに列が見つからなかった設問：' + missing.join('、'));
  }
  return '集計を作りました（設問 ' + (SUMMARY_QUESTIONS.length - missing.length) + ' 件）';
}

// 「A / B」形式のセルで、選択肢がちょうど1項目として含まれる回答の数
// 前方一致・後方一致・途中・単独の4通りを足すので、「その他」と「その他の医療職」のような
// 部分一致は数えない
function multiCountFormula_(range, cell) {
  var s = '"' + MULTI_SEPARATOR + '"';
  return '=COUNTIF(' + range + ',' + cell + ')'
    + '+COUNTIF(' + range + ',' + cell + '&' + s + '&"*")'
    + '+COUNTIF(' + range + ',"*"&' + s + '&' + cell + ')'
    + '+COUNTIF(' + range + ',"*"&' + s + '&' + cell + '&' + s + '&"*")';
}

function quizTotal_() {
  for (var i = 0; i < SUMMARY_QUESTIONS.length; i++) {
    if (SUMMARY_QUESTIONS[i].col === '相談できそうな場面') return SUMMARY_QUESTIONS[i].options.length;
  }
  return '';
}

function columnLetter_(n) {
  var s = '';
  while (n > 0) {
    var m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}
