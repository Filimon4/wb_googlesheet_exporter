import { google } from 'googleapis'
import type { GoogleAuth } from 'google-auth-library'
import env from '#config/env/env.js'
import path from 'path'
import { EGoogleSheets } from '#config/google/config.js'

class GoogleLib {
    private static cachedAuth: GoogleAuth | null = null

    static makeAuth(): GoogleAuth {
        if (GoogleLib.cachedAuth) {
            return GoogleLib.cachedAuth
        }

        const newAuth = new google.auth.GoogleAuth({
            keyFile: env.GOOGLE_KEY_JSON_PATH,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        })

        GoogleLib.cachedAuth = newAuth
        return newAuth
    }

    static initSheet(auth: GoogleAuth) {
        return google.sheets({
            version: 'v4',
            auth: auth,
        });
    }

    static async writeSheet() {
        const auth = GoogleLib.makeAuth()
        const sheet = GoogleLib.initSheet(auth)
        const sheetId = env.GOOGLE_SHEET_ID

        try {
            const response = await sheet.spreadsheets.values.update({
                spreadsheetId: sheetId,
                range: 'A1',
                valueInputOption: 'RAW',
                requestBody: {
                    values: [['Hello', 'World']],
                }
            })
            console.log('writeSheet: ', JSON.stringify(response.data));
            return response.data
        } catch (err) {
            console.error('Error writing to sheet:', err);
            throw err
        }
    }

    static async appendData(sheetName: EGoogleSheets, values: any[][], valueInputOption: 'RAW' | 'USER_ENTERED' = 'RAW') {
        const auth = GoogleLib.makeAuth()
        const sheet = GoogleLib.initSheet(auth)
        const sheetId = env.GOOGLE_SHEET_ID

        const response = await sheet.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: `${sheetName}!A2`,
            valueInputOption,
            requestBody: { values },
        }, (err, res) => {
            if (err) {
                console.error('Error appending data:', err);
                throw err;
            }
            console.log('Data appended:', res);
        });
        console.log(`Appended data to ${sheetId} at range `);
    }

    static async createSheet(sheetName: EGoogleSheets) {
        const auth = GoogleLib.makeAuth()
        const sheet = GoogleLib.initSheet(auth)
        const sheetId = env.GOOGLE_SHEET_ID

        if (!sheetName) throw new Error('Sheet name is missing');

        const response = await sheet.spreadsheets.batchUpdate({
            spreadsheetId: sheetId,
            requestBody: {
            requests: [
                {
                addSheet: {
                    properties: {
                    title: sheetName,
                    },
                },
                },
            ],
            },
        }, (err, res) => {
            if (err) {
            console.error('Error creating sheet:', err);
            throw err;
            }
            console.log('Sheet created:', res);
        });
    }

    static async createTable(sheetName: EGoogleSheets, headers: string[]): Promise<void> {
        const auth = GoogleLib.makeAuth()
        const sheet = GoogleLib.initSheet(auth)
        const sheetId = env.GOOGLE_SHEET_ID

        const range = `${sheetName}!A1:${String.fromCharCode(65 + headers.length - 1)}1`;
        await sheet.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [headers] },
        }, (err, res) => {
            if (err) {
                console.error('Error creating table:', err);
                throw err;
            }
        });
    }

    static async isSheetExist(sheetName: EGoogleSheets): Promise<boolean> {
        const auth = GoogleLib.makeAuth()
        const sheet = GoogleLib.initSheet(auth)
        const sheetId = env.GOOGLE_SHEET_ID

        const response = await sheet.spreadsheets.get({ spreadsheetId: sheetId });
        const sheetExist = response.data.sheets?.find((s) => s.properties?.title === sheetName)?.properties;
        return !!sheetExist;
    }

    static async getSheetData(sheetName: EGoogleSheets) {
        const auth = GoogleLib.makeAuth()
        const sheet = GoogleLib.initSheet(auth)
        const sheetId = env.GOOGLE_SHEET_ID

        const response = await sheet.spreadsheets.get({ spreadsheetId: sheetId });
        return response.data.sheets?.find((s) => s.properties?.title === sheetName)?.properties;
    }

    static async tableHeadersExist(sheetName: EGoogleSheets, expectedHeaders: string[]): Promise<boolean> {
        const auth = GoogleLib.makeAuth()
        const sheet = GoogleLib.initSheet(auth)
        const sheetId = env.GOOGLE_SHEET_ID

        const range = `${sheetName}!A1:${String.fromCharCode(65 + expectedHeaders.length - 1)}1`;
        const response = await sheet.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range,
        });
        const headers = response.data.values?.[0] || [];
        return headers.length === expectedHeaders.length && headers.every((header, index) => header === expectedHeaders[index]);
    }

    static async clearTable(sheetName: EGoogleSheets) {
        const auth = GoogleLib.makeAuth()
        const sheet = GoogleLib.initSheet(auth)
        const sheetId = env.GOOGLE_SHEET_ID

        const sheetData = await this.getSheetData(sheetName)
        const rowCount = sheetData?.gridProperties?.rowCount || 1000;

        const clearRange = `${sheetName}!A2:Z2${rowCount}`;
        await sheet.spreadsheets.values.clear({
            spreadsheetId: sheetId,
            range: clearRange,
        });
        console.log(`Cleared data in ${sheetId} at ${clearRange}`);
    }

}

export default GoogleLib
