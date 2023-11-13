import Randomstring from 'randomstring'


/**
 * Generate string of random characters
 *
 * @param {number} length Number of characters
 * @return {string}
 */
export const generateRandomChars = ( length = 16 ) => {
	return Randomstring.generate({
		length,
		charset: 'alphanumeric',
	})
}
