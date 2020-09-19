const express = require (`express`)
const router = express.Router()
const categoryController = require(`../controllers/categoryController`)

router.get('/:category', categoryController.getProductByCategory)

module.exports = router