const { addonBuilder } = require("stremio-addon-sdk")

const needle = require('needle')

const kitsuEndpoint = 'https://addon.stremio-kitsu.cf'

// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/manifest.md
const manifest = {
	"id": "community.BTPanimeaddon",
	"version": "0.0.1",
	"catalogs": [
		{
			"name": "BTPAnimeMovies",
			"type": "movie",
			"id": "BTPAnimeMovies",
			"idPrefixes": "BTPAM_"
		},
		{
			"name": "BTPAnimeSeries",
			"type": "series",
			"id": "BTPAnimeSeries"
		}
	],
	"resources": [
		"catalog",
		"stream"
	],
	"types": [
		"movie",
		"series"
	],
	"name": "BTPanimeaddon",
	"description": "BananaThePirate's stremio anime addon"
}
const builder = new addonBuilder(manifest)

builder.defineCatalogHandler(({type, id, extra}) => {
	console.log("request for catalogs: "+type+" "+id)
	// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineCatalogHandler.md
	return Promise.resolve({ metas: [
		{
			id: "tt1254207",
			type: "movie",
			name: "The Big Buck Bunny",
			poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/220px-Big_buck_bunny_poster_big.jpg"
		}
	] })
})

builder.defineStreamHandler(function(args) {
    if (dataset[args.id]) {
        return Promise.resolve({ streams: [dataset[args.id]] });
    } else {
        return Promise.resolve({ streams: [] });
    }
})

function GetMovieMeta(AnimeMovie) {
	const url = kitsuEndpoint + '/catalog/movie/kitsu-search-movie/search=' + encodeURIComponent(AnimeMovie.title) + '.json'
	needle.get(url, (err, resp, body) => {
		// presuming the first result is the correct one
		const meta = ((body || {}).metas || [])[0]
		if (meta)
			return meta
		else
			console.error(new Error('No results from Kitsu for the title: ' + animeMeta.title))
	})

}

module.exports = builder.getInterface()