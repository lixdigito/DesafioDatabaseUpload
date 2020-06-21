import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = new TransactionsRepository();
  const transactions = await transactionsRepository.getTransactions();
  const balance = await transactionsRepository.getBalance();
  return response.status(200).json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const createTransactionService = new CreateTransactionService();
  const { title, type, value, category} = request.body;
  const newTransaction = await createTransactionService.execute({ title, type, value, category});

  return response.status(201).json(newTransaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteTransactionService = new DeleteTransactionService();
  await deleteTransactionService.execute(id);
  response.status(204).send();
});

transactionsRouter.post('/import', upload.single('file') ,async (request, response) => {
  const importTransactionsService = new ImportTransactionsService();
  const { filename } = request.file;
  const transactions = await importTransactionsService.execute(filename);
  return response.status(201).json(transactions);
});

export default transactionsRouter;
