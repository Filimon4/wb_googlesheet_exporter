import GoogleLib from "#utils/googleLib.js"
import WbApi from "#utils/wbLib.js"
import WbRepository from "./wb.repository.js"

class WbService {
    
    static async updateBoxTarrifs() {

        const apiData = await WbApi.fetchWb('boxOffer')
        
        const savedDBData = WbRepository.saveBoxTarrfis(apiData)

        return savedDBData
    }

}

export default WbService
