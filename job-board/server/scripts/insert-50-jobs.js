import { connection } from '../db/connection.js';

const INTERVAL = 4 * 60 * 60 * 1000; // 4h
const START_TIME = new Date('2023-01-31T09:00:00.000Z').getTime();

/**
 * Deletes all data in Job table
 */
await connection.table('job').truncate();

/**
 * Gets all company ids from Company table
 */
const companyIds = await connection.table('company').pluck('id');

/**
 * Generates mock Jobs based on company ids
 */
const jobs = [];
for (let n = 1; n <= 50; n++) {
  jobs.push({
    id: n.toString().padStart(12, '0'),
    companyId: companyIds[n % companyIds.length],
    title: `Job ${n}`,
    description: `This is the job number ${n}.`,
    createdAt: new Date(START_TIME + n * INTERVAL).toISOString(),
  });
}

/**
 * Adds generated mock Jobs into Job table
 */
await connection.table('job').insert(jobs);

process.exit();
