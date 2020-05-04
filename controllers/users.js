const bcrypt = require('bcryptjs')

const logger = require('../helpers/logger')
const JWT = require('../helpers/jwt')
const models = require('../database/models')

module.exports = {

    /**
     * Get profile information
     *
     * @param req
     * @param res
     * @returns {Promise<*|Json|Format>}
     */
    get_profile: async (req, res) => {
        logger.debug('get_profile()')
        let response = await JWT.getUserFromJwt(req, res)
        return res.status(response.status).json(response.body)
    },

    /**
     * Update profile information
     *
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    update_profile: async (req, res) => {
        logger.debug('update_profile()')
        let response = await JWT.getUserFromJwt(req, res)
        if (response.statusCode >= 400) {
            return res.status(response.status).json(response.body)
        }
        if (req.body.newPassword && !bcrypt.compareSync(req.body.password, response.body.password)) {
            return res.status(412).json({
                error: 'Mot de passe invalide, vérifiez votre saisie.'
            })
        }
        await models.User.update({
            name: req.body.name ? req.body.name : response.body.name,
            email: req.body.email ? req.body.email : response.body.email,
            password: req.body.newPassword ? bcrypt.hashSync(req.body.newPassword, 10) : response.body.password
        }, {
            where: {
                Id: response.body.id
            }
        })
        return res.status(200).json({
            message: "Utilisateur mis à jour avec succès."
        })
    },

    /**
     * Connection to an account
     *
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    post_login: async (req, res) => {
        logger.debug('post_login()')
        if (req.body.username === undefined || req.body.password === undefined) {
            return res.status(412).json({
                error: 'Paramètres manquants (nom d\'utilisateur et/ou mot de passe).'
            })
        }
        let userFound = await models.User.findOne({ where: { name: req.body.username } }) || await models.User.findOne({ where: { email: req.body.username } })
        if (userFound === null) {
            return res.status(404).json({
                error: 'Utilisateur non trouvé.'
            })
        } else {
            let result = bcrypt.compareSync(req.body.password, userFound.password)
            if (!result) {
                return res.status(412).json({
                    error: 'Mot de passe invalide.'
                })
            } else {
                let token = await JWT.generateTokenForUser(userFound)
                return res.status(200).json({
                    token: token,
                    user: userFound
                })
            }
        }
    },

    /**
     * Register an account
     *
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    post_register: async (req, res) => {
        logger.debug('post_register()')
        if (req.body.name === undefined || req.body.email === undefined || req.body.password === undefined) {
            return res.status(412).json({
                error: 'Paramètres manquants (nom d\'utilisateur et/ou adresse e-mail et/ou mot de passe).'
            })
        }
        let nameFound = await models.User.findOne({
            where: {
                name: req.body.name
            }
        })
        let emailFound = await models.User.findOne({
            where: {
                email: req.body.email
            }
        })
        if (nameFound) {
            return res.status(412).json({
                error: 'Nom d\'utilisateur déjà existant.'
            })
        }
        if (emailFound) {
            return res.status(412).json({
                error: 'Adresse e-mail déjà associée.'
            })
        }
        if (!nameFound && !emailFound) {
            let hash = bcrypt.hashSync(req.body.password, 10)
            let user = await models.User.create({
                name: req.body.name,
                email: req.body.email,
                password: hash
            })
            return res.status(201).json({
                message: "Utilisateur créé avec succès.",
                user: user
            })
        }
    }

}