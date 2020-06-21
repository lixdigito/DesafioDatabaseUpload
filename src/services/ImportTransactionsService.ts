import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

import CreateTransactionService from './CreateTransactionService';
import Transaction from '../models/Transaction';

class ImportTransactionsService {
  public async execute(filename: string ): Promise<Transaction[]> {
    

    const data = await this.loadCSV(filename);
    
    const transactions: Transaction[] = [];
    for(const line of data) {
      const createTransactionService = new CreateTransactionService();
        const title = line[0];
        const type = line[1];
        const value = Number(line[2]);
        const category = line[3];
        const newTransaction = await createTransactionService.execute({ title, type, value, category});
        if(newTransaction) {
          
          transactions.push(newTransaction);
        }
    }

    return transactions;
  }

  private async loadCSV(filePath: string): Promise<any[]> {
    const csvFilePath = path.resolve(__dirname,'..','..','tmp', filePath);
    const readCSVStream = fs.createReadStream(csvFilePath);
  
    const parseStream = csvParse({ 
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });
    
    const parseCSV = readCSVStream.pipe(parseStream);
  
    const lines: any[] = [];
  
    parseCSV.on('data', line => {
      lines.push(line);
    });
    
    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });
    
    return lines;
  }
}

export default ImportTransactionsService;
