import { NewBook } from '../models/NewBook'


export const createBook = {
	method: 'POST',
	path: '/create-book',
	handler: async ( req, h ) => {

		try {
			const book = new NewBook
			const bookId = await book.create()

			return {
				bookId
			}

		} catch ( err ) {
			console.warn( err )
			return h.response({
				err,
			}).code( 500 )
		}
	}
}
