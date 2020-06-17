import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getTransactions(): Promise<Transaction[]> {
    const transactionRepository = getRepository(Transaction);
    const transactions = await transactionRepository.find({});
    return transactions;
  }

  public async getBalance(): Promise<Balance> {
    const transactions = await this.getTransactions();
    const income = this.reduceValueByType(transactions, 'income');
    const outcome = this.reduceValueByType(transactions, 'outcome');
    const total = income - outcome;

    return {income, outcome, total};
  }

  private reduceValueByType(transactions : Transaction[], type: 'income' | 'outcome') : number {
    return transactions.reduce((accumulator, currentValue) => {
      if (currentValue.type === type) return accumulator += currentValue.value;
      return accumulator;
    }, 0);
  }
}

export default TransactionsRepository;
