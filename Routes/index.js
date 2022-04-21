const services = require('../services/index')
const {upload} = require('../middlewares/upload')
const express = require('express')
const router = express.Router()

router.get('/',services.temp)
router.post('/register',upload.single('file'),services.register)
router.get('/getimg/:id',services.getImg)
// router.post('/like',services.like)
router.get('/getdata',services.getData)
router.get('/posts/:id',services.getPostData)
router.post('/sendmail',services.sendMail)
router.post('/verifyotp',services.verifyotp)
router.get('/likedid',services.likedId)
// router.post('/unlike',services.unlike)

module.exports = router;