import knex from 'knex';

/**
 * Creates connections with DB trough better-sqlite3 library
 * @returns Interface for working with tables
 */
export const connection = knex({
  client: 'better-sqlite3',
  connection: {
    filename: './data/db.sqlite3',
  },
  useNullAsDefault: true,
});

/**
 * Logs all calls to DB
 */
connection.on('query', ({ sql, bindings }) => {
  const stringedQuery = connection.raw(sql, bindings).toQuery();
  console.log(stringedQuery)
})