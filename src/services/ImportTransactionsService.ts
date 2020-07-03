import { getCustomRepository, getRepository, In } from 'typeorm';
// In do typeorm irá verificar se as categorias existem de uma vez só

import csvParse from 'csv-parse';
import fs from 'fs';

import Transaction from '../models/Transaction';
import CategoryModel from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface CsvTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

interface Category {
  title: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    // TODO

    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(CategoryModel);

    const contactsReadStream = fs.createReadStream(filePath);

    // configuração do formato do arquivo
    const parses = csvParse({
      delimiter: ',',
      from_line: 2,
    });

    const parseCsv = contactsReadStream.pipe(parses); // lê a linha

    const transactions: CsvTransaction[] = [];
    const categories: string[] = [];

    parseCsv.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      // Book insert -> processar os dados e inserir uma única vez no database

      categories.push(category);

      transactions.push({ title, type, value, category });
    });

    await new Promise(resolve => parseCsv.on('end', resolve));

    const existingCategories = await categoriesRepository.find({
      where: {
        title: In(categories),
      },
    });

    const existingCategoriesTitles = existingCategories.map(
      (category: Category) => category.title,
    );

    const addCategoriesTitles = categories
      .filter(category => !existingCategoriesTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(
      addCategoriesTitles.map(title => ({
        title,
      })),
    );

    await categoriesRepository.save(newCategories);

    const finalCategories = [...newCategories, ...existingCategories];

    const createdTransactions = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(category => category.title),
      })),
    );

    await transactionsRepository.save(createdTransactions);

    await fs.promises.unlink(filePath);

    return createdTransactions;

    // console.log(addCategoriesTitles);
    // console.log(categories);
    // console.log(transactions);

    // return { categories, transactions };

    // END TODO
  }
}

export default ImportTransactionsService;
