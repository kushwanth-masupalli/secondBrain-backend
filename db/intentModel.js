const mongoose = require('mongoose');

const intentSchema = new mongoose.Schema(
  {
    intent: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      default: `${Date.now}`,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

module.exports = mongoose.model('Intent', intentSchema);
