import OpenAI from 'openai'
import { OpenAi } from '../clients/OpenAi'
import { Prompts } from '../controllers/Prompts'


export const createMovie = {
	method: 'POST',
	path: '/create-movie',
	handler: async ( req, h ) => {

		const prompts = Prompts.generatePrompts()

		const title = await OpenAi.generateChatCompletion( prompts.title )
		const author = await OpenAi.generateChatCompletion( prompts.author )
		const tagline = await OpenAi.generateChatCompletion( prompts.tagline )

		const image = await OpenAi.generateImage( prompts.cover )

		return {
			title,
			author,
			tagline,
			image,
			prompts,
		}
	}
}
