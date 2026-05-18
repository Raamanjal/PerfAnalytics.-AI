const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const auth = require('../middleware/authMiddleware');

// POST /api/employees - Add an employee
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, department, skills, performanceScore, experience } = req.body;
    
    let employee = await Employee.findOne({ email });
    if (employee) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }

    if (performanceScore === undefined || performanceScore === null) {
      return res.status(400).json({ message: 'Performance score is required' });
    }

    employee = new Employee({
      name, email, department, skills, performanceScore, experience
    });

    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/employees - Get all employees
router.get('/', auth, async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/employees/search - Search/Filter employees
router.get('/search', auth, async (req, res) => {
  try {
    const { department, minScore } = req.query;
    let query = {};
    if (department) {
      query.department = { $regex: new RegExp(department, 'i') };
    }
    if (minScore) {
      query.performanceScore = { $gte: Number(minScore) };
    }
    
    const employees = await Employee.find(query);
    res.json(employees);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE /api/employees/:id - Delete an employee
router.delete('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    await employee.deleteOne();
    res.json({ message: 'Employee removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
