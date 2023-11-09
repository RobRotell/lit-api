import OpenAI from 'openai'


export const createMovie = {
	method: 'POST',
	path: '/create-movie',
	handler: async ( req, h ) => {
		const openai = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		})

		const thing = await openai.images.generate({
			model: 'dall-e-3',
			prompt: 'Photo of a spy riding on an elephant, floating in space. 70mm. black and white. film grain',
			quality: 'hd',
			size: '1024x1024',
			style: 'vivid',
			user: process.env.OPENAI_API_USER,
		})

		return {
			thing,
			// req,
			// h
		}
	}
}
