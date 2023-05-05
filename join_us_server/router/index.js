const express = require("express")
const router = express.Router()

router.use(require("./position_type"))
router.use(require("./company"))
router.use(require("./collect"))
router.use(require("./hr"))
router.use(require("./position"))
router.use(require("./resume"))
router.use(require("./userInfo"))
router.use(require("./send"))
router.use('/upload',require("./upload"))

module.exports = router