
export enum EGoogleSheets {
    stocksCoefs = "stocks_coefs",
}

export const googleSheetConfig = {
    tables: {
        [EGoogleSheets.stocksCoefs]: {
            headers: [
                "id",
                "tariff_date",
                "warehouse_name",
                "geo_name",
                "box_delivery_base",
                "box_delivery_liter",
                "box_delivery_coef_expr",
                "box_delivery_and_storage_expr",
                "box_delivery_marketplace_base",
                "box_delivery_marketplace_liter",
                "box_delivery_marketplace_coef_expr",
                "box_storage_base",
                "box_storage_liter",
                "box_storage_coef_expr",
                "crated_at",
                "modified_at"
            ]
        }
    },
}

