import 'dotenv/config'
import Hapi from '@hapi/hapi'


// routes
import { routeGetBook } from './src/routes/get-book.js'
import { routeGetRandomBook } from './src/routes/get-random-book.js'
import { routeCreateBook } from './src/routes/create-book.js'


const init = async () => {

	const server = Hapi.server({
		host: '127.0.0.1',
		port: process.env.PORT,
	})

	server.route( routeGetBook )
	server.route( routeGetRandomBook )
	server.route( routeCreateBook )

	await server.start()
	console.log( 'Server running on %s', server.info.uri )
}


process.on( 'unhandledRejection', err => {
	console.log( err )
	process.exit( 1 )
})


init()
