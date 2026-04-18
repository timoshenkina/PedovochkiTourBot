// ID таблиці Google Sheets для аналітики
const SPREADSHEET_ID = '16aWPtD62vvuTkPdfx8HT5iP41F1DCcCv6PsZrcfkiRI';
const SHEET_NAME = 'analytics';

// Обробка POST запитів — запис аналітики
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);

    // Записуємо новий рядок: timestamp | user_id | session_id | action | category | place_id | place_name
    sheet.appendRow([
      new Date().toISOString(),
      data.user_id    || '',
      data.session_id || '',
      data.action     || '',
      data.category   || '',
      data.place_id   || '',
      data.place_name || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Обробка GET запитів
function doGet(e) {
  try {
    const action = e.parameter.action;

    // Перевірка з'єднання
    if (action === 'ping') {
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'ok' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Повертає всі рядки аналітики як масив об'єктів
    if (action === 'getData') {
      const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
      const rows = sheet.getDataRange().getValues();

      // Перший рядок — заголовки
      const headers = rows[0];
      const data = rows.slice(1).map(row => {
        const obj = {};
        headers.forEach((header, i) => {
          obj[header] = row[i];
        });
        return obj;
      });

      return ContentService
        .createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Запис події аналітики через GET
    if (action === 'track') {
      const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
      sheet.appendRow([
        new Date().toISOString(),
        e.parameter.user_id    || '',
        e.parameter.session_id || '',
        e.parameter.event      || '',
        e.parameter.category   || '',
        e.parameter.place_id   || '',
        e.parameter.place_name || ''
      ]);
      return ContentService
        .createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Невідома дія
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: 'Невідома дія' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
