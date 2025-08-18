
abstract class Table {
    private table_name: string
    private columns: Record<string, string>

    constructor(table_name: string, columns: Record<string, string>) {
        this.table_name = table_name
        this.columns = columns
    }

    get name() {
        return this.table_name
    }

    get allColumns() {
        return this.columns
    }

    static getColumnByRaw(raw: string) {
        return {
            table: raw.split('.')[0],
            column: raw.split('.')[1]
        }
    }
}

export default Table
