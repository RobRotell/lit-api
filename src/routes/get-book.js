import { Bookkeeper } from '../controllers/Bookkeeper'


export const routeGetBook = {
	method: 'GET',
	path: '/get-book/{id?}',
	async handler( req, h ) {

		let book
		let bookId = req.params.id

		if( bookId ) {
			bookId = parseInt( bookId, 10 )

			if( Number.isNaN( bookId ) ) {
				return h.response({
					success: false,
					data: {
						error: 'Book ID must be a number.',
					}
				}).code( 400 )
			}

			book = await Bookkeeper.getBookById( bookId )

			if( !book ) {
				return h.response({
					success: false,
					data: {
						error: 'ID did not match a book.',
					}
				}).code( 404 )
			}

		// otherwise, get random book
		} else {
			book = await Bookkeeper.getRandomBook()
		}

		return {
			success: true,
			data: {
				book: book.getAttributes()
			}
		}
	}
}
