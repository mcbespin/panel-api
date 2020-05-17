const router = require('express').Router()

let controller = require('../controllers/users')

// Auth routes
router.get('/me', controller.get_profile)
router.put('/me', controller.update_profile)
router.post('/login', controller.post_login)

// User routes
router.get('/', controller.get_users)
router.post('/', controller.create_user)
router.put('/:id', controller.update_user)
router.delete('/:id', controller.delete_user)

module.exports = router
