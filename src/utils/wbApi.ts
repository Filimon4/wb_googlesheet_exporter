import { TWbApi, wbConfigApi } from "#config/wb/config.js";


class WbApi {
    static async fetchWb(url: TWbApi) {
        
        const apiConfig = wbConfigApi.api[url]
        if (!apiConfig) throw new Error(`API config not found for ${url}`)

        const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${process.env.WB_TOKEN}`,
        },
        });

        const data = await response.json();

        console.log('fetchWb: ', url, data)

        const parseData = await apiConfig.responseType.parseAsync(data)

        return parseData;
  }
}

export default WbApi
