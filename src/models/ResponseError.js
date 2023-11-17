import { ApiResponse } from '../abstracts/ApiResponse.js'


export class ResponseError extends ApiResponse {


	success = false


	/**
	 * Constructor
	 *
	 * @param {string} err
	 */
	constructor( err ) {
		super()

		if( 'string' === typeof err && err.length ) {
			this.setError( err )
		}
	}


	/**
	 * Set error message
	 *
	 * @param {string} err
	 * @return {void}
	 */
	setError( err ) {
		this.setData( 'error', err )
	}


}
