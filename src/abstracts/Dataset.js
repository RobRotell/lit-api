import { shuffleArray } from '../utils/shuffleArray'


export class Dataset {


	static values = []


	/**
	 * Get random value from dataset
	 *
	 * @return {string}
	 */
	static getRandomValue() {
		return this.values[ Math.floor( Math.random() * this.values.length ) ]
	}


	/**
	 * Get "skewed" random value
	 *
	 * @param {string} skewValue Weighted value
	 * @param {number} count Number of times weighted value should be in array
	 *
	 * @return {string}
	 */
	static getSkewedRandomValue( skewValue, count ) {
		let values = this.values

		for( let i = 0; i < count; ++i ) {
			this.values.push( skewValue )
		}

		values = shuffleArray( values )

		return values[ Math.floor( Math.random() * values.length ) ]
	}

}
