const mongoose = require('mongoose');
const Lead = require('../models/Lead');
const { getIsConnected } = require('../config/db');

// In-memory fallback store for offline/local development without local mongod
const inMemoryStore = [];

/**
 * Generate a valid 24-character hexadecimal ObjectId string
 */
const generateMockId = () => {
  return new mongoose.Types.ObjectId().toString();
};

/**
 * @desc    Create a new lead
 * @route   POST /api/leads
 * @access  Public
 */
const createLead = async (req, res) => {
  try {
    const { name, phone, email, requirement } = req.body;

    // Validate required fields
    if (!name || !phone || !email || !requirement) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, phone, email, and requirement',
      });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Check if connected to real MongoDB
    if (getIsConnected()) {
      const newLead = await Lead.create({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        requirement: requirement.trim(),
      });

      return res.status(201).json({
        success: true,
        message: 'Lead captured successfully!',
        data: newLead,
      });
    }

    // In-memory fallback mode
    const now = new Date();
    const mockLead = {
      _id: generateMockId(),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      requirement: requirement.trim(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    inMemoryStore.unshift(mockLead);

    return res.status(201).json({
      success: true,
      message: 'Lead captured successfully! (Saved to Active Store)',
      data: mockLead,
    });
  } catch (error) {
    console.error('Error in createLead:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while creating lead. Please try again later.',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all leads sorted by newest first
 * @route   GET /api/leads
 * @access  Public / Admin
 */
const getLeads = async (req, res) => {
  try {
    if (getIsConnected()) {
      const leads = await Lead.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: leads.length,
        data: leads,
      });
    }

    // In-memory fallback
    return res.status(200).json({
      success: true,
      count: inMemoryStore.length,
      data: [...inMemoryStore].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    });
  } catch (error) {
    console.error('Error in getLeads:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching leads',
      error: error.message,
    });
  }
};

/**
 * @desc    Get single lead by ID
 * @route   GET /api/leads/:id
 * @access  Public / Admin
 */
const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Lead ID format',
      });
    }

    if (getIsConnected()) {
      const lead = await Lead.findById(id);
      if (!lead) {
        return res.status(404).json({
          success: false,
          message: `Lead not found with ID: ${id}`,
        });
      }
      return res.status(200).json({
        success: true,
        data: lead,
      });
    }

    // In-memory fallback
    const lead = inMemoryStore.find((l) => l._id.toString() === id.toString());
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: `Lead not found with ID: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error('Error in getLeadById:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving lead',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete a lead by ID
 * @route   DELETE /api/leads/:id
 * @access  Admin
 */
const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Lead ID format',
      });
    }

    if (getIsConnected()) {
      const lead = await Lead.findByIdAndDelete(id);
      if (!lead) {
        return res.status(404).json({
          success: false,
          message: `Lead not found with ID: ${id}`,
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Lead deleted successfully',
        data: { id: lead._id },
      });
    }

    // In-memory fallback
    const index = inMemoryStore.findIndex((l) => l._id.toString() === id.toString());
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Lead not found with ID: ${id}`,
      });
    }

    const removed = inMemoryStore.splice(index, 1)[0];
    return res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
      data: { id: removed._id },
    });
  } catch (error) {
    console.error('Error in deleteLead:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting lead',
      error: error.message,
    });
  }
};

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  deleteLead,
};
