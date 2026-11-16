/**
 * PSV Hub Lottery Submit
 * Receives form POST from hub, saves copies, updates deposit log and tracker.
 * 
 * CONFIG below for Store 4. Change IDs for other stores later.
 */

const STORE = {
  id: '4',
  name: '4 Juniata',
  storeLotteryFolder: '15-og75RukeF8boDgZm_0oTmdbbwJ7pXU',
  officeLotteryFolder: '1F9_BHGtnxyWqyAjlRwo1mWkA8oqnHNrX',
  depositLogId: '179Zyu3DJcEmaSyq1BsCI-Ruquh7qGYYnr9iVRfsN3-I',
  pastLotteryFolder: '1AfzcCsYq5Xx-gkdIewGbiNstb8DmkFJx'
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const result = processLotterySubmit(data);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function processLotterySubmit(data) {
  const today = new Date();
  const dateStr = Utilities.formatDate(today, 'America/New_York', 'MM-dd-yyyy');
  const fileName = STORE.name + ' - Daily Instant ' + dateStr;

  // 1. Create a new spreadsheet as the dated copy
  const ss = SpreadsheetApp.create(fileName);
  const sheet = ss.getActiveSheet();
  sheet.setName('Daily');

  // Write header
  sheet.getRange('A1').setValue(STORE.name + ' Daily Instant Ticket');
  sheet.getRange('A2').setValue('Date');
  sheet.getRange('B2').setValue(dateStr);

  // Write activity
  sheet.getRange('A4').setValue('Instant Sold');
  sheet.getRange('B4').setValue(data.instSold || 0);
  sheet.getRange('A5').setValue('Instant Paid');
  sheet.getRange('B5').setValue(data.instPaid || 0);
  sheet.getRange('A6').setValue('Online Sold');
  sheet.getRange('B6').setValue(data.onlineSold || 0);
  sheet.getRange('A7').setValue('Online Pay');
  sheet.getRange('B7').setValue(data.onlinePay || 0);
  sheet.getRange('A8').setValue('Credit Cards');
  sheet.getRange('B8').setValue(data.cc || 0);
  sheet.getRange('A9').setValue('Vouchers');
  sheet.getRange('B9').setValue(data.vouchers || 0);
  sheet.getRange('A10').setValue('Pay In');
  sheet.getRange('B10').setValue(data.payIn || 0);
  sheet.getRange('C10').setValue(data.payInSource || '');
  sheet.getRange('A11').setValue('Pay Out');
  sheet.getRange('B11').setValue(data.payOut || 0);
  sheet.getRange('C11').setValue(data.payOutSource || '');

  // Ticket rows
  sheet.getRange('A13').setValue('Price');
  sheet.getRange('B13').setValue('Bin');
  sheet.getRange('C13').setValue('Game/Book');
  sheet.getRange('D13').setValue('Starting');
  sheet.getRange('E13').setValue('Ending');
  sheet.getRange('F13').setValue('Pack Status');

  const tickets = data.tickets || [];
  tickets.forEach((t, i) => {
    const row = 14 + i;
    sheet.getRange(row, 1).setValue(t.price || '');
    sheet.getRange(row, 2).setValue(t.bin || '');
    sheet.getRange(row, 3).setValue(t.game || '');
    sheet.getRange(row, 4).setValue(t.start || '');
    sheet.getRange(row, 5).setValue(t.end || '');
    sheet.getRange(row, 6).setValue(t.status || '');
  });

  // Move to store past folder and copy to office
  const file = DriveApp.getFileById(ss.getId());
  const storePast = DriveApp.getFolderById(STORE.pastLotteryFolder);
  const officeFolder = DriveApp.getFolderById(STORE.officeLotteryFolder);

  file.moveTo(storePast);
  file.makeCopy(fileName, officeFolder);

  // Update deposit log
  updateDepositLog(data, dateStr);

  return { ok: true, fileName: fileName };
}

function updateDepositLog(data, dateStr) {
  try {
    const log = SpreadsheetApp.openById(STORE.depositLogId);
    const sheet = log.getSheets()[0];
    const nextRow = sheet.getLastRow() + 1;

    sheet.getRange(nextRow, 1).setValue(dateStr);
    sheet.getRange(nextRow, 2).setValue(data.instSold || 0);
    sheet.getRange(nextRow, 3).setValue(data.instPaid || 0);
    sheet.getRange(nextRow, 4).setValue(data.onlineSold || 0);
    sheet.getRange(nextRow, 5).setValue(data.onlinePay || 0);
    sheet.getRange(nextRow, 6).setValue(data.payIn || 0);
    sheet.getRange(nextRow, 7).setValue(data.payOut || 0);

    const instNet = (parseFloat(data.instSold) || 0) - (parseFloat(data.instPaid) || 0);
    const onlineNet = (parseFloat(data.onlineSold) || 0) - Math.abs(parseFloat(data.onlinePay) || 0);
    const net = instNet + onlineNet - Math.abs(parseFloat(data.cc) || 0) + (parseFloat(data.payIn) || 0) - Math.abs(parseFloat(data.payOut) || 0);
    sheet.getRange(nextRow, 8).setValue(net);
  } catch (e) {
    Logger.log('Deposit log update failed: ' + e.message);
  }
}

function doGet() {
  return ContentService.createTextOutput('PSV Lottery Submit endpoint is running.');
}
