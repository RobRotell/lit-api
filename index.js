/* global process, console */


import 'dotenv/config'
import Hapi from '@hapi/hapi'


// routes
import { createBook } from './src/routes/create-book'


const init = async () => {

	const server = Hapi.server({
		host: 'localhost',
		port: process.env.PORT,
	})

	server.route( createBook )

	await server.start()
	console.log( 'Server running on %s', server.info.uri )
}


process.on( 'unhandledRejection', err => {
	console.log( err )
	process.exit( 1 )
})


init()
