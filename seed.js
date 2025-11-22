import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

// Replace with your MongoDB URI in .env
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/expense_splitter'

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err))

// Define Mongoose Schemas
const groupSchema = new mongoose.Schema({
  name: String
})

const expenseSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' }
})

const Group = mongoose.model('Group', groupSchema)
const Expense = mongoose.model('Expense', expenseSchema)

// Seed Data
const seedData = async () => {
  await Group.deleteMany()
  await Expense.deleteMany()

  const groups = await Group.insertMany([
    { name: 'Trip to Goa' },
    { name: 'Household' },
    { name: 'Friends Outing' }
  ])

  await Expense.insertMany([
    { name: 'Hotel', amount: 1200, group: groups[0]._id },
    { name: 'Groceries', amount: 500, group: groups[1]._id },
    { name: 'Dinner', amount: 800, group: groups[2]._id }
  ])

  console.log('Database seeded!')
  mongoose.connection.close()
}

seedData()
