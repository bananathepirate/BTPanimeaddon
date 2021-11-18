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
			"idPrefixes": ['kitsu:']
		},
		{
			"name": "BTPAnimeSeries",
			"type": "series",
			"id": "BTPAnimeSeries",
			"idPrefixes": ['kitsu:']
		}
	],
	"resources": [
		"catalog",
		"stream"
	],
	"types": [
		"movie",
		"series",
		"meta"
	],
	"name": "BTPanimeaddon",
	"description": "BananaThePirate's stremio anime addon"
}
const builder = new addonBuilder(manifest)

const BTPAnimeMovies = require('./database/movies.json');
const BTPAnimeSeries = require('./database/series.json');
const BTPdatabase = require('./database.json')

// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineCatalogHandler.md
builder.defineCatalogHandler(({type, id, extra}) => {
	console.log("request for catalogs: "+type+" "+id)
	return Promise.resolve({ metas: [
		BTPAnimeMovies,
		BTPAnimeSeries
	] })
})

builder.defineStreamHandler(function(args) {
    if (dataset[args.id]) {
        return Promise.resolve({ streams: [dataset[args.id]] });
    } else {
        return Promise.resolve({ streams: [] });
    }
})

addon.defineMetaHandler(args => {
	return new Promise((resolve, reject) => {
		const url = kitsuEndpoint + '/meta/' + args.type + '/' + args.id + '.json'
	  needle.get(url, (err, resp, body) => {
		if ((body || {}).meta)
		  resolve(body)
		else
		  reject(new Error('Could not get meta from kitsu api for: '+args.id))
	  })
	})
  })

module.exports = builder.getInterface()