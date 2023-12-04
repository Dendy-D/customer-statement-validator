function transactionValidation(mapOfTransactions, type) {
  const mapOfTransactionsValues = [...mapOfTransactions.values()];

  const transactionsForReport = [];

  const descriptionValues = {
    uniqueness: "The reference doesn't unique",
    endBalance: "The end balance isn't correct"
  }

  for (let arrOfTransactions of mapOfTransactionsValues) {
    if (arrOfTransactions.length > 1) {
      const failedTransaction = {
        reference: arrOfTransactions[0].reference,
        description: descriptionValues.uniqueness,
      }
      transactionsForReport.push(failedTransaction);
      continue;
    }

    let { startBalance, mutation, endBalance } = arrOfTransactions[0];
    
    let actualEndBalance = startBalance + mutation;

    if (actualEndBalance !== endBalance) {
      const failedTransaction = {
        reference: arrOfTransactions[0].reference,
        description: descriptionValues.endBalance,
      }
      transactionsForReport.push(failedTransaction);
    }
  }

  return transactionsForReport;
}

export default transactionValidation;
