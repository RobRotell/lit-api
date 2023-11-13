import path from 'path'


export const routePublicFiles = {
	method: 'GET',
	path: '/{param*}',
	handler: {
		directory: {
			path: path.join( path.resolve(), 'public' ),
			index: false,
		}
	}
}
