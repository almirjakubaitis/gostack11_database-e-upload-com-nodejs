import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // TODO
    const transactionsRepository = await this.find({
      select: ['value', 'type'],
    });

    // Outro jeito de fazer é rodar uma query builder usando GetRepository
    //
    // const transactionsRepository = await getRepository(Transaction)
    //   .createQueryBuilder()
    //   .select(['value', 'type'])
    //   .getRawMany();

    // console.log(transactionsRepository);

    const income = transactionsRepository.reduce((accumulator, current) => {
      if (current.type === 'income') {
        return accumulator + current.value;
      }
      return accumulator;
    }, 0);
    const outcome = transactionsRepository.reduce((accumulator, current) => {
      if (current.type === 'outcome') {
        return accumulator + current.value;
      }
      return accumulator;
    }, 0);
    const total = income - outcome;
    const balance = {
      income,
      outcome,
      total,
    };
    return balance;
    // END TODO
  }
}

export default TransactionsRepository;
