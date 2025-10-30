import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';

// 🧩 Função utilitária segura para converter string → Date | null
function toDateOrNull(v?: string | Date | null): Date | null {
  if (!v) return null;
  if (v instanceof Date) return v;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

@Injectable()
export class PaymentService {
  constructor(@InjectRepository(Payment) private repo: Repository<Payment>) {}

  findAllByCompany(companyId: string) {
    return this.repo.find({ where: { companyId } });
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  create(input: Partial<Payment>) {
    const payload: Partial<Payment> = {
      ...input,
      paidAt: toDateOrNull(input.paidAt as any),
    };
    const entity = this.repo.create(payload);
    return this.repo.save(entity);
  }

  async update(id: string, patch: Partial<Payment>) {
    const payload: Partial<Payment> = {
      ...patch,
      paidAt: toDateOrNull(patch.paidAt as any),
    };
    await this.repo.update({ id }, payload);
    return this.findOne(id);
  }

  async delete(id: string) {
    await this.repo.delete({ id });
    return true;
  }
}
