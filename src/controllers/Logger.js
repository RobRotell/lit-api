import dayjs from 'dayjs'


export class Logger {


	/**
	 * Log regular message
	 *
	 * @param {mixed} data
	 * @return {self}
	 */
	static logMessage( data ) {
		this.#log( data )
	}


	/**
	 * Log error
	 *
	 * @param {error} err
	 * @param {mixed} data
	 *
	 * @return {self}
	 */
	static logError( error ) {
		this.#log({ error })
	}


	/**
	 * Write to log
	 *
	 * pm2 will capture all output from console.log
	 *
	 * @param {mixed} data
	 * @param {bool} isError
	 *
	 * @return {void}
	 */
	static #log ( data, isError = false ) {
		const entry = {
			time: dayjs().format(),
			error: isError,
			// trace: console.trace(),
			data,
		}

		if( isError ) {
			console.warn( entry )
		} else {
			console.log( entry )
		}
	}


}
