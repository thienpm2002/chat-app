const express = require('express');
const router = express.Router();
const {isAuth,refreshToken} = require('../helpers/middlewares.js');
const {homePage,contactPage,teamPage,joinTeamPage} = require('../controllers/page.controller.js');

router.use('/api',isAuth,refreshToken);

router.get('/api/home',homePage)
 
router.get('/api/contact',contactPage);

router.get('/api/team',teamPage)

router.get('/api/join-team',joinTeamPage);

module.exports = router;  