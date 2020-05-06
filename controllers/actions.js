const logger = require('../helpers/logger')
const jwt = require('../helpers/jwt')
const models = require('../database/models')
const fs = require('fs')
const { exec } = require('child_process')

module.exports = {

    status_server: async (req, res) => {
        logger.debug('status_server()')
        let resp = await jwt.getUserFromJwt(req, res)
        if (resp.status > 400) return res.sendStatus(401)
        let server = await models.Server.findOne({
            where: {
                id: req.params.id
            }
        })
        if (!server) return res.sendStatus(404)
        const shellScript = exec(`cd ${server.path} && ./start.sh status`)
        shellScript.stdout.on('data', data => {
            res.status(200).json({
                message: data.replace('\n', '')
            })
            res.end()
        })
        shellScript.stderr.on('data', data => {
            res.status(500).json({
                error: data
            })
            res.end()
        })
    },

    logs_server: async (req, res) => {
        logger.debug('logs_server()')
        let resp = await jwt.getUserFromJwt(req, res)
        if (resp.status > 400) return res.sendStatus(401)
        let server = await models.Server.findOne({
            where: {
                id: req.params.id
            }
        })
        if (!server) return res.sendStatus(404)
        let file = fs.readFileSync(`${server.path}/logs/latest.log`)
        res.status(200).send(file)
    },

    start_server: async (req, res) => {
        logger.debug('start_server()')
        let resp = await jwt.getUserFromJwt(req, res)
        if (resp.status > 400) return res.sendStatus(401)
        let server = await models.Server.findOne({
            where: {
                id: req.params.id
            }
        })
        if (!server) return res.sendStatus(404)
        const shellScript = exec(`cd ${server.path} && ./start.sh start`)
        shellScript.stdout.on('data', data => {
            res.status(200).json({
                message: 'Le serveur est en cours de démarrage.'
            })
            res.end()
        })
        shellScript.stderr.on('data', data => {
            res.status(500).json({
                error: data
            })
            res.end()
        })
    },

    stop_server: async (req, res) => {
        logger.debug('stop_server()')
        let resp = await jwt.getUserFromJwt(req, res)
        if (resp.status > 400) return res.sendStatus(401)
        let server = await models.Server.findOne({
            where: {
                id: req.params.id
            }
        })
        if (!server) return res.sendStatus(404)
        const shellScript = exec(`cd ${server.path} && ./start.sh stop`)
        shellScript.stdout.on('data', data => {
            res.status(200).json({
                message: 'Le serveur est en cours d\'arrêt.'
            })
            res.end()
        })
        shellScript.stderr.on('data', data => {
            res.status(500).json({
                error: data
            })
            res.end()
        })
    },

    command_server: async (req, res) => {
        logger.debug('command_server()')
        let resp = await jwt.getUserFromJwt(req, res)
        if (resp.status > 400) return res.sendStatus(401)
        let server = await models.Server.findOne({
            where: {
                id: req.params.id
            }
        })
        if (!server) return res.sendStatus(404)
        if (!req.body.command) return res.sendStatus(412)
        const shellScript = exec(`cd ${server.path} && ./start.sh command ${req.body.command}`)
        shellScript.stdout.on('data', data => {
            res.status(200).json({
                message: 'La commande a bien été éxécutée sur le serveur.'
            })
            res.end()
        })
        shellScript.stderr.on('data', data => {
            res.status(500).json({
                error: data
            })
            res.end()
        })
    }

}
