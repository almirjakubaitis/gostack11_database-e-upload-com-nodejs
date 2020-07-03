import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    // TODO
    const transactionsRepository = getRepository(Transaction);

    const checkTransactionExists = await transactionsRepository.findOne({
      where: { id },
    });

    if (!checkTransactionExists) {
      throw new AppError('Transaction not found', 400);
    } else {
      await transactionsRepository
        .createQueryBuilder()
        .delete()
        .where('id = :id', { id })
        .execute();

      // Poderia ser assim também:
      // import TransactionsRepository from '../repositories/TransactionsRepository';

      // public async execute(id: string): Promise<void> {
      // const transactionsRepository = getCustomRepository(TransactionsRepository);
      // const checkTransactionExists = await transactionsRepository.findOne(id);
      // await transactionsRepository.remove(checkTransactionExists);
    }
    // END TODO
  }
}

export default DeleteTransactionService;
