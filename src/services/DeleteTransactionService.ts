import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getRepository(Transaction);
    const transactionExist = await transactionsRepository.findOne({ where: { id }});

    if (!transactionExist) {
      throw new AppError('Transaction not registered.');
    }

    await transactionsRepository.remove(transactionExist);
  }
}

export default DeleteTransactionService;
