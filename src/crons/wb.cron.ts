import cron from 'node-cron'
import WbService from '#modules/wb/wb.service.js'
import GoogleSheetService from '#modules/googleSheet/googleSheet.service.js'

cron.schedule('0 0 * * * *', () => {
    WbService.updateBoxTarrifs()
    GoogleSheetService.udpateTarrifsTable()
})