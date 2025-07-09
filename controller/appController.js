const Intent = require('../db/intentModel');
const asyncHandler = require('express-async-handler');
const getIntentFromLLM = require('../llm_output');

// POST /api/intents
const addIntent = asyncHandler(async (req, res) => {
    const { input } = req.body;
    if (!input) {
        res.status(400);
        throw new Error("Input is required");
    }

    console.log("User Input:", input);

    const llm_out = await getIntentFromLLM(input);
    if (!llm_out) {
        res.status(400);
        throw new Error("LLM returned no output");
    }

    const savedIntent = await Intent.create(llm_out);
    console.log("Saved:", savedIntent);

    res.status(201).json(savedIntent);
});

// GET /api/intents
const getAllIntents = asyncHandler(async (req, res) => {
    const intents = await Intent.find();
    res.json(intents);
});

// GET /api/intents/category
const getIntentsByCategory = asyncHandler(async (req, res) => {
    const { intent } = req.body;
    if (!intent) {
        res.status(400);
        throw new Error("Intent category is required");
    }

    const listintents = await Intent.find({ intent });
    if (listintents.length === 0) {
        res.status(404);
        throw new Error("No intents found for this category");
    }

    res.json(listintents);
});





const getIntentsOnOrBeforeDate = asyncHandler(async (req, res) => {
  const { date } = req.body;
  if (!date) {
    res.status(400);
    throw new Error('Date is required in dd/mm/yyyy format');
  }

  // Validate input date format dd/mm/yyyy
  const [day, month, year] = date.split('/');
  if (!day || !month || !year) {
    res.status(400);
    throw new Error('Invalid date format, expected dd/mm/yyyy');
  }
  const inputDate = new Date(`${year}-${month}-${day}T23:59:59.999Z`);
  if (isNaN(inputDate)) {
    res.status(400);
    throw new Error('Invalid date');
  }

  const intents = await Intent.aggregate([
    {
      $addFields: {
        convertedDate: {
          $dateFromString: {
            dateString: {
              $concat: [
                { $substrBytes: ['$date', 6, 4] }, // year yyyy
                '-',
                { $substrBytes: ['$date', 3, 2] }, // month mm
                '-',
                { $substrBytes: ['$date', 0, 2] }, // day dd
              ],
            },
            format: '%Y-%m-%d',
          },
        },
      },
    },
    {
      $match: {
        convertedDate: { $lte: inputDate },
      },
    },
    {
      $sort: { convertedDate: -1 },
    },
  ]);

  res.json(intents);
});


const deleteById =asyncHandler(async(req,res)=>{
     const {id} = req.params;
     const intent = await Intent.findByIdAndDelete(id);
     res.json(intent);

}
);

module.exports = {
    addIntent,
    getIntentsByCategory,
    getAllIntents,
    getIntentsOnOrBeforeDate,
    deleteById
};
