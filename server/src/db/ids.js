import { customAlphabet } from 'nanoid';

/**
 * Custom alphabet for generating id
 */
const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/**
 * Generates random id based on custom alphabet
 * @returns id as string
 */
export const generateId = customAlphabet(ALPHABET, 12);
