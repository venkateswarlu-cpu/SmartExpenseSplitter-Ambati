export const calculateSettlements = (expenses) => {
  // This is a simple example; real logic can minimize transactions
  const balances = {};

  expenses.forEach((exp) => {
    const split = exp.amount / exp.participants.length;
    exp.participants.forEach((p) => {
      if (!balances[p._id]) balances[p._id] = 0;
      balances[p._id] -= split;
    });
    balances[exp.paidBy._id] += exp.amount;
  });

  return balances; // userId => balance (+ve means owed)
};
