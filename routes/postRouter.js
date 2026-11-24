const router = require('express').Router();
const { createPost, getOnePost  } = require('../controllers/postcontroller.js');
const upload = require('../middleware/multer.js');

router.post('/createPost/:userid', upload.array('media', 15), createPost)
router.get('/getOnePost/:id', getOnePost)


module.exports = router