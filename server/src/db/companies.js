import { connection } from './connection.js';
import DataLoader from 'dataloader';

/**
 * @returns Instance of sql Company table 
 */
const getCompanyTable = () => connection.table('company');

/**
 * Finds first Company row, that satisfies provided id
 * @returns Promise with Company row
 */
export async function getCompany(id) {
  return await getCompanyTable().first().where({ id });
}

/**
 * Create loader that finds all Company rows, that belongs to provided ids
 * @returns Promise with Company rows
 */
export const createCompanyLoader = () => {
  return new DataLoader(async (companyIds) => {
    const companies = await getCompanyTable().select().whereIn('id', companyIds)
    return companyIds.map((id) => companies.find((company) => company.id === id));
  })
}