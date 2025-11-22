import Expense from "../models/Expense.js";
import Group from "../models/groupModel.js";

export const addExpense = async (req, res) => {
  const { title, amount, paidBy, participants, group } = req.body;
  try {
    const expense = await Expense.create({ title, amount, paidBy, participants, group });
    // Add expense to group
    const grp = await Group.findById(group);
    grp.expenses.push(expense._id);
    await grp.save();

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getExpensesByGroup = async (req, res) => {
  try {
    const expenses = await Expense.find({ group: req.params.groupId })
      .populate("paidBy participants", "name email");
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
