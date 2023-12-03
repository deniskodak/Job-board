import { connection } from './connection.js';

/**
 * @returns Instance of sql Company table 
 */
const getUserTable = () => connection.table('user');

/**
 * Finds first User row, that satisfies provided user id
 * @returns Promise with User
 */
export async function getUser(id) {
  return await getUserTable().first().where({ id });
}

/**
 * Finds first User row, that satisfies provided user email
 * @returns Promise with User
 */
export async function getUserByEmail(email) {
  return await getUserTable().first().where({ email });
}
