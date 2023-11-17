import { Bookkeeper } from '../controllers/Bookkeeper.js'
import { ResponseError } from '../models/ResponseError.js'
import { ResponseSuccess } from '../models/ResponseSuccess.js'


export const routeGetRandomBook = {
	method: 'GET',
	path: '/get-random-book',
	async handler( req, h ) {
		let resBody

		let excludeIds = req.query?.exclude

		if( excludeIds ) {
			excludeIds = excludeIds
				.split( ',' )
				.map( val => parseInt( val, 10 ) )
				.filter( val => !Number.isNaN( val ) )
		}

		const book = await Bookkeeper.getRandomBook( excludeIds || [] )

		// if no book (or we excluded all books)
		if( !book ) {
			resBody = new ResponseError( 'No books found.' )

			return h.response( resBody.package() ).code( 404 )
		}

		resBody = new ResponseSuccess
		resBody.setData( 'book', book.getAttributes() )

		return resBody.package()
	}
}
