/**
 * Strip leading and trailing quotes that OpenAI sometimes adds to titles and taglines
 *
 * @throws {TypeError} Argument isn't a string
 *
 * @param {string} value
 * @return {string}
 */
export const stripLeadingAndTrailingQuotes = value => {
	if( 'string' !== typeof value ) {
		throw new TypeError( 'Argument must be a string.' )
	}

	if( value.startsWith( '"' ) && value.endsWith( '"' ) ) {
		value = value.substring( 1, value.length - 1 )
	}

	return value
}
