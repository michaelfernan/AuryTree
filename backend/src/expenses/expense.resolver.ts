import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ExpenseService } from './expense.service';
import { CreateExpenseInput } from './dto/expense.input';
import { Expense } from './expense.entity';
import { normalizeDates } from 'src/common/normalize-dates';

@Resolver(() => Expense)
export class ExpenseResolver {
  constructor(private readonly svc: ExpenseService) {}

  @Query(() => [Expense], { name: 'expenses' })
  async expenses(@Args('companyId', { type: () => ID }) companyId: string) {
    const data = await this.svc.findAll(companyId);

    // 🔧 Converte strings em Date antes de retornar
    return data.map((e) =>
      normalizeDates(e, ['dueDate', 'paidAt', 'createdAt'])
    );
  }

  @Mutation(() => Expense, { name: 'createExpense' })
  async createExpense(@Args('input') input: CreateExpenseInput) {
    const payload = {
      ...input,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      paidAt: input.paidAt ? new Date(input.paidAt) : null,
    };

    return this.svc.create(payload);
  }
}
