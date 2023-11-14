export class Book {


	attributes


	/**
	 * Constructor
	 *
	 */
	constructor() {
		this.attributes = new Map()

		this
			.setAttribute( 'id', null )
			.setAttribute( 'date', null )
			.setAttribute( 'title', null )
			.setAttribute( 'genre', null )
			.setAttribute( 'tagline', null )
			.setAttribute( 'author', null )
			.setAttribute( 'releaseYear', null )
			.setAttribute( 'imageUrls', [] )
			.setAttribute( 'prompts', [] )
	}


	/**
	 * Get movie attribute
	 *
	 * @throws {Error} Invalid attribute
	 *
	 * @param {string} key
	 * @return {mixed}
	 */
	getAttribute( key ) {
		if( !this.attributes.has( key ) ) {
			throw new Error( 'Invalid movie attribute.' )
		}

		return this.attributes.get( key )
	}


	/**
	 * Set movie attribute
	 *
	 * @param {string} key
	 * @param {mixed} value
	 *
	 * @return {self}
	 */
	setAttribute( key, value ) {
		this.attributes.set( key, value )

		return this
	}

}
