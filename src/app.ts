import '#config/env/env.js'
import '#crons/index.js'

// update data with google sheet for test at start
import GoogleSheetService from '#modules/googleSheet/googleSheet.service.js'
import WbService from '#modules/wb/wb.service.js'

WbService.updateBoxTarrifs()
GoogleSheetService.udpateTarrifsTable()