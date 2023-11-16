import { Database } from '../clients/Database'
import { NewBook } from '../models/NewBook'
import { getRandomValueFromArray } from '../utils/getRandomValue'
import { BookForDisplay } from '../models/BookForDisplay'


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
	 * @return {Promise<object>} BookForDisplay
	 */
	static async getRandomBook() {
		const dbClient = Database.getClient()

		// Prisma doesn't support getting random records (yet)
		const bookIds = await dbClient.books.findMany({
			select: {
				id: true,
			}
		})

		const { id } = getRandomValueFromArray( bookIds )

		const book = new BookForDisplay( id )

		await book.populateAttributes()

		return book
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
