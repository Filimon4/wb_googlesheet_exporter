import { googleSheetConfig, EGoogleSheets } from "#config/google/config.js";
import GoogleLib from "#utils/googleLib.js"
import GoogleSheetRepository from "./googleSheet.repository.js"

class GoogleSheetService {

    private static async checkTable(sheetName: EGoogleSheets) {
        try {
            const isExist = await GoogleLib.isSheetExist(sheetName)
            if (!isExist) {
                GoogleLib.createSheet(sheetName);
                GoogleLib.createTable(sheetName, googleSheetConfig.tables[sheetName].headers);
                return true
            }
            const isHeadersExist = await GoogleLib.tableHeadersExist(sheetName, googleSheetConfig.tables[sheetName].headers)
            if (!isHeadersExist) {
                GoogleLib.createTable(sheetName, googleSheetConfig.tables[sheetName].headers);
                return true
            }
            return true
        } catch (error) {
            return false
        }
    }

    static async udpateTarrifsTable() {
        const checkTable = await this.checkTable(EGoogleSheets.stocksCoefs)
        if (!checkTable) return false

        const clearTable = await GoogleLib.clearTable(EGoogleSheets.stocksCoefs)

        const tarrifs = await GoogleSheetRepository.getTarrifs()
        await GoogleLib.appendData(EGoogleSheets.stocksCoefs, [...tarrifs.list.map((data) => Object.values(data))])
        
        if (tarrifs.maxPage > 1) {
            for (let i = 2; i <= tarrifs.maxPage; i++) {
                const tarrifs = await GoogleSheetRepository.getTarrifs(i)
                await GoogleLib.appendData(EGoogleSheets.stocksCoefs, [...tarrifs.list.map((data) => Object.values(data))])
            }
        }
    }

}

export default GoogleSheetService
