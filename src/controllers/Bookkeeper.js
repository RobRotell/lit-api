import { Database } from '../clients/Database.js'
import { NewBook } from '../models/NewBook.js'
import { getRandomValueFromArray } from '../utils/getRandomValue.js'
import { BookForDisplay } from '../models/BookForDisplay.js'


export class Bookkeeper {

	/**
	 * Create book
	 *
	 * @return {Promise<number>} ID for new book
	 */
	static async createBook() {
		const newBook = new NewBook

		return await newBook.create()
	}


	/**
	 * Get random book
	 *
	 * @todo Add limit property
	 *
	 * @param {array} excludeIds IDs of books to exclude
	 * @return {Promise<object>|false} BookForDisplay
	 */
	static async getRandomBook( excludeIds ) {
		const dbClient = Database.getClient()

		const queryArgs = {
			select: {
				id: true,
			}
		}

		if( Array.isArray( excludeIds ) && excludeIds.length ) {
			queryArgs.where = {
				NOT: {
					id: {
						in: excludeIds,
					}
				}
			}
		}

		// Prisma doesn't support getting random records (yet)
		const bookIds = await dbClient.books.findMany( queryArgs )

		// no books found (e.g. we've excluded all of them)
		if( !bookIds.length ) {
			return false

		} else {
			const { id } = getRandomValueFromArray( bookIds )

			const book = new BookForDisplay( id )

			await book.populateAttributes()

			return book
		}
	}


	/**
	 * Get book by ID
	 *
	 * @param {number} id
	 * @return {Promise<object|false>}
	 */
	static async getBookById( id ) {
		try {
			const book = new BookForDisplay( id )

			await book.populateAttributes()

			return book

		// book doesn't exist
		} catch ( err ) {
			return false
		}
	}

}
