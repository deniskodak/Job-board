import { connection } from '../db/connection.js';

/**
 * SQLite3 table schema
 */
const { schema } = connection;

/**
 * Deletes existed tables with all data
 */
await schema.dropTableIfExists('user');
await schema.dropTableIfExists('job');
await schema.dropTableIfExists('company');

/**
 * Creates empty Company table
 */
await schema.createTable('company', (table) => {
  table.text('id').notNullable().primary();
  table.text('name').notNullable();
  table.text('description');
});

/**
 * Creates empty Job table
 */
await schema.createTable('job', (table) => {
  table.text('id').notNullable().primary();
  table.text('companyId').notNullable()
    .references('id').inTable('company');
  table.text('title').notNullable();
  table.text('description');
  table.text('createdAt').notNullable();
});

/**
 * Creates empty User table
 */
await schema.createTable('user', (table) => {
  table.text('id').notNullable().primary();
  table.text('companyId').notNullable()
    .references('id').inTable('company');
  table.text('email').notNullable().unique();
  table.text('password').notNullable();
});

/**
 * Populate Company table with mock data
 */
await connection.table('company').insert([
  {
    id: 'FjcJCHJALA4i',
    name: 'Facegle',
    description: 'We are a startup on a mission to disrupt social search engines. Think Facebook meet Google.',
  },
  {
    id: 'Gu7QW9LcnF5d',
    name: 'Goobook',
    description: 'We are a startup on a mission to disrupt search social media. Think Google meet Facebook.',
  },
]);

/**
 * Populate Job table with mock data
 */
await connection.table('job').insert([
  {
    id: 'f3YzmnBZpK0o',
    companyId: 'FjcJCHJALA4i',
    title: 'Frontend Developer',
    description: 'We are looking for a Frontend Developer familiar with React.',
    createdAt: '2023-01-26T11:00:00.000Z',
  },
  {
    id: 'XYZNJMXFax6n',
    companyId: 'FjcJCHJALA4i',
    title: 'Backend Developer',
    description: 'We are looking for a Backend Developer familiar with Node.js and Express.',
    createdAt: '2023-01-27T11:00:00.000Z',
  },
  {
    id: '6mA05AZxvS1R',
    companyId: 'Gu7QW9LcnF5d',
    title: 'Full-Stack Developer',
    description: 'We are looking for a Full-Stack Developer familiar with Node.js, Express, and React.',
    createdAt: '2023-01-30T11:00:00.000Z',
  },
]);

/**
 * Populate User table with mock data
 */
await connection.table('user').insert([
  {
    id: 'AcMJpL7b413Z',
    companyId: 'FjcJCHJALA4i',
    email: 'alice@facegle.io',
    password: 'alice123',
  },
  {
    id: 'BvBNW636Z89L',
    companyId: 'Gu7QW9LcnF5d',
    email: 'bob@goobook.co',
    password: 'bob123',
  },
]);

process.exit();
