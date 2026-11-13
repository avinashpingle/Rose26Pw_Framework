import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

/**
 * ExcelUtil - helper functions to read Excel data in a Playwright + TypeScript framework.
 *
 * Setup:  npm install xlsx
 *
 * Conventions:
 *  - Row and column numbers are 1-based, same as what you see in Excel (A1 = row 1, col 1).
 *  - Empty cells come back as "" (empty string) so arrays never have holes.
 *  - Values are returned as displayed in Excel (strings). Convert with Number() where needed.
 *  - If sheetName is not passed, the first sheet of the workbook is used.
 */

function getSheet(filePath: string, sheetName?: string): XLSX.WorkSheet {
    const fullPath = path.resolve(filePath);
    if (!fs.existsSync(fullPath)) {
        throw new Error(`Excel file not found: ${fullPath}`);
    }
    const workbook = XLSX.readFile(fullPath);
    const name = sheetName ?? workbook.SheetNames[0];
    const sheet = workbook.Sheets[name];
    if (!sheet) {
        throw new Error(`Sheet "${name}" not found. Available sheets: ${workbook.SheetNames.join(', ')}`);
    }
    return sheet;
}

// Whole sheet as a 2D array: rows[rowIndex][colIndex]
function getSheetRows(filePath: string, sheetName?: string): any[][] {
    const sheet = getSheet(filePath, sheetName);
    return XLSX.utils.sheet_to_json<any[]>(sheet, {
        header: 1,      // array of arrays
        defval: '',     // empty cells -> ""
        raw: false,     // return values as formatted text (dates, numbers as shown in Excel)
        blankrows: false,
    });
}

// ---------- 1. loadEntireExcel ----------

/**
 * Loads the entire sheet into a Map.
 * Key   = value of the first column
 * Value = array of the remaining columns of that row
 *
 * Example sheet:
 *   TC001 | admin | admin123 | Dashboard
 *   TC002 | john  | pass@1   | Invalid credentials
 * Result: Map { 'TC001' => ['admin','admin123','Dashboard'], 'TC002' => [...] }
 *
 * @param skipHeader  pass true if row 1 is a header row and should not be in the Map
 */
export function loadEntireExcel(filePath: string, sheetName?: string, skipHeader: boolean = false): Map<string, string[]> {
    const rows = getSheetRows(filePath, sheetName);
    const dataMap = new Map<string, string[]>();

    const startIndex = skipHeader ? 1 : 0;
    for (let i = startIndex; i < rows.length; i++) {
        const [key, ...rest] = rows[i];
        dataMap.set(String(key), rest.map(String));
    }
    return dataMap;
}

// ---------- 2. readRow ----------

/**
 * Returns all the values present in the given row (1-based, like Excel).
 */
export function readRow(filePath: string, sheetName: string, rowNum: number): string[] {
    const rows = getSheetRows(filePath, sheetName);
    if (rowNum < 1 || rowNum > rows.length) {
        throw new Error(`Row ${rowNum} is out of range. Sheet "${sheetName}" has ${rows.length} non-empty rows.`);
    }
    return rows[rowNum - 1].map(String);
}

// ---------- extra utilities ----------

/** Returns all sheet names of the workbook. */
export function getSheetNames(filePath: string): string[] {
    return XLSX.readFile(path.resolve(filePath)).SheetNames;
}

/** Returns number of non-empty rows (header included). */
export function getRowCount(filePath: string, sheetName?: string): number {
    return getSheetRows(filePath, sheetName).length;
}

/** Returns the value of a single cell. colNum is 1-based. */
export function readCell(filePath: string, sheetName: string, rowNum: number, colNum: number): string {
    const row = readRow(filePath, sheetName, rowNum);
    return colNum >= 1 && colNum <= row.length ? row[colNum - 1] : '';
}

/** Returns all values of a column. Pass a column number (1-based) or a letter like "B". */
export function readColumn(filePath: string, sheetName: string, column: number | string, skipHeader: boolean = false): string[] {
    const colIndex = typeof column === 'number' ? column - 1 : XLSX.utils.decode_col(column.toUpperCase());
    const rows = getSheetRows(filePath, sheetName);
    return rows.slice(skipHeader ? 1 : 0).map(r => String(r[colIndex] ?? ''));
}

/**
 * Reads the sheet as an array of objects using row 1 as keys.
 * Best for data-driven tests:
 *   const users = readSheetAsObjects('data/login.xlsx', 'Login');
 *   for (const u of users) { test(`login ${u.username}`, ...) }
 */
export function readSheetAsObjects(filePath: string, sheetName?: string): Record<string, string>[] {
    const rows = getSheetRows(filePath, sheetName);
    if (rows.length < 2) return [];
    const headers = rows[0].map(h => String(h).trim());
    return rows.slice(1).map(row => {
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => (obj[h] = String(row[i] ?? '')));
        return obj;
    });
}

/**
 * Finds a row by the value in its first column (e.g. test case ID) and returns it
 * as an object keyed by the header row. Returns undefined if not found.
 *   const data = getRowByKey('data/login.xlsx', 'Login', 'TC002');
 *   await page.fill('#user', data!.username);
 */
export function getRowByKey(filePath: string, sheetName: string, key: string): Record<string, string> | undefined {
    const rows = getSheetRows(filePath, sheetName);
    if (rows.length < 2) return undefined;
    const headers = rows[0].map(h => String(h).trim());
    const found = rows.slice(1).find(r => String(r[0]).trim() === key.trim());
    if (!found) return undefined;
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => (obj[h] = String(found[i] ?? '')));
    return obj;
}

/**
 * Returns the row number (1-based) where the first column matches the key, or -1 if not found.
 * Handy together with readRow / readCell / writeCell.
 */
export function findRowNumber(filePath: string, sheetName: string, key: string): number {
    const rows = getSheetRows(filePath, sheetName);
    const index = rows.findIndex(r => String(r[0]).trim() === key.trim());
    return index === -1 ? -1 : index + 1;
}

/** Returns only the rows where the given column (header name) equals the value. e.g. Run = "Yes" */
export function filterRows(filePath: string, sheetName: string, columnHeader: string, value: string): Record<string, string>[] {
    return readSheetAsObjects(filePath, sheetName).filter(
        r => (r[columnHeader] ?? '').trim().toLowerCase() === value.trim().toLowerCase()
    );
}

/**
 * Writes a value into a cell (1-based row/col) and saves the file.
 * Useful for writing back test results (Pass/Fail) or generated data.
 * Note: close the file in Excel before writing, otherwise the save will fail.
 */
export function writeCell(filePath: string, sheetName: string, rowNum: number, colNum: number, value: string | number): void {
    const fullPath = path.resolve(filePath);
    const workbook = XLSX.readFile(fullPath);
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
        throw new Error(`Sheet "${sheetName}" not found. Available sheets: ${workbook.SheetNames.join(', ')}`);
    }

    const cellRef = XLSX.utils.encode_cell({ r: rowNum - 1, c: colNum - 1 });
    sheet[cellRef] = { t: typeof value === 'number' ? 'n' : 's', v: value };

    // expand the sheet range if we wrote outside the existing one
    const range = XLSX.utils.decode_range(sheet['!ref'] ?? 'A1:A1');
    range.e.r = Math.max(range.e.r, rowNum - 1);
    range.e.c = Math.max(range.e.c, colNum - 1);
    sheet['!ref'] = XLSX.utils.encode_range(range);

    XLSX.writeFile(workbook, fullPath);
}