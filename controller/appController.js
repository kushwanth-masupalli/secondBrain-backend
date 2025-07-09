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

module.exports = {
    addIntent,
    getIntentsByCategory,
    getAllIntents
};
