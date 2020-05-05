const router = require('express').Router()

let controller = require('../controllers/actions')

router.get('/status/:id', controller.status_server)
router.get('/logs/:id', controller.logs_server)
router.post('/start/:id', controller.start_server)
router.post('/stop/:id', controller.stop_server)
router.post('/command/:id', controller.command_server)

module.exports = router
