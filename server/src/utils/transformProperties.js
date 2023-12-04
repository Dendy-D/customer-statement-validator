function transformProperties(transaction, type) {
    let reference
    let startBalance
    let mutation
    let endBalance

    if (type === 'csv') {
      reference = transaction.Reference;
      startBalance = parseFloat(transaction['Start Balance']);
      mutation = parseFloat(transaction.Mutation);
      endBalance = parseFloat(transaction['End Balance']);
    }

    if (type === 'xml') {
      reference = transaction.reference;
      startBalance = parseFloat(transaction.startBalance);
      mutation = parseFloat(transaction.mutation);
      endBalance = parseFloat(transaction.endBalance);
    }

    return { reference, startBalance, mutation, endBalance }; 
}

export default transformProperties;
