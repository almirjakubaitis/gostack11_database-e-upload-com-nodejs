import { getCustomRepository, getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import CategoryModel from '../models/Category';

import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

interface Category {
  id: string;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    // TODO
    const categoryRepository = getRepository(CategoryModel);

    const checkCategoryExists = await categoryRepository.findOne({
      title: category,
    });

    if (!checkCategoryExists) {
      const categoryCreate = categoryRepository.create({
        title: category,
      });
      await categoryRepository.save(categoryCreate);

      const categoryNewName = await categoryRepository.findOne({
        where: { name: category },
      });

      const { id } = categoryNewName as Category;

      const transactionsRepository = getCustomRepository(TransactionRepository);

      const transaction = transactionsRepository.create({
        title,
        value,
        type,
        category_id: id,
      });

      const total = transactionsRepository.getBalance();

      if (type === 'outcome' && value > (await total).total) {
        throw new AppError('Não há saldo suficiente');
      } else {
        await transactionsRepository.save(transaction);
        return transaction;
      }
    }
    const { id } = checkCategoryExists as Category;
    // Pode-se Chamar a variável sem retornar undefined como abaixo:
    // const category_id = checkCategoryExists?.id;

    // console.log(checkCategoryExists);

    const transactionsRepository = getCustomRepository(TransactionRepository);

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: id,
    });

    const total = transactionsRepository.getBalance();

    if (type === 'outcome' && value > (await total).total) {
      throw new AppError('Não há saldo suficiente');
    } else {
      await transactionsRepository.save(transaction);
      return transaction;
    }

    // END TODO
  }
}

export default CreateTransactionService;
