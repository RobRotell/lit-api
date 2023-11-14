import got from 'got'
import sharp from 'sharp'
import path from 'path'


const imageDirPath = path.join( path.resolve(), 'public/img/covers' )


export class ImageProcessor {


	baseImageUrl = ''
	baseImageName = ''

	originalJpegFilePath = ''
	jpegFilePaths = []
	webpFilePaths = []
	avifFilePaths = []


	/**
	 * Captures image URL to download and process
	 *
	 * @throws {TypeError} URL is not a string
	 * @throws {Error} URL is not well formed
	 *
	 * @param {string} url
	 * @param {string} baseName
	 */
	constructor( url, baseName ) {

		// easy URL validation
		try {
			const urlObj = new URL( url )

			this.baseImageUrl = urlObj.toString()

		} catch ( err ) {
			throw new Error( 'Argument must be a wellformed URL.' )
		}

		this.baseImageName = baseName
	}


	/**
	 * Download image from OpenAI and save variants
	 *  - download base image
	 *  - convert to JPG
	 *      - resize to 480
	 *      - resize to 768
	 *  - convert all variants to WEBP
	 *  - convert all variants to AVIF
	 *
	 * @return {Promise<Map>} Map of JPEG files
	 */
	async processImage() {
		const sharpStream = sharp({
			failOn: 'none'
		})

		const promises = []

		// save original image as JPG (instead of OpenAI's PNG)
		promises.push(
			this.saveOriginalImage( sharpStream ),
			this.saveJpgVariants( sharpStream ),
			this.saveWebpVariants( sharpStream ),
			this.saveAvifVariants( sharpStream )
		)

		// save original image data to Sharp obj
		await got.stream( this.baseImageUrl ).pipe( sharpStream )

		return new Promise( ( resolve, reject ) => {
			Promise.all( promises ).then( () => {
				resolve( this.jpegFilePaths )
			}).catch( err => {
				reject( err )
			})
		})
	}


	/**
	 * Save original image as JPG (versus OpenAI's PNG)
	 *
	 * @param {object} sharpStream
	 * @return {void}
	 */
	async saveOriginalImage( sharpStream ) {
		this.originalJpegFilePath = `${imageDirPath}/${this.baseImageName}.jpg`

		await sharpStream
			.clone()
			.jpeg({ quality: 100 })
			.toFile( this.originalJpegFilePath )
	}


	/**
	 * Save image as sized JPG images
	 *
	 * @todo DRY with WEBP and AVIF functions
	 *
	 * @param {object} sharpStream
	 * @return {void}
	 */
	async saveJpgVariants( sharpStream ) {
		const jpegImg = await sharpStream
			.clone()
			.jpeg({
				quality: 70
			})

		this.jpegFilePaths = new Map(
			[
				[ 1024, `${imageDirPath}/${this.baseImageName}-1024x1024.jpg` ],
				[ 768, `${imageDirPath}/${this.baseImageName}-768x768.jpg` ],
				[ 480, `${imageDirPath}/${this.baseImageName}-480x480.jpg` ],
			]
		)

		this.jpegFilePaths.forEach( async ( filename, dimension ) => {
			await jpegImg
				.clone()
				.resize({
					width: dimension,
					height: dimension
				}).toFile( filename )
		})
	}


	/**
	 * Save image as sized WEBP images
	 *
	 * @todo DRY with JPG and AVIF functions
	 * @todo Delete WEBP variants if larger than JPG variants
	 *
	 * @param {object} sharpStream
	 * @return {void}
	 */
	async saveWebpVariants( sharpStream ) {
		const webpImg = await sharpStream
			.clone()
			.webp({
				quality: 70
			})

		this.webpFilePaths = new Map(
			[
				[ 1024, `${imageDirPath}/${this.baseImageName}-1024x1024.webp` ],
				[ 768, `${imageDirPath}/${this.baseImageName}-768x768.webp` ],
				[ 480, `${imageDirPath}/${this.baseImageName}-480x480.webp` ],
			]
		)

		this.webpFilePaths.forEach( async ( filename, dimension ) => {
			await webpImg
				.clone()
				.resize({
					width: dimension,
					height: dimension
				}).toFile( filename )
		})
	}


	/**
	 * Save image as sized AVIF images
	 *
	 * @todo DRY with JPG and WEBP functions
	 * @todo Delete WEBP variants if larger than WEBP variants
	 *
	 * @param {object} sharpStream
	 * @return {void}
	 */
	async saveAvifVariants( sharpStream ) {
		const avifImg = await sharpStream
			.clone()
			.avif({
				quality: 50
			})

		this.avifFilePaths = new Map(
			[
				[ 1024, `${imageDirPath}/${this.baseImageName}-1024x1024.avif` ],
				[ 768, `${imageDirPath}/${this.baseImageName}-768x768.avif` ],
				[ 480, `${imageDirPath}/${this.baseImageName}-480x480.avif` ],
			]
		)

		this.avifFilePaths.forEach( async ( filename, dimension ) => {
			await avifImg
				.clone()
				.resize({
					width: dimension,
					height: dimension
				}).toFile( filename )
		})
	}


}
