import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceInput } from './dto/invoice.input';
import { Invoice } from './invoice.entity';
import { normalizeDates } from 'src/common/normalize-dates';

@Resolver(() => Invoice)
export class InvoiceResolver {
  constructor(private readonly svc: InvoiceService) {}

  @Query(() => [Invoice], { name: 'invoices' })
  async invoices(@Args('companyId', { type: () => ID }) companyId: string) {
    const data = await this.svc.findAll(companyId);

    // 🔧 Garante que issueDate é Date antes de enviar ao GraphQL
    return data.map((i) => normalizeDates(i, ['issueDate', 'createdAt']));
  }

  @Mutation(() => Invoice, { name: 'createInvoice' })
  async createInvoice(@Args('input') input: CreateInvoiceInput) {
    const payload = {
      ...input,
      issueDate: input.issueDate ? new Date(input.issueDate) : new Date(),
    };

    return this.svc.create(payload);
  }
}
