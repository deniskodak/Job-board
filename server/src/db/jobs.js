import { connection } from './connection.js';
import { generateId } from './ids.js';

/**
 * @returns Instance of sql Job table 
 */
const getJobTable = () => connection.table('job');

/**
 * @returns Promise with amount of all Jobs
 */
export async function getJobsCount() {
  // '* as count' means to count all rows
  const { count } = await getJobTable().first().count('* as count');
  return count
}

/**
 * Selects all Job rows in Job table and return Promise with them
 * @returns Promise with all Jobs
 */
export async function getJobs({ sort = 'desc', limit, offset }) {
  const orderedQuery = getJobTable().select().orderBy('createdAt', sort);
 
  if(offset) orderedQuery.offset(offset);
  if(limit) orderedQuery.limit(limit);
  
  return await orderedQuery;
}

/**
 * Finds first Job row, that satisfies provided id
 * @returns Promise with Job
 */
export async function getJob(id) {
  return await getJobTable().first().where({ id });
}

/**
 * Finds all Job rows, that satisfies provided Company Id
 * @returns Promise with Job
 */
export async function getJobsByCompany(companyId) {
  return await getJobTable().select().where({ companyId });
}

/**
 * Writes new Job into DB based on provided params
 * @returns Promise with Job
 */
export async function createJob({ companyId, title, description }) {
  const job = {
    id: generateId(),
    companyId,
    title,
    description,
    createdAt: new Date().toISOString(),
  };
  await getJobTable().insert(job);
  return job;
}

/**
 * Deletes Job in DB based on provided params
 * @returns Promise with deleted Job or null incase Job not found
 */
export async function deleteJob(id, companyId) {
  const job = await getJobTable().first().where({ id, companyId });
  
  if (!job) return null
  
  await getJobTable().delete().where({ id, companyId });
  return job;
}

/**
 * Updates Job in DB based on provided params
 * @returns Promise with updated Job or null incase Job not found
 */
export async function updateJob({ id, title, description, companyId }) {
  const job = await getJobTable().first().where({ id, companyId });

  if (!job) return null;
  
  const updatedFields = { title, description };
  await getJobTable().update(updatedFields).where({ id, companyId });
  return { ...job, ...updatedFields };
}
