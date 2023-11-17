/* global process, console */


import 'dotenv/config'
import Hapi from '@hapi/hapi'
import inert from '@hapi/inert'


// routes
import { routeCreateBook } from './src/routes/create-book.js'
import { routeGetBook } from './src/routes/get-book.js'
import { routeGetRandomBook } from './src/routes/get-random-book.js'
import { routePublicFiles } from './src/routes/public-files.js'


const init = async () => {

	const server = Hapi.server({
		host: 'localhost',
		port: process.env.PORT,
	})

	// needed to serve public files
	await server.register( inert )

	server.route( routePublicFiles )
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
