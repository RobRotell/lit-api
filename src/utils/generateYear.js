import dayjs from 'dayjs'
import { getRandomValueFromArray } from './getRandomValue'

/**
 * Generate a random year
 *
 * @return {number}
 */
export const generateRandomYear = () => {
	const years = []

	const currentYear = parseInt( dayjs().format( 'YYYY' ), 10 )

	for( let i = 1960; i <= currentYear; ++i ) {
		years.push( i )
	}

	return getRandomValueFromArray( years )
}
