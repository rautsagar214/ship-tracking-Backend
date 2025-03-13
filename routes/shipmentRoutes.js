const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment');
const auth = require('../middleware/auth');

// Get all shipments (protected route)
router.get('/', auth, async (req, res) => {
  try {
    const shipments = await Shipment.find().sort({ createdAt: -1 });
    res.json(shipments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Track shipment by container ID (public route)
router.get('/track/:containerId', async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ containerId: req.params.containerId });
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new shipment (protected route)
router.post('/', auth, async (req, res) => {
  try {
    console.log('Received shipment data:', req.body);

    // Create new shipment instance without containerId and containerPath
    const shipment = new Shipment({
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      customerPhone: req.body.customerPhone,
      departureLocation: req.body.departureLocation,
      destinationLocation: req.body.destinationLocation,
      currentLocation: req.body.currentLocation,
      departureDate: req.body.departureDate,
      eta: req.body.eta,
      status: req.body.status,
      shipmentType: req.body.shipmentType,
      weight: req.body.weight,
      dimensions: req.body.dimensions,
      description: req.body.description,
      specialInstructions: req.body.specialInstructions,
      locationHistory: [{
        location: req.body.currentLocation
      }]
    });

    console.log('Created shipment object:', shipment);
    
    // Save the shipment - containerId and containerPath will be generated in pre-save middleware
    const newShipment = await shipment.save();
    console.log('Saved shipment:', newShipment);
    
    res.status(201).json(newShipment);
  } catch (error) {
    console.error('Error creating shipment:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update shipment status (protected route)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    shipment.status = req.body.status;
    shipment.lastUpdated = new Date();
    
    const updatedShipment = await shipment.save();
    res.json(updatedShipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update shipment location (protected route)
router.patch('/:id/location', auth, async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    shipment.currentLocation = req.body.location;
    shipment.locationHistory.push({
      location: req.body.location
    });
    shipment.lastUpdated = new Date();
    
    const updatedShipment = await shipment.save();
    res.json(updatedShipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 