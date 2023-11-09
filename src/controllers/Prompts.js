/* eslint-disable max-len */
import { Characters } from '../datasets/Characters'
import { Genres } from '../datasets/Genres'
import { ImageStyles } from '../datasets/ImageStyles'
import { Plots } from '../datasets/Plots'
import { Nationalities } from '../datasets/Nationalities'


export class Prompts {


	/**
	 * Generate prompt for book title
	 *
	 * @return {string}
	 */
	static generatePrompts() {
		const genre = Genres.getRandomValue()
		const scenario = `${Characters.getRandomValue()} ${Plots.getRandomValue()}`
		const nationality = Nationalities.getSkewedRandomValue( 'American', 100 )
		const imageStyle = ImageStyles.getRandomValue()

		return {
			title: `Create a title for a book that is between three and ten words. This book's genre is ${genre}. This book's plot is: "${scenario}."`,
			author: `Create a name for a ${nationality} author that is between two and four words.`,
			tagline: `Create a tagline for a book. This book's genre is ${genre}. This book's plot is: "${scenario}."`,
			cover: `Create an image for a book cover. The image style should be ${imageStyle}. This book's genre is ${genre}. This book's plot is: "${scenario}."`,
		}
	}


}
