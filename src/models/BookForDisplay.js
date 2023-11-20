import dayjs from 'dayjs'
import { Book } from '../abstracts/Book.js'
import { Database } from '../clients/Database.js'
import { Logger } from '../controllers/Logger.js'


export class BookForDisplay extends Book {


	/**
	 * Constructor
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
	 * @return {Promise<self>}
	 */
	async populateAttributes() {
		const dbClient = Database.getClient()

		const record = await dbClient.books.findFirst({
			where: {
				id: this.getAttribute( 'id' )
			}
		})

		if( !record ) {
			const errMessage = 'No book matches provided ID'

			Logger.logError({
				error: errMessage,
				context: {
					action: 'populate book attributes',
					args: {
						id: this.getAttribute( 'id' ),
					}
				}
			})

			throw new Error( errMessage )
		}

		const {
			id,
			date,
			title,
			genre,
			tagline,
			author,
			release_year: releaseYear,
			image_urls: imageUrls,
			prompts
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
			.setAttribute( 'prompts', JSON.parse( prompts ) )

		return this
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
