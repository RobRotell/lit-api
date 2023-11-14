import dayjs from 'dayjs'
import { Book } from '../abstracts/Book'
import { Database } from '../clients/Database'


export class BookForDisplay extends Book {


	/**
	 * Constructor
	 *
	 * @throws {Error} ID doesn't match a book
	 *
	 * @param {number} id
	 *
	 */
	constructor( id ) {
		super()

		this.setAttribute( 'id', id )
	}


	/**
	 * Populate attributes from database
	 *
	 * @return {void}
	 */
	async populateAttributes() {
		const database = Database.getClient()

		const record = await database.books.findFirst({
			where: {
				id: this.getAttribute( 'id' )
			}
		})

		const {
			id,
			date,
			title,
			genre,
			tagline,
			author,
			release_year: releaseYear,
			image_urls: imageUrls,
			// prompts
		} = record

		this
			.setAttribute( 'id', id )
			.setAttribute( 'date', this.prettifyIsoDate( date ) )
			.setAttribute( 'title', title )
			.setAttribute( 'genre', genre ) // todo -- uppercase first letter?
			.setAttribute( 'tagline', tagline )
			.setAttribute( 'author', author )
			.setAttribute( 'releaseYear', releaseYear )
			.setAttribute( 'imageUrls', JSON.parse( imageUrls ) )
			// .setAttribute( 'prompts', JSON.parse( prompts ) )
	}


	/**
	 * Convert ISO date to 'YYYY-MM-DD'
	 *
	 * @param {string} date
	 * @return {string}
	 */
	prettifyIsoDate( date ) {
		const dayJsObj = dayjs( date )

		return dayJsObj.format( 'YYYY-MM-DD' )
	}


	/**
	 * Get all attributes as an object for Hapi to easily stringify for API response
	 *
	 * @return {obj}
	 */
	getAttributes() {
		const attributesForDisplay = {}

		this.attributes.forEach( ( value, key ) => {
			attributesForDisplay[ key ] = value
		})

		return attributesForDisplay
	}

}
