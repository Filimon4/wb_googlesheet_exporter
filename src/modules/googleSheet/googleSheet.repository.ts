import knex from "#postgres/knex.js"
import BoxTarrifsTable from "#postgres/tables/box_tarrifs.js"

class GoogleSheetRepository {

    static async getTarrifs(page: number = 1, pageLimit: number = 30) {

        const data = await knex(BoxTarrifsTable.name)
            .select('*')
            .where(BoxTarrifsTable.allColumns.tariff_date, knex.raw(`${knex.fn.now()}::DATE`))
            .limit(pageLimit)
            .offset((page - 1) * pageLimit)
            .orderBy(BoxTarrifsTable.allColumns.id, 'asc')

        const countItems = +(await knex(BoxTarrifsTable.name)
            .count('* as count')
            .where(BoxTarrifsTable.allColumns.tariff_date, knex.raw(`${knex.fn.now()}::DATE`)))[0].count

        const mapPage = Math.ceil(countItems / pageLimit)

        return {
            page: page,
            list: data,
            maxPage: mapPage
        }
    }

}

export default GoogleSheetRepository
