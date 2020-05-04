const router = require('express').Router()

let controller = require('../controllers/users')

router.get('/me', controller.get_profile)
router.put('/me', controller.update_profile)
router.post('/login', controller.post_login)
router.post('/register', controller.post_register)

module.exports = router
