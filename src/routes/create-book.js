import { Bookkeeper } from '../controllers/Bookkeeper'
import { NewBook } from '../models/NewBook'


export const routeCreateBook = {
	method: 'POST',
	path: '/create-book',
	async handler( req, h ) {

		try {
			const id = await Bookkeeper.createBook()

			return {
				success: true,
				data: {
					id
				}
			}

		} catch ( err ) {
			console.warn( err )

			return h.response({
				success: false,
				data: {
					error: err.message,
				}
			}).code( 500 )
		}
	}
}
