import path from 'path'


const basePath = path.resolve()


/**
 * Convert path to URL
 *
 * @param {string} targetPath
 * @return {string} URL
 */
export const convertPathToUrl = targetPath => {
	return targetPath.replace( basePath, process.env.APP_URL )
}
