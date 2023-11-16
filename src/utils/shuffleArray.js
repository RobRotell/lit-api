/**
 * Shuffle elements in an array
 *
 * @see https://stackoverflow.com/a/2450976
 *
 * @param {array} array
 * @return {array} Shuffled array
 */
export const shuffleArray = array => {
	let currentIndex = array.length
	let randomIndex

	// while elements remain to shuffle ...
	while ( 0 < currentIndex ) {

		// pick remaining element
		randomIndex = Math.floor( Math.random() * currentIndex )

		// eslint-disable-next-line no-plusplus
		currentIndex--

	  	// swap with current element
	  	[ array[ currentIndex ], array[ randomIndex ] ] = [
			array[ randomIndex ],
			array[ currentIndex ]
		]
	}

	return array
}
