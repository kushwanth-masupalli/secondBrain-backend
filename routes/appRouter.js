const express = require('express');
const {addIntent,getAllIntents,getIntentsByCategory,getIntentsOnOrBeforeDate,deleteById} = require('../controller/appController')

const router = express.Router()

router.route('/add').post(addIntent); 
router.route('/getAll').get(getAllIntents);
router.route('/getByCategory').post(getIntentsByCategory);
router.route('/getByDate').post(getIntentsOnOrBeforeDate);
router.route('/:id').delete(deleteById)

module.exports = router;