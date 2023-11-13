import { createHash } from 'node:crypto'


/**
 * Hash value
 *
 * @param {string} val
 * @param {string} algo
 *
 * @return {string}
 */
export const hashValue = ( val, algo = 'sha1' ) => {
	return createHash( algo ).update( val ).digest( 'hex' )
}
