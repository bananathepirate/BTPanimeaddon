const { addonBuilder } = require("stremio-addon-sdk")

const needle = require('needle')

const kitsuEndpoint = 'https://anime-kitsu.strem.fun'

// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/manifest.md
const manifest = {
	"id": "community.BTPanimeaddon",
	"version": "0.0.1",
	"catalogs": [
		{
			"name": "BTP Anime",
			"type": "series",
			"id": "BTPAnime",
			"idPrefixes": ["BTPAnime_"],
			"extra": [
				{"name": "kId"}
			]
		}
	],
	"resources": [
		"catalog",
		"stream",
		"meta"
	],
	"types": [
		"series",
		"movie",
		"meta"
	],
	"name": "BTPanimeaddon",
	"description": "BananaThePirate's stremio anime addon"
}
const builder = new addonBuilder(manifest)

const BTPAnimeMovies = require('./database/movies.json');
const AnimeStreams = require('./stream/movie/BTPAnime_YourName.json')
//const BTPAnimeSeries = require('./database/series.json');
//const BTPdatabase = require('./database.json')

// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineCatalogHandler.md
//I want my stuf to be seperate from all others, so I'm making my own IDs, kId is short for Kitsu ID
builder.defineMetaHandler((args => {
	return new Promise((resolve) => {
		resolve(getkitsu(args.id))
	})
}))

function getkitsu(id) {
	const url = kitsuEndpoint + '/meta/series/' + BTPAnimeMovies[id].kId + '.json'
	kmeta = needle.get(url)
	return kmeta
}

builder.defineCatalogHandler(({type, id}) => {
	console.log("request for catalogs: "+type+" "+id)
	return Promise.resolve({ metas: [
		BTPAnimeMovies
	] })
})

builder.defineStreamHandler(function(args) {
    if (BTPAnimeMovies[args.id]) {
        return Promise.resolve({ streams: [BTPAnimeMovies[args.id]] });
    } else {
        return Promise.resolve({ streams: [] });
    }
})



/*
const animeMeta = {
	title: 'Your Name.',
	type: 'movie'
}
const url = kitsuEndpoint + '/catalog/' + animeMeta.type + '/kitsu-search-' + animeMeta.type + '/search=' + encodeURIComponent(animeMeta.title) + '.json'
needle.get(url, (err, resp, body) => {
	// presuming the first result is the correct one
	const meta = ((body || {}).metas || [])[0]
	if (meta)
		console.log(meta)
	else
		console.error(new Error('No results from Kitsu for the title: ' + animeMeta.title))
})
*/


module.exports = builder.getInterface()