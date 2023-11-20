import { publicBasePath } from '../constants/paths.js'


/**
 * Convert path to URL
 *
 * @param {string} targetPath
 * @return {string} URL
 */
export const convertPathToUrl = targetPath => {
	return targetPath.replace( `${publicBasePath}`, process.env.APP_URL )
}
