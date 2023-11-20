import { PrismaClient } from '@prisma/client'
import { Client } from '../abstracts/Client.js'


export class Database extends Client {


	/**
	 * Establish Prisma client
	 *
	 * @return {void}
	 */
	static createClient() {
		if ( null === this.client ) {
			this.client = new PrismaClient()
		}
	}


}
