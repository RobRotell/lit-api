export class ApiResponse {


	success
	data = {}


	/**
	 * Set response data
	 *
	 * @param {string} key
	 * @param {mixed} value
	 *
	 * @return {void}
	 */
	setData( key, value ) {
		this.data[ key ] = value
	}


	/**
	 * Package data for output
	 *
	 * @return {obj}
	 */
	package() {
		return {
			success: this.success,
			data: this.data,
		}
	}


}
