import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('seed_data')
export class SeedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
userBalance: number;

@Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
bankAccountBalance: number;

@Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
cardLimit: number;

@Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
transactionAmount: number;

@Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
invoiceAmount: number;

@Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
paymentAmount: number;

@Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
loanAmount: number;

@Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
loanInterestRate: number;


  // User fields
  @Column({ nullable: true })
  userName: string;

  @Column({ nullable: true })
  userEmail: string;

  @Column({ nullable: true })
  userPhoneNumber: string;

  @Column({ nullable: true })
  userAddress: string;

  @Column({ nullable: true })
  userRole: string;



  @Column({ nullable: true })
  userAccountNumber: string;

  @Column({ nullable: true })
  userStatus: string;

  @Column({ nullable: true })
  userIdNumber: string;  // ID document number

  @Column({ nullable: true })
  userTaxNumber: string; // Tax Identification Number (TIN)

  @Column({ nullable: true })
  userBankBranch: string;  // Associated bank branch

  // Bank Account fields
  @Column({ nullable: true })
  bankAccountNumber: string;

  @Column({ nullable: true })
  bankAccountType: string; // e.g., Savings, Checking



  @Column({ nullable: true })
  bankAccountStatus: string;

  @Column({ nullable: true })
  bankAccountCurrency: string;  // e.g., USD, EUR, COP

  // Credit/Debit Card fields
  @Column({ nullable: true })
  cardNumber: string;

  @Column({ nullable: true })
  cardType: string;  // e.g., Credit, Debit

  @Column({ nullable: true })
  cardStatus: string;

  @Column({ nullable: true })
  cardExpiryDate: Date;



  @Column({ nullable: true })
  cardCVV: string;  // Card verification value

  // Transaction fields


  @Column({ nullable: true })
  transactionType: string;  // e.g., Withdrawal, Deposit, Transfer

  @Column({ nullable: true })
  transactionReference: string;  // Random generated reference number

  @Column({ nullable: true })
  transactionStatus: string;  // e.g., Pending, Completed, Failed

  @Column({ nullable: true })
  transactionDate: Date;

  @Column({ nullable: true })
  transactionCurrency: string;

  @Column({ nullable: true })
  transactionChannel: string; // e.g., ATM, Online, Branch

  // Invoice fields


  @Column({ nullable: true })
  invoiceDueDate: Date;

  @Column({ nullable: true })
  invoiceStatus: string;  // e.g., Paid, Pending, Overdue

  @Column({ nullable: true })
  invoiceReference: string;

  @Column({ nullable: true })
  invoiceIssuedDate: Date;

  @Column({ nullable: true })
  invoiceCurrency: string;

  // Payment fields


  @Column({ nullable: true })
  paymentStatus: string;

  @Column({ nullable: true })
  paymentDate: Date;

  @Column({ nullable: true })
  paymentMethod: string; // e.g., Credit Card, Bank Transfer, Cash

  @Column({ nullable: true })
  paymentCurrency: string;

  @Column({ nullable: true })
  paymentReference: string; // Payment reference code

  @Column({ nullable: true })
  paymentConvenioNumber: string;  // Number of convenio

  // Provider fields
  @Column({ nullable: true })
  providerName: string;

  @Column({ nullable: true })
  providerAccountNumber: string;

  @Column({ nullable: true })
  providerStatus: string;

  @Column({ nullable: true })
  providerServiceType: string; // e.g., Payment Processor, Bank, Loan Provider

  // Loan fields
  @Column({ nullable: true })
  loanNumber: string;

  @Column({ nullable: true })
  paymentLink: string;  // Campo para almacenar el enlace de pago


  @Column({ nullable: true })
  loanTerm: string; // e.g., 30 years, 15 years

  @Column({ nullable: true })
  loanStatus: string;

  // Webhook log fields
  @Column({ nullable: true })
  webhookTransactionId: string;

  @Column({ nullable: true })
  webhookStatus: string;

  @Column({ type: 'json', nullable: true })
  webhookResponse: Record<string, any>;

  // Common fields
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
