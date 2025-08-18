import GoogleLib from "#utils/googleLib.js"
import WbApi from "#utils/wbLib.js"
import WbRepository from "./wb.repository.js"

class WbService {
    
    static async updateBoxTarrifs() {
        try {
            const apiData = await WbApi.fetchWb('boxOffer')
            if (!apiData) return null
            
            const savedDBData = await WbRepository.saveBoxTarrfis(apiData)
    
            return savedDBData
        } catch (error) {
            console.log('Error: ', error)
        }
    }

}

export default WbService
