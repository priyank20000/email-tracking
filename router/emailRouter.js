const app = require('express');
const { createEmail, trackEmail } = require('../controller/emailTracking');

const router = app.Router()


router.post('/CreateEmail', createEmail )
router.get('/TrackEmail', trackEmail )


module.exports  = router;