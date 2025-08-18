import cron from 'node-cron'
import WbService from './wb.service.js'

cron.schedule('0 0 * * *', () => {
    WbService.updateBoxTarrifs()
})