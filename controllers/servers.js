const logger = require('../helpers/logger')
const jwt = require('../helpers/jwt')
const models = require('../database/models')

module.exports = {

    get_servers: async (req, res) => {
        logger.debug('get_servers()')
        let resp = await jwt.getUserFromJwt(req, res)
        if (resp.status > 400) return res.sendStatus(401)
        let servers = await models.Server.findAll();
        res.status(200).json(servers)
        res.end()
    },

    get_server: async (req, res) => {
        logger.debug('get_server()')
        let resp = await jwt.getUserFromJwt(req, res)
        if (resp.status > 400) return res.sendStatus(401)
        let server = await models.Server.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!server) res.sendStatus(404)
        res.status(200).json(server)
        res.end()
    },

    create_server: async (req, res) => {
        logger.debug('create_server()')
        let resp = await jwt.getUserFromJwt(req, res)
        if (resp.status > 400 || !resp.body.isAdmin) return res.sendStatus(401)
        if (!req.body.name || !req.body.path || !req.body.isProxy) return res.sendStatus(412)
        let server = await models.Server.create({
            name: req.body.name,
            path: req.body.path,
            isProxy: req.body.isProxy
        })
        res.status(201).json({
            message: 'Le serveur a bien été ajouté à la liste.',
            server: server
        })
        res.end()
    },

    update_server: async (req, res) => {
        logger.debug('update_server()')
        let resp = await jwt.getUserFromJwt(req, res)
        if (resp.status > 400 || !resp.body.isAdmin) return res.sendStatus(401)
        await models.Server.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        res.status(200).json({
            message: `Le serveur #${req.params.id} a bien été mis à jour.`
        })
        res.end()
    },

    delete_server: async (req, res) => {
        logger.debug('delete_server()')
        let resp = await jwt.getUserFromJwt(req, res)
        if (resp.status > 400 || !resp.body.isAdmin) return res.sendStatus(401)
        await models.Server.delete({
            where: {
                id: req.params.id
            }
        })
        res.status(200).json({
            message: `Le serveur #${req.params.id} a bien été supprimé.`
        })
        res.end()
    }

}
