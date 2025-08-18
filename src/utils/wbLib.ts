import { TWbApi, wbConfigApi } from "#config/wb/config.js";
import env from '#config/env/env.js'
import moment from "moment";

class WbLib {
    static async fetchWb(url: TWbApi) {
        try {
            const apiConfig = wbConfigApi.api[url]
            if (!apiConfig) throw new Error(`API config not found for ${url}`)
    
            const queryParams = new URLSearchParams({
                date: moment().format('YYYY-MM-DD')
            });
    
            const responseFetch = await fetch(`${wbConfigApi.baseURL}/${apiConfig.endpoint}?${queryParams}`, {
                headers: {
                    Authorization: `Bearer ${env.WB_API_KEY}`,
                },
            });
    
            const dataJSON = await responseFetch.json();
            const data = dataJSON?.response?.data
    
            const parseData = await apiConfig.responseType.parseAsync(data)
    
            return parseData;
        } catch (error) {
            console.error('Error fetching data: ', error);
            return null
        }
    }
}

export default WbLib
