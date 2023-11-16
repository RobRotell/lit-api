/* global console */
/* eslint-disable max-len */
import dayjs from 'dayjs'
import { Book } from '../abstracts/Book'
import { Characters } from '../datasets/Characters'
import { Database } from '../clients/Database'
import { Genres } from '../datasets/Genres'
import { ImageProcessor } from '../controllers/ImageProcessor'
import { ImageStyles } from '../datasets/ImageStyles'
import { Nationalities } from '../datasets/Nationalities'
import { OpenAi } from '../clients/OpenAi'
import { Plots } from '../datasets/Plots'
import { convertPathToUrl } from '../utils/convertPathToUrl'
import { generateRandomYear } from '../utils/generateYear'
import { hashValue } from '../utils/hashValue'
import { stripLeadingAndTrailingQuotes } from '../utils/stripQuotes'


export class NewBook extends Book {


	/**
	 * Constructor
	 *
	 */
	constructor() {
		super()

		this
			.setAttribute( 'date', dayjs().toISOString() )
			.setAttribute( 'releaseYear', generateRandomYear() )
	}


	/**
	 * Create book
	 *
	 * @return {Promise<number>} Book ID
	 */
	async create() {
		try {
			const prompts = this.createPrompts()
			const { characters, genre, imageStyle, nationality, plot } = prompts

			// generate basic book data
			this
				.setAttribute( 'title', await this.createTitle( genre, plot, characters ) )
				.setAttribute( 'author', await this.createAuthor( nationality ) )
				.setAttribute( 'tagline', await this.createTagline( genre, plot, characters ) )

			// let's save these values to DB for later reference
			this
				.setAttribute( 'genre', genre )
				.setAttribute( 'prompts', prompts )

			// generate book cover image
			const openAiImageUrl = await this.createCoverImage( imageStyle, genre, plot, characters )

			// now, let's save and format that image
			const imageProcessor = new ImageProcessor(
				openAiImageUrl,
				hashValue( `${this.date} - ${JSON.stringify( this.prompts )}` )
			)

			// image processor will download image and create JPEG (among other formats) files
			const jpgFilePaths = await imageProcessor.processImage()

			// now, we need to convert them to URLs to save for DB
			const jpgFileUrls = {}

			jpgFilePaths.forEach( ( filePath, dimension ) => {
				jpgFileUrls[ dimension ] = convertPathToUrl( filePath )
			})

			this.setAttribute( 'imageUrls', jpgFileUrls )

			const bookId = await this.saveBook()

			return bookId

		} catch( err ) {
			throw new Error( 'Something went wrong creating a book!', {
				cause: err
			})
		}
	}


	/**
	 * Save book to database
	 *
	 * @return {Promise<number>}
	 */
	async saveBook() {

		// time to save entry to DB
		const dbClient = Database.getClient()

		const record = await dbClient.books.create({
			data: {
				date: this.getAttribute( 'date' ),
				title: this.getAttribute( 'title' ),
				genre: this.getAttribute( 'genre' ),
				tagline: this.getAttribute( 'tagline' ),
				author: this.getAttribute( 'author' ),
				release_year: this.getAttribute( 'releaseYear' ),
				image_urls: JSON.stringify( this.getAttribute( 'imageUrls' ) ),
				prompts: JSON.stringify( this.getAttribute( 'prompts' ) ),
			}
		})

		return record.id
	}


	/**
	 * Create attributes to be used for prompts
	 *
	 * @return {obj} Attributes
	 */
	createPrompts() {
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
		const prompt = `Create a title for a book that is between three and ten words. This book's genre is ${genre}.
			This book's plot is: "${characters} ${plot}"`

		try {
			const title = await OpenAi.generateChatCompletion( prompt )

			// remove leading and trailing quotes that OpenAI *sometimes* adds
			return stripLeadingAndTrailingQuotes( title )

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
		const prompt = `You are marketing a newly published book. Create an interesting tagline for this book. This
			book's genre is ${genre}. This book's plot is: "${characters} ${plot}. The tagline should not contain a
			colon or semicolon. The tagline should be at least twenty words long.`

		try {
			const tagline = await OpenAi.generateChatCompletion( prompt )

			// remove leading and trailing quotes that OpenAI *sometimes* adds
			return stripLeadingAndTrailingQuotes( tagline )

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
		const prompt = `Create an image for a scene in a book. The image style should be ${imageStyle}. This book's
			genre is ${genre}. This book's plot is: "${characters} ${plot}. This image should not contain any text."`

		try {
			return await OpenAi.generateImage( prompt )

		} catch ( err ) {
			console.warn( err )
			throw new Error( 'Failed to create book cover image.' )
		}
	}

}
