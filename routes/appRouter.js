const express = require('express');
const {addIntent,getAllIntents,getIntentsByCategory} = require('../controller/appController')

const router = express.Router()

router.route('/add').post(addIntent);
router.route('/getAll').get(getAllIntents);
router.route('/getByCategory').get(getIntentsByCategory);


module.exports = router;