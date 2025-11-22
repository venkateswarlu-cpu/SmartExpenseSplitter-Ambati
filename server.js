import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err))

// Schemas
const groupSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
})

const expenseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  createdAt: { type: Date, default: Date.now },
})

// Models
const Group = mongoose.model('Group', groupSchema)
const Expense = mongoose.model('Expense', expenseSchema)

// Seed groups (adds missing groups without deleting existing ones)
const defaultGroups = [
  'Trips',
  'Household',
  'Outing',
  'Children Fee',
  'Savings',
  'EMI',
  'Loan'
]

const seedGroups = async () => {
  try {
    for (const groupName of defaultGroups) {
      const exists = await Group.findOne({ name: groupName })
      if (!exists) {
        await Group.create({ name: groupName })
        console.log(`Group added: ${groupName}`)
      }
    }
  } catch (err) {
    console.error('Error seeding groups:', err)
  }
}

seedGroups()

// Routes

// Get all groups
app.get('/api/groups', async (req, res) => {
  try {
    const groups = await Group.find().sort({ name: 1 })
    res.json(groups)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get all expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find().populate('group').sort({ createdAt: -1 })
    res.json(expenses)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Add a new expense
app.post('/api/expenses', async (req, res) => {
  try {
    const { name, amount, group } = req.body
    if (!name || !amount || !group) {
      return res.status(400).json({ error: 'Please provide name, amount, and group' })
    }
    const expense = new Expense({ name, amount, group })
    await expense.save()
    const populatedExpense = await Expense.findById(expense._id).populate('group')
    res.status(201).json(populatedExpense)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
