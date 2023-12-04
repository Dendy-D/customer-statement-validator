import transformProperties from './transformProperties.js';

function preprocessData(transactions, type) {
  const map = new Map();

  for (let transaction of transactions) {
    const { reference, startBalance, mutation, endBalance } = transformProperties(transaction, type);
    
    const newRepresentationOfTransaction = {
      reference,
      startBalance,
      mutation,
      endBalance,
    }

    if (map.has(reference)) {
      map.set(reference, [...map.get(reference), newRepresentationOfTransaction]);
    } else {
      map.set(reference, [newRepresentationOfTransaction])
    }
  }

  return map;
}

export default preprocessData;
