const mongoose = require('mongoose');

const locationHistorySchema = new mongoose.Schema({
  location: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const generateContainerId = () => {
  const prefix = 'SHIP';
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}-${random}-${timestamp}`;
};

const generateContainerPath = (containerId) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}/${containerId}`;
};

const shipmentSchema = new mongoose.Schema({
  containerId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    default: generateContainerId
  },
  containerPath: {
    type: String,
    unique: true,
    trim: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true
  },
  departureLocation: {
    type: String,
    required: true,
    trim: true
  },
  destinationLocation: {
    type: String,
    required: true,
    trim: true
  },
  currentLocation: {
    type: String,
    required: true,
    trim: true
  },
  departureDate: {
    type: Date,
    required: true
  },
  eta: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Transit', 'Delayed', 'Delivered', 'On Hold'],
    default: 'Pending'
  },
  shipmentType: {
    type: String,
    enum: ['Standard', 'Express', 'Priority', 'Economy'],
    default: 'Standard'
  },
  weight: {
    type: String,
    required: true
  },
  dimensions: {
    type: String,
    required: true
  },
  description: String,
  specialInstructions: String,
  locationHistory: [locationHistorySchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate containerId and containerPath before saving
shipmentSchema.pre('save', async function(next) {
  try {
    if (!this.containerId) {
      this.containerId = generateContainerId();
    }
    
    // Always generate containerPath based on containerId
    this.containerPath = generateContainerPath(this.containerId);
    
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Shipment', shipmentSchema); 