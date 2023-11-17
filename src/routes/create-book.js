import { Bookkeeper } from '../controllers/Bookkeeper.js'
import { SimpleAuth } from '../controllers/SimpleAuth.js'
import { ResponseError } from '../models/ResponseError.js'
import { ResponseSuccess } from '../models/ResponseSuccess.js'


export const routeCreateBook = {
	method: 'POST',
	path: '/create-book',
	async handler( req, h ) {
		let resBody

		// simple authentication
		if( !SimpleAuth.validate( req.payload?.auth ) ) {
			resBody = new ResponseError
			resBody.setError( 'Invalid authorization code. Do I know you?' )

			return h.response( resBody.package() ).code( 403 )
		}

		// now, to the good part
		try {
			const id = await Bookkeeper.createBook()

			resBody = new ResponseSuccess
			resBody.setData( 'id', id )

			return resBody.package()

		} catch ( err ) {
			resBody = new ResponseError
			resBody.setError( err.message )

			return h.response( resBody.package() ).code( 500 )
		}
	}
}
