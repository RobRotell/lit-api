export class Client {


	static client = null


	/**
	 * Get client instance
	 *
	 * @return {object} Client
	 */
	static getClient() {
		if ( !this.client ) {
			this.createClient()
		}

		return this.client
	}


}
