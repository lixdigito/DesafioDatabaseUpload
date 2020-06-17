import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string,
  type: 'income' | 'outcome',
  value: number,
  category: string;
}

class CreateTransactionService {
  public async execute({ title, type, value, category} : Request): Promise<Transaction> {
    const transactionsRepository = new TransactionsRepository();    
    const categoriesRepository = getRepository(Category);
    const transactionRepository = getRepository(Transaction);
    const categoryExist = await categoriesRepository.findOne({ where: { title: category }});
    let category_id;

    if (type === 'outcome') {
      const {total} = await transactionsRepository.getBalance();
      if (value > total) throw new AppError('Total is insufficient for outcome.');
    }

    if(categoryExist) {
      category_id = categoryExist.id;
    } else {
      const newCategory = categoriesRepository.create({
        title: category
      });
      await categoriesRepository.save(newCategory);
      category_id = newCategory.id;
    }

    const newTransaction = transactionRepository.create({
      title,
      type,
      value,
      category_id
    });
    
    
    await transactionRepository.save(newTransaction);
    
    return newTransaction;
  }
}

export default CreateTransactionService;
