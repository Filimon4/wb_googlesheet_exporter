import '#config/env/env.js'
import '#crons/index.js'
import GoogleSheetService from '#modules/googleSheet/googleSheet.service.js'

// await migrate.latest();
// await seed.run();

GoogleSheetService.udpateTarrifsTable()