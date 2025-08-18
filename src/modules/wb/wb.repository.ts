import { TWbApiResponse } from "#config/wb/config.js";
import knex from "#postgres/knex.js";
import BoxTarrifsTable from "#postgres/tables/box_tarrifs.js";

class WbRepository {

    static async saveBoxTarrfis(tarrfis: TWbApiResponse<'boxOffer'>) {
        try {
            
            const data = tarrfis.data.warehouseList?.map((data) => ({
                tariff_date: tarrfis.data.dtNextBox,
                warehouse_name: data.warehouseName,
                geo_name: data.geoName,
                box_delivery_base: data.boxDeliveryBase,
                box_delivery_liter: data.boxDeliveryLiter,
                box_delivery_coef_expr: data.boxDeliveryCoefExpr,
                box_delivery_and_storage_expr: data.boxDeliveryAndStorageExpr,
                box_delivery_marketplace_base: data.boxDeliveryMarketplaceBase,
                box_delivery_marketplace_liter: data.boxDeliveryMarketplaceLiter,
                box_delivery_marketplace_coef_expr: data.boxDeliveryMarketplaceCoefExpr,
                box_storage_base: data.boxStorageBase,
                box_storage_liter: data.boxStorageLiter,
                box_storage_coef_expr: data.boxStorageCoefExpr,
            }))
    
            const saveData = await knex(BoxTarrifsTable.name)
                .insert(data)
                .onConflict(['tariff_date', 'warehouse_name', 'geo_name'])
                .merge()
                .returning('id')
            console.log("saveData: ", saveData)

            return saveData
        } catch (error) {
            console.info('saveBoxTarrfis Error: ', error)
            throw error
        }
    }

}

export default WbRepository
