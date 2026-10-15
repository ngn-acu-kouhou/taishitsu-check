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
 * ※ 設問を増やしても、このスクリプトを直す必要はありません。
 *    新しい項目は自動で右端の列に追加されます。
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
