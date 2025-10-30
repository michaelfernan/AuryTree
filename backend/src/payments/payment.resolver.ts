// payments/payment.resolver.ts
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Payment } from './payment.entity';
import { PaymentService } from './payment.service';
import { CreatePaymentInput, UpdatePaymentInput } from './dto/payment.input';

function toDateOrNull(v?: string | Date | null): Date | null {
  if (!v) return null;
  if (v instanceof Date) return v;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

@Resolver(() => Payment)
export class PaymentResolver {
  constructor(private readonly svc: PaymentService) {}

  @Query(() => [Payment])
  payments(@Args('companyId', { type: () => ID }) companyId: string) {
    return this.svc.findAllByCompany(companyId);
  }

  @Query(() => Payment, { nullable: true })
  payment(@Args('id', { type: () => ID }) id: string) {
    return this.svc.findOne(id);
  }

  @Mutation(() => Payment)
  createPayment(@Args('input') input: CreatePaymentInput) {
    const payload = {
      ...input,
      paidAt: toDateOrNull(input.paidAt), // <-- conversão
    };
    return this.svc.create(payload);
  }

  @Mutation(() => Payment)
  updatePayment(@Args('input') input: UpdatePaymentInput) {
    const { id, ...patch } = input;
    const payload = {
      ...patch,
      paidAt: toDateOrNull(patch.paidAt), // <-- conversão
    };
    return this.svc.update(id, payload);
  }

  @Mutation(() => Boolean)
  deletePayment(@Args('id', { type: () => ID }) id: string) {
    return this.svc.delete(id);
  }
}
