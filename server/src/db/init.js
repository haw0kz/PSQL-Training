const db = require('../db/index');
const fs = require('fs').promises;
const path = require('path');
db.$config.debug = true;


async function createTables() {
    try {
        const tablesExist = await areTablesExist();

        if (tablesExist) {
            console.log('Таблицы уже существуют');
            return;
        }

        const createTablesScriptPath = path.join(__dirname, 'courses.sql');
        const createTablesScript = await fs.readFile(createTablesScriptPath, 'utf8');

        await db.none(createTablesScript);

        console.log('Таблицы успешно созданы');
    } catch (error) {
        console.error('Ошибка при создании таблиц:', error);
    } finally {
        // db.$pool.end();
    }
}

async function areTablesExist() {
    try {
        const checkTablesQuery = `
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public';
        `;

        const existingTables = await db.any(checkTablesQuery);

        return existingTables.length > 0;
    } catch (error) {
        console.error('Ошибка при проверке наличия таблиц:', error);
        return false;
    }
}


module.exports = createTables;
