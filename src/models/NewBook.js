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
import { generateRandomYear } from '../utils/generateYear'
import { stripLeadingAndTrailingQuotes } from '../utils/stripQuotes'
import { ImageProcessor } from '../controllers/ImageProcessor'
import { convertPathToUrl } from '../utils/convertPathToUrl'


export class NewBook extends Book {


	/**
	 * Constructor
	 *
	 */
	constructor() {
		super()

		this.date = dayjs().format( 'YYYY-MM-DD' )
		this.releaseYear = generateRandomYear()
	}


	/**
	 * Create movie
	 *
	 * @return {Promise<number>} Book ID
	 */
	async create() {
		this.prompts = this.createPromptAttributes()

		const { characters, genre, imageStyle, nationality, plot } = this.prompts

		// we'll save this to the DB later
		this.genre = genre

		// generate basic book data
		this.title = await this.createTitle( genre, plot, characters )
		this.author = await this.createAuthor( nationality )
		this.tagline = await this.createTagline( genre, plot, characters )

		// remove leading and trailing quotes that OpenAI *sometimes* adds
		this.title = stripLeadingAndTrailingQuotes( this.title )
		this.tagline = stripLeadingAndTrailingQuotes( this.tagline )

		// generate book cover image
		const openAiImageUrl = await this.createCoverImage( imageStyle, genre, plot, characters )

		// now, let's save and format that image
		const imageProcessor = new ImageProcessor( openAiImageUrl )

		imageProcessor.setBaseName( this.date, this.prompts )

		// image processor will download image and create JPEG (among other formats) files
		const jpgFilePaths = await imageProcessor.processImage()

		// now, we need to convert them to URLs to save for DB
		const jpgFileUrls = {}

		jpgFilePaths.forEach( ( filePath, dimension ) => {
			jpgFileUrls[ dimension ] = convertPathToUrl( filePath )
		})

		console.log( JSON.stringify( jpgFileUrls ) )

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
		const prompt = `You are marketing a newly published book. Create an interesting tagline for this book. This book's genre is ${genre}. This book's plot is: "${characters} ${plot}. The tagline should not contain a colon or semicolon. The tagline should be at least twenty words long.`

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
