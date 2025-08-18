import Table from "./base/table.js"

const TABLE_NAME = 'box_tarrifs'
const COLUMNS = {
    id: `${TABLE_NAME}.id`,
    tariff_date: `${TABLE_NAME}.tariff_date`,
    warehouse_name: `${TABLE_NAME}.warehouse_name`,
    geo_name: `${TABLE_NAME}.geo_name`,
    box_delivery_base: `${TABLE_NAME}.box_delivery_base`,
    box_delivery_liter: `${TABLE_NAME}.box_delivery_liter`,
    box_delivery_coef_expr: `${TABLE_NAME}.box_delivery_coef_expr`,
    box_delivery_and_storage_expr: `${TABLE_NAME}.box_delivery_and_storage_expr`,
    box_delivery_marketplace_base: `${TABLE_NAME}.box_delivery_marketplace_base`,
    box_delivery_marketplace_liter: `${TABLE_NAME}.box_delivery_marketplace_liter`,
    box_delivery_marketplace_coef_expr: `${TABLE_NAME}.box_delivery_marketplace_coef_expr`,
    box_storage_base: `${TABLE_NAME}.box_storage_base`,
    box_storage_liter: `${TABLE_NAME}.box_storage_liter`,
    box_storage_coef_expr: `${TABLE_NAME}.box_storage_coef_expr`,
    created_at: `${TABLE_NAME}.created_at`,
    updated_at: `${TABLE_NAME}.updated_at`
}

class BoxTarrifs extends Table {
    constructor() {
        super(TABLE_NAME, COLUMNS)
    }
}

const BoxTarrifsTable = new BoxTarrifs()

export default BoxTarrifsTable