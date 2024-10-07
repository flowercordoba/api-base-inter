import { Customer } from "src/features/customer/entities/customer.entity";
import { Invoice } from "src/features/invoices/entities/invoice.entity";
import { PaymentProvider } from "src/features/provider/entities/provider.entity";
import { PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Entity } from "typeorm";


export enum PaymentStatus {
  REJECT = 'REJECT',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
  PENDING = "PENDING",
}

@Entity('interbank') // Asegurarse de que la entidad esté correctamente decorada
export class Interbank {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  invoiceReference: string; // Renombrado para mayor claridad

  @Column({ length: 100 })
  customerReference: string; // Renombrado para mayor claridad

  @Column({ length: 100 })
  sessionId: string;  // Renombrado para mayor claridad

  @ManyToOne(() => Customer, (customer) => customer.payments, { eager: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => PaymentProvider, (provider) => provider.payments, { eager: true })
  @JoinColumn({ name: 'provider_id' })
  provider: PaymentProvider;

  @ManyToOne(() => Invoice, (invoice) => invoice.payments, { eager: true })
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @Column({ type: 'enum', enum: PaymentStatus })
  status: PaymentStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ default: '1123' }) // Agregamos el campo numberAgreement con un valor predeterminado
  numberAgreement: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
