import { PrismaClient } from '@prisma/client'


export class Database {


	static #client = null


	/**
	 * Establish Prisma client
	 *
	 * @return {void}
	 */
	static #createClient() {
		if ( null === Database.#client ) {
			Database.#client = new PrismaClient()
		}
	}


	/**
	 * Get Prisma client instance
	 *
	 * @return {Object} Prisma client
	 */
	static getClient() {
		if ( !Database.#client ) {
			Database.#createClient()
		}

		return Database.#client
	}

}
