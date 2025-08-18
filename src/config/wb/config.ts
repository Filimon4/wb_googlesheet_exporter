import { z } from "zod";

export const wbConfigApi = {
    baseURL: 'https://common-api.wildberries.ru/api',
    api: {
        boxOffer: {
            endpoint: 'v1/tariffs/box',
            responseType: z.object({
                dtNextBox: z.string(),
                dtTillMax: z.string(),
                warehouseList: z.array(
                    z.object({
                        boxDeliveryAndStorageExpr: z.string().nullable(),
                        boxDeliveryBase: z.string(),
                        boxDeliveryCoefExpr: z.string(),
                        boxDeliveryLiter: z.string(),
                        boxDeliveryMarketplaceBase: z.string(),
                        boxDeliveryMarketplaceCoefExpr: z.string(),
                        boxDeliveryMarketplaceLiter: z.string(),
                        boxStorageBase: z.string(),
                        boxStorageCoefExpr: z.string(),
                        boxStorageLiter: z.string(),
                        geoName: z.string(),
                        warehouseName: z.string(),
                    })
                ).nullable(),
            }),
        },
    }
}

export type TWbApi = keyof typeof wbConfigApi['api']
export type TWbApiResponse<T extends TWbApi> = z.infer<(typeof wbConfigApi['api'][T]['responseType'])>
