const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide the lead name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide a valid contact phone number'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please provide a valid email address',
      ],
    },
    requirement: {
      type: String,
      required: [true, 'Please provide the reactivation requirement details'],
      trim: true,
      maxlength: [1000, 'Requirement description cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

// Optional index for quick sorting by newest leads
leadSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Lead', leadSchema);
