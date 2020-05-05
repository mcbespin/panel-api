const router = require('express').Router()

let controller = require('../controllers/servers')

router.get('/', controller.get_servers)
router.get('/:id', controller.get_server)
router.post('/', controller.create_server)
router.put('/:id', controller.update_server)
router.delete('/:id', controller.delete_server)

module.exports = router
