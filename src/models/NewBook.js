/* global console */
/* eslint-disable max-len */
import { Book } from '../abstracts/Book'
import { Characters } from '../datasets/Characters'
import { Genres } from '../datasets/Genres'
import { ImageStyles } from '../datasets/ImageStyles'
import { Plots } from '../datasets/Plots'
import { Nationalities } from '../datasets/Nationalities'
import dayjs from 'dayjs'
import { OpenAi } from '../clients/OpenAi'


export class NewBook extends Book {


	imageUrl


	/**
	 * Constructor
	 *
	 */
	constructor() {
		super()

		this.date = dayjs().format( 'YYYY-MM-DD' )
	}


	/**
	 * Create movie
	 *
	 * @return {Promise<number>} Book ID
	 */
	async create() {
		const { characters, genre, imageStyle, nationality, plot } = this.createPromptAttributes()

		// we'll save this to the DB later
		this.genre = genre

		this.title = await this.createTitle( genre, plot, characters )
		this.author = await this.createAuthor( nationality )
		this.tagline = await this.createTagline( genre, plot, characters )

		// this.imageUrl = this.createCoverImage( imageStyle, genre, plot, characters )

		console.log( this )

		return 5
	}


	/**
	 * Create attributes to be used for prompts
	 *
	 * @return {obj} Attributes
	 */
	createPromptAttributes() {
		return {
			characters: Characters.getRandomValue(),
			genre: Genres.getRandomValue(),
			imageStyle: ImageStyles.getRandomValue(),
			nationality: Nationalities.getSkewedRandomValue( 'American', 100 ),
			plot: Plots.getRandomValue(),
		}
	}


	/**
	 * Create book title through OpenAI
	 *
	 * @throws {Error} Failed to create book title through OpenAI
	 *
	 * @param {string} genre
	 * @param {string} plot
	 * @param {string} characters
	 *
	 * @return {Promise<string>} Book title
	 */
	async createTitle( genre, plot, characters ) {
		const prompt = `Create a title for a book that is between three and ten words. This book's genre is ${genre}. This book's plot is: "${characters} ${plot}"`

		try {
			return await OpenAi.generateChatCompletion( prompt )
		} catch ( err ) {
			console.warn( err )
			throw new Error( 'Failed to create book title.' )
		}
	}


	/**
	 * Create book author through OpenAI
	 *
	 * @throws {Error} Failed to create book author through OpenAI
	 *
	 * @param {string} nationality
	 * @return {Promise<string>} Book author
	 */
	async createAuthor( nationality ) {
		const prompt = `Create a name for a ${nationality} author that is between two and four words.`

		try {
			return await OpenAi.generateChatCompletion( prompt )
		} catch ( err ) {
			console.warn( err )
			throw new Error( 'Failed to create book author.' )
		}
	}


	/**
	 * Create book tagline through OpenAI
	 *
	 * @throws {Error} Failed to create book tagline through OpenAI
	 *
	 * @param {string} genre
	 * @param {string} plot
	 * @param {string} characters
	 *
	 * @return {Promise<string>} Book tagline
	 */
	async createTagline( genre, plot, characters ) {
		const prompt = `Create a tagline for a book. This book's genre is ${genre}. This book's plot is: "${characters} ${plot}`

		try {
			return await OpenAi.generateChatCompletion( prompt )
		} catch ( err ) {
			console.warn( err )
			throw new Error( 'Failed to create book tagline.' )
		}
	}


	/**
	 * Create book cover image through OpenAI
	 *
	 * @throws {Error} Failed to create book cover image through OpenAI
	 *
	 * @param {string} imageStyle
	 * @param {string} genre
	 * @param {string} plot
	 * @param {string} characters
	 *
	 * @return {Promise<string>} URL for book cover image on OpenAI's server
	 */
	async createCoverImage( imageStyle, genre, plot, characters ) {
		const prompt = `Create an image for a book cover. The image style should be ${imageStyle}. This book's genre is ${genre}. This book's plot is: "${characters} ${plot}"`

		try {
			return await OpenAi.generateImage( prompt )
		} catch ( err ) {
			console.warn( err )
			throw new Error( 'Failed to create book cover image.' )
		}
	}

}
