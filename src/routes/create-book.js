import { BookForDisplay } from '../models/BookForDisplay'
import { NewBook } from '../models/NewBook'


export const routeCreateBook = {
	method: 'POST',
	path: '/create-book',
	async handler( req, h ) {

		try {
			const newBook = new NewBook
			const bookId = await newBook.create()

			// if all went well, we have a book record ID
			const bookForDisplay = new BookForDisplay( bookId )

			// todo -- throw error if for some reason book failed to save
			await bookForDisplay.populateAttributes()

			return bookForDisplay.getAttributes()

		} catch ( err ) {
			console.warn( err )
			return h.response({
				err,
			}).code( 500 )
		}
	}
}
