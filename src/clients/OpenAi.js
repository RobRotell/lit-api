import OpenAI from 'openai'
import { Client } from '../abstracts/Client.js'
import { Logger } from '../controllers/Logger.js'


export class OpenAi extends Client {


	/**
	 * Establish Prisma client
	 *
	 * @return {void}
	 */
	static createClient() {
		if ( null === this.client ) {
			this.client = new OpenAI({
				apiKey: process.env.OPENAI_API_KEY
			})
		}
	}


	/**
	 * Generate text based on prompt
	 *
	 * @throws {Error} Invalid/unexpected response from OpenAI's side
	 *
	 * @param {string} prompt
	 * @return {Promise<string>} Chat completion
	 */
	static async generateChatCompletion( prompt ) {
		const res = await this.getClient().chat.completions.create({
			model: 'gpt-3.5-turbo-1106',
			messages: [
				{
					content: prompt,
					role: 'user',
				}
			]
		})

		const completion = res?.choices[0]?.message?.content

		if ( 'string' !== typeof completion || !completion.length ) {
			const errMessage = 'Invalid response from OpenAI'

			Logger.logError({
				error: errMessage,
				context: {
					action: 'chat completion',
					prompt,
					res: completion
				}
			})

			throw new Error( errMessage )
		}

		return completion
	}


	/**
	 * Generate image based on prompt
	 *
	 * @throws {Error} Something exploded on OpenAI's side
	 * @throws {Error} OpenAI returned malformed URL
	 *
	 * @param {string} prompt
	 * @return {Promise<string>} URL of image on OpenAI's servers
	 */
	static async generateImage( prompt ) {
		const res = await this.getClient().images.generate({
			model: 'dall-e-3',
			quality: 'hd',
			size: '1024x1024',
			style: 'vivid',
			user: process.env.OPENAI_API_USER,
			prompt,
		})

		let imageUrl = res?.data[0]?.url

		if ( 'string' !== typeof imageUrl || !imageUrl.length ) {
			const errMessage = 'Invalid response from OpenAI'

			Logger.logError({
				error: errMessage,
				context: {
					action: 'create image',
					prompt,
					res: imageUrl,
				}
			})

			throw new Error( errMessage )
		}

		// validates that string is a URL
		try {
			imageUrl = new URL( imageUrl )
		} catch ( err ) {
			const errMessage =  'Invalid URL provided by OpenAI'

			Logger.logError({
				error: errMessage,
				context: {
					action: 'parse image URL from OpenAI',
					thrown: err,
				}
			})

			throw new Error( errMessage )
		}

		return imageUrl.toString()
	}

}
