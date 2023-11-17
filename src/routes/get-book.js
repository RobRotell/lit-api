import { Bookkeeper } from '../controllers/Bookkeeper.js'
import { ResponseError } from '../models/ResponseError.js'
import { ResponseSuccess } from '../models/ResponseSuccess.js'


export const routeGetBook = {
	method: 'GET',
	path: '/get-book/{id?}',
	async handler( req, h ) {
		let resBody

		let bookId = req.params.id

		if( !bookId ) {
			resBody = new ResponseError( 'You must pass a book ID.' )

			return h.response( resBody.package() ).code( 400 )
		}

		bookId = parseInt( bookId, 10 )

		if( Number.isNaN( bookId ) ) {
			resBody = new ResponseError( 'Book ID must be a number.' )

			return h.response( resBody.package() ).code( 400 )
		}

		const book = await Bookkeeper.getBookById( bookId )

		if( !book ) {
			resBody = new ResponseError( 'ID did not match a book.' )

			return h.response( resBody.package() ).code( 404 )
		}

		resBody = new ResponseSuccess
		resBody.setData( 'book', book.getAttributes() )

		return resBody.package()
	}
}
