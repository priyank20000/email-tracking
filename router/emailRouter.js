const app = require('express');
const { createEmail, trackEmail, index, emailDelet, status, getEmail } = require('../controller/emailTracking');

const router = app.Router()

router.get('/', index)
router.get('/status', status)

router.post('/send', createEmail )
router.get('/getEmail', getEmail )
router.get('/track', trackEmail )
router.get('/delete-email/:id', emailDelet )


module.exports  = router;