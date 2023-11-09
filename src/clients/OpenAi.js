/* global process, console */
import OpenAI from 'openai'


const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
})


export class OpenAi {


	/**
	 * Generate text based on prompt
	 *
	 * @throws {Error} Invalid/unexpected response from OpenAI's side
	 *
	 * @param {string} prompt
	 * @return {string} Chat completion
	 */
	static async generateChatCompletion( prompt ) {
		const res = await client.chat.completions.create({
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
			console.warn({
				error: 'Invalid response from OpenAI',
				res
			})

			throw new Error( 'Invalid response from OpenAI' )
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
	 * @return {string} URL of image on OpenAI's servers
	 */
	static async generateImage( prompt ) {
		const res = await client.images.generate({
			model: 'dall-e-3',
			quality: 'hd',
			size: '1024x1024',
			style: 'vivid',
			user: process.env.OPENAI_API_USER,
			prompt,
		})

		let imageUrl = res?.data[0]?.url

		if ( 'string' !== typeof imageUrl || !imageUrl.length ) {
			console.warn({
				error: 'Invalid response from OpenAI',
				res
			})

			throw new Error( 'Invalid response from OpenAI' )
		}

		// validates that string is a URL
		try {
			imageUrl = new URL( imageUrl )
		} catch ( err ) {
			console.warn({
				err,
			})

			throw new Error( 'Invalid URL provided by OpenAI' )
		}

		return imageUrl.toString()
	}

}
