const logger = require('./logger')
const jwt = require('jsonwebtoken')
const models = require('../database/models')

module.exports = {

    /**
     * Generate JWT token for an user
     *
     * @param user
     * @returns {Promise<void>}
     */
    generateTokenForUser: async (user) => {
        logger.debug('generateTokenForUser()')
        return jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        })
    },

    /**
     * Get user ID from jwt token
     *
     * @param token
     * @returns {Promise<*>}
     */
    getUser: async (token) => {
        logger.debug('getUserId()')
        let user = null
        if (token != null) {
            try {
                let jwtToken = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET)
                if (jwtToken != null) {
                    user = jwtToken
                }
            } catch (err) {
                logger.error(err.message)
            }
        }
        return user
    },

    getUserFromJwt: async (req, res) => {
        logger.debug('getUserFromJwt()')
        if (!req.headers['authorization']) {
            return { status: 401, body: { error: "Authentification requise" }  }
        }
        let user = await module.exports.getUser(req.headers['authorization'])
        if (!user) {
            return { status: 401, body: { error: "Token invalide" }  }
        }
        let userFound = await models.User.findOne({
            where: {
                id: user.id
            }
        })
        if (!userFound) {
            return { status: 404, body: { error: "Utilisateur non trouvé" }  }
        }
        return { status: 200, body: user  }
    }

}
