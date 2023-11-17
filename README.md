# LIT (API)

As in, "that book was lit, yo."

A little personal project to take Hapi and OpenAI's DALL-E 3 API for a spin. Eventually, this will be used in conjunction with this [frontend SPA](https://lit.robr.app) (separate [repo](https://github.com/RobRotell/lit)).

Right now, there are two endpoints:
- [GET] get book by ID
	- URL: https://api.lit.robr.app/get-book/{id?}
	- accepts one parameter
		- book ID
- [GET] get random book
	- URL: https://api.lit.robr.app/get-random-book
	- accepts one parameter
		- exclude (default: [])
			- IDs of books to exclude
- [POST] create book
	- URL: https://api.lit.robr.app/create-book
	- accepts one parameter
		- auth (default: null)
		- only God and me know the code

Compare the images between this app, which uses DALL-E 3, and [Moovi](https://moovi.robr.app), which uses DALL-E 2. The differences are remarkable!
