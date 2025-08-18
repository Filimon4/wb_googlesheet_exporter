import { google } from 'googleapis'
import type { GoogleAuth } from 'google-auth-library'
import env from '#config/env/env.js'
import path from 'path'
import { EGoogleSheets } from '#config/google/config.js'

class GoogleLib {
    private static cachedAuth: GoogleAuth | null = null

    static makeAuth(): GoogleAuth | null {
        try {
            if (GoogleLib.cachedAuth) {
                return GoogleLib.cachedAuth
            }
    
            const newAuth = new google.auth.GoogleAuth({
                keyFile: env.GOOGLE_KEY_JSON_PATH,
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            })
    
            GoogleLib.cachedAuth = newAuth
            return newAuth
        } catch (error) {
            console.log(error)
            console.warn("Please check authorization credentials")
            return null
        }
    }

    static initSheet(auth: GoogleAuth) {
        return google.sheets({
            version: 'v4',
            auth: auth,
        });
    }

    static getSetup() {
        const auth = GoogleLib.makeAuth()
        if (!auth) throw new Error('Authorization failed')
        const sheet = GoogleLib.initSheet(auth)
        const sheetId = env.GOOGLE_SHEET_ID

        return {
            auth,
            sheet,
            sheetId
        }
    }

    static async writeSheet() {
        try {
            const {auth, sheet, sheetId} = GoogleLib.getSetup()

            const response = await sheet.spreadsheets.values.update({
                spreadsheetId: sheetId,
                range: 'A1',
                valueInputOption: 'RAW',
                requestBody: {
                    values: [['Hello', 'World']],
                }
            })
            return response.data
        } catch (error) {
            console.error('Error writing to sheet:', error);
            throw error
        }
    }

    static async appendData(sheetName: EGoogleSheets, values: any[][], valueInputOption: 'RAW' | 'USER_ENTERED' = 'RAW') {
        try {
            const {auth, sheet, sheetId} = GoogleLib.getSetup()

            return await sheet.spreadsheets.values.append({
                spreadsheetId: sheetId,
                range: `${sheetName}!A2`,
                valueInputOption,
                requestBody: { values },
            });
        } catch (error) {
            console.error('Error appeding data: ', error)
            throw error
        }
    }

    static async createSheet(sheetName: EGoogleSheets) {
        try {
            const {auth, sheet, sheetId} = GoogleLib.getSetup()

            return await sheet.spreadsheets.batchUpdate({
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
            });
        } catch (error) {
            console.error('Error create sheet: ', error);
            throw error
        }
    }

    static async createTable(sheetName: EGoogleSheets, headers: string[]) {
        try {
            const {auth, sheet, sheetId} = GoogleLib.getSetup()

            const range = `${sheetName}!A1:${String.fromCharCode(65 + headers.length - 1)}1`;
            return await sheet.spreadsheets.values.update({
                spreadsheetId: sheetId,
                range,
                valueInputOption: 'USER_ENTERED',
                requestBody: { values: [headers] },
            })
        } catch (error) {
            console.error('Error create table: ', error);
            throw error
        }
    }

    static async isSheetExist(sheetName: EGoogleSheets): Promise<boolean> {
        try {
            const {auth, sheet, sheetId} = GoogleLib.getSetup()

            const response = await sheet.spreadsheets.get({ spreadsheetId: sheetId });
            const sheetExist = response.data.sheets?.find((s) => s.properties?.title === sheetName)?.properties;
            return !!sheetExist;
        } catch (error) {
            return false
        }
    }

    static async getSheetData(sheetName: EGoogleSheets) {
        try {
            const {auth, sheet, sheetId} = GoogleLib.getSetup()

            const response = await sheet.spreadsheets.get({ spreadsheetId: sheetId });
            return response.data.sheets?.find((s) => s.properties?.title === sheetName)?.properties;
        } catch (error) {
            throw error
        }
    }

    static async tableHeadersExist(sheetName: EGoogleSheets, expectedHeaders: string[]): Promise<boolean> {
        try {
            const {auth, sheet, sheetId} = GoogleLib.getSetup()

            const range = `${sheetName}!A1:${String.fromCharCode(65 + expectedHeaders.length - 1)}1`;
            const response = await sheet.spreadsheets.values.get({
                spreadsheetId: sheetId,
                range,
            });
            const headers = response.data.values?.[0] || [];
            return headers.length === expectedHeaders.length && headers.every((header, index) => header === expectedHeaders[index]);
        } catch (error) {
            throw error
        }
    }

    static async clearTable(sheetName: EGoogleSheets) {
        try {
            const {auth, sheet, sheetId} = GoogleLib.getSetup()

            const sheetData = await this.getSheetData(sheetName)
            const rowCount = sheetData?.gridProperties?.rowCount || 1000;
    
            const clearRange = `${sheetName}!A2:Z2${rowCount}`;
            return await sheet.spreadsheets.values.clear({
                spreadsheetId: sheetId,
                range: clearRange,
            });
        } catch (error) {
            throw error
        }
    }

}

export default GoogleLib
