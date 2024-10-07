import { Customer } from 'src/features/customer/entities/customer.entity';
import { Interbank } from 'src/features/integrations/interbank/entities/interbank.entity';
import { User } from 'src/features/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('providers')
export class PaymentProvider  {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @OneToMany(() => Interbank, (payment) => payment.provider)
  payments: Interbank[];

  @Column({ default: 'active' })
  status: string;

  @Column()
  type: string; // Puede ser 'bank', 'person', 'company'


  @Column({ unique: true, nullable: true })
  @Exclude()  
  privateKey: string;

  @Column({ nullable: true })
  @Exclude()  
  accessKey: string;

  @OneToMany(() => Customer, (customer) => customer.provider)
  customers: Customer[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ unique: true, length: 20, nullable: true })
  accountNumber: string;

  @Column({ nullable: true })
  webhookUrl: string;

  @Column({ type: 'decimal', default: 0, nullable: false })
  availableFunds: number;

  @UpdateDateColumn()
  updatedAt: Date;

  // 
  @ManyToOne(() => User, { nullable: true })
  @Exclude()  // Excluye createdBy de la serialización

  createdBy: User;
  
}
