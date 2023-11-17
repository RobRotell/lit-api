import { ApiResponse } from '../abstracts/ApiResponse.js'


export class ResponseSuccess extends ApiResponse {


	success = true


	/**
	 * Constructor
	 *
	 * @param {string} msg
	 */
	constructor( msg ) {
		super()

		if( 'string' === typeof msg && msg.length ) {
			this.setData( 'message', msg )
		}
	}


}
