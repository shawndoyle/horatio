//Dependancies
const express = require('express')
const f = require('../functions')
const o = require('../objects')

//Database
const pg = require('knex')({
	client: 'pg',
	version: '10',
	connection: {
		host: '127.0.0.1',
		user: 'horatio',
		password: 'GoodnightSweetPrince',
		database: 'ShakespearIO'
	}
});

const text = express.Router()

text.get('/:play', async function(req, res) {
	try {
		const response = new o.Response(req)
		const play_data = await f.getPlayData(req.params.play)
		if(!play_data) {
			response.Error(1)
			res.status(400).send(response)
		}
		let play_text = await f.packPlayText(play_data.id)
		play_text = await f.charFilter(play_text, req.query.char)
		const play = new o.Play(play_data)
		play.addText(play_text)
		response.addData(play)
		res.send(response)
	} catch (e) {
		f.logError(e, req, res)
	}
})

text.get('/:play/:act([0-9]+)', async function(req, res){
	try {
		const response = new o.Response(req)
		const play_data = await f.getPlayData(req.params.play)
		if(!play_data) {
			response.Error(1)
			res.status(400).send(response)
		}
		let play_text = await f.packPlayText(play_data.id, req.params.act)
		play_text = await f.charFilter(play_text, req.query.char)
		const play = new o.Play(play_data)
		play.addText(play_text)
		response.addData(play)
		res.send(response)
	} catch(e) {
		f.logError(e, req, res)
	}
})


text.get('/:play/:act([0-9]+)/:scene([0-9]+)', async function(req, res) {
	try {
		const response = new o.Response(req)
		const play_data = await f.getPlayData(req.params.play)
		if(!play_data) {
			response.Error(1)
			res.status(400).send(response)
		}
		const scene_index = {
			play_id: play_data.id,
			act: req.params.act,
			scene: req.params.scene
		}
		let play_text = [await f.packSceneText(scene_index)]
		play_text = await f.charFilter(play_text, req.query.char)
		const play = new o.Play(play_data)
		play.addText(play_text)
		response.addData(play)
		res.send(response)
	} catch(e) {
		f.logError(e, req, res)
	}
})

text.get('/:play/:act([0-9]+)/:scene([0-9]+)/:lines([0-9]+|[0-9]+-[0-9]+)', async function (req, res) {
	try {
		const response = new o.Response(req)		
		const play_data = await f.getPlayData(req.params.play)
		if(!play_data) {
			response.Error(1)
			res.status(400).send(response)
		}
		const [ firstLine, lastLine ] = req.params.lines.split('-')
		const scene_index = {
			play_id: play_data.id,
			act: req.params.act,
			scene: req.params.scene,
			firstLine,
			lastLine
		}
		let play_text = [await f.packSceneText(scene_index)]
		play_text = await f.charFilter(play_text, req.query.char)
		const play = new o.Play(play_data)
		play.addText(play_text)
		response.addData(play)
		res.send(response)
	} catch(e) {
		f.logError(e, req, res)
	}
})


text.get('*', (req, res) => {
	res.status(404).send("Invalid url")
})


module.exports = text