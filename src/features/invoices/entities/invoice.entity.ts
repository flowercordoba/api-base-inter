import { Customer } from 'src/features/customer/entities/customer.entity';
import { Interbank } from 'src/features/integrations/interbank/entities/interbank.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, (customer) => customer.invoices, { eager: true })
  customer: Customer;



  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  amount: number;  // Monto de la factura

  @Column()
  description: string;  // Descripción del producto o servicio

  @Column()
  issueDate: Date;  // Fecha de emisión de la factura

  @Column()
  dueDate: Date;  // Fecha de vencimiento de la factura

  @Column({ default: 'pending' })
  status: string;  // Estado de la factura (e.g., 'pending', 'paid', 'overdue')

  @Column({ default: '1232' })
  numberAgreement: string;  // Número de convenio fijo

  @Column({ length: 15, unique: true })
  paymentReference: string;  // Referencia de pago generada automáticamente (5 dígitos)

  @Column()
  paymentLink: string;  // Link de pago generado

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  pdfUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  clientName: string;

  @OneToMany(() => Interbank, (payment) => payment.invoice)
  payments: Interbank[];
}
