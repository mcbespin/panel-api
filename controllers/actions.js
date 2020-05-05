const logger = require('../helpers/logger')
const jwt = require('../helpers/jwt')
const models = require('../database/models')
const cp = require('child_process')

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
    }

}
