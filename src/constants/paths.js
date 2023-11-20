import path, { dirname } from 'path'
import { fileURLToPath } from 'url'


// todo -- obviously, there's gotta be a better way to do this
const appBasePath = dirname( dirname( dirname( fileURLToPath( import.meta.url ) ) ) )
const publicBasePath = path.join( dirname( appBasePath ), 'public' )


export {
	appBasePath,
	publicBasePath,
}
