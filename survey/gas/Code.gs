/**
 * 体験会アンケートの回答受け取り用 Google Apps Script
 *
 * 【設置手順】
 *  1. Google スプレッドシートを新規作成する（名前は自由。例：鍼灸体験会アンケート回答）
 *  2. メニューの「拡張機能 > Apps Script」を開く
 *  3. 既定のコードを全部消して、このファイルの中身を貼り付けて保存
 *  4. 右上の「デプロイ > 新しいデプロイ」→ 種類「ウェブアプリ」
 *       - 次のユーザーとして実行 : 自分
 *       - アクセスできるユーザー   : 全員
 *  5. 表示されたウェブアプリURL（.../exec で終わる）をコピーし、
 *     survey/survey.js の CONFIG.endpoint に貼り付ける
 *
 * ※ 設問を増やしても、このスクリプトを直す必要はありません。
 *    新しい項目は自動で右端の列に追加されます。
 */

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
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
  }
  return sheet;
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
