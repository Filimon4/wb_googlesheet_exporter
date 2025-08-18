import Table from "#postgres/tables/base/table.js";
import BoxTarrifs from "#postgres/tables/box_tarrifs.js";

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    return knex.schema.createTable(BoxTarrifs.name, (table) => {
    table.increments(Table.getColumnByRaw(BoxTarrifs.allColumns.id).column).primary();
    table.date(Table.getColumnByRaw(BoxTarrifs.allColumns.tariff_date).column).notNullable().index();
    table.string(Table.getColumnByRaw(BoxTarrifs.allColumns.warehouse_name).column).notNullable();
    table.string(Table.getColumnByRaw(BoxTarrifs.allColumns.geo_name).column).notNullable();
    table.string(Table.getColumnByRaw(BoxTarrifs.allColumns.box_delivery_base).column).notNullable();
    table.string(Table.getColumnByRaw(BoxTarrifs.allColumns.box_delivery_liter).column).notNullable();
    table.string(Table.getColumnByRaw(BoxTarrifs.allColumns.box_delivery_coef_expr).column).notNullable();
    table.string(Table.getColumnByRaw(BoxTarrifs.allColumns.box_delivery_and_storage_expr).column).notNullable();
    table.string(Table.getColumnByRaw(BoxTarrifs.allColumns.box_delivery_marketplace_base).column).notNullable();
    table.string(Table.getColumnByRaw(BoxTarrifs.allColumns.box_delivery_marketplace_liter).column).notNullable();
    table.string(Table.getColumnByRaw(BoxTarrifs.allColumns.box_delivery_marketplace_coef_expr).column).notNullable();
    table.string(Table.getColumnByRaw(BoxTarrifs.allColumns.box_storage_base).column).notNullable();
    table.string(Table.getColumnByRaw(BoxTarrifs.allColumns.box_storage_liter).column).notNullable();
    table.string(Table.getColumnByRaw(BoxTarrifs.allColumns.box_storage_coef_expr).column).notNullable();
    table.timestamps(true, true);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    return knex.schema.dropTableIfExists(BoxTarrifs.name);
}
