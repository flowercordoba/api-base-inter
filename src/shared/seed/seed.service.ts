import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';  // Nueva importación de faker
import { SeedEntity } from './entitie/seed-entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(SeedEntity)
    private readonly seedRepository: Repository<SeedEntity>,
  ) {}

  // Modificamos para aceptar la cantidad desde el controlador
  async runSeed(quantity: number) {
    // Crear un array de datos falsos basado en la cantidad recibida
    const seedData = Array(quantity).fill(0).map(() => {
      return this.generateFakeData();
    });

    // Guardar los datos falsos en la base de datos
    await this.seedRepository.save(seedData);
  }

  private generateFakeData(): Partial<SeedEntity> {
    return {
      userName: faker.person.firstName(),
      userEmail: faker.internet.email(),
      userPhoneNumber: faker.phone.number(),
      userAddress: faker.location.streetAddress(),
      userRole: faker.helpers.arrayElement(['client', 'admin']),
      userBalance: parseFloat(faker.finance.amount({ min: 1000, max: 10000, dec: 2 })),
      userAccountNumber: faker.finance.accountNumber(),
      userStatus: faker.helpers.arrayElement(['active', 'inactive']),
      userIdNumber: faker.string.uuid(),
      userTaxNumber: faker.finance.accountNumber(),
      userBankBranch: faker.company.name(),
      bankAccountNumber: faker.finance.accountNumber(),
      bankAccountType: faker.helpers.arrayElement(['savings', 'checking']),
      bankAccountBalance: parseFloat(faker.finance.amount({ min: 1000, max: 50000, dec: 2 })),
      bankAccountStatus: faker.helpers.arrayElement(['active', 'closed']),
      bankAccountCurrency: faker.finance.currencyCode(),
      cardNumber: faker.finance.creditCardNumber(),
      cardType: faker.helpers.arrayElement(['credit', 'debit']),
      cardStatus: faker.helpers.arrayElement(['active', 'expired']),
      cardExpiryDate: faker.date.future(),
      cardLimit: parseFloat(faker.finance.amount({ min: 1000, max: 10000, dec: 2 })),
      cardCVV: faker.finance.creditCardCVV(),
      transactionAmount: parseFloat(faker.finance.amount({ min: 50, max: 5000, dec: 2 })),
      transactionType: faker.helpers.arrayElement(['deposit', 'withdrawal', 'payment']),
      transactionReference: faker.string.alphanumeric(5),
      transactionStatus: faker.helpers.arrayElement(['pending', 'completed', 'failed']),
      transactionDate: faker.date.past(),
      transactionCurrency: faker.finance.currencyCode(),
      transactionChannel: faker.helpers.arrayElement(['ATM', 'Online', 'Branch']),
      invoiceAmount: parseFloat(faker.finance.amount({ min: 100, max: 5000, dec: 2 })),
      invoiceDueDate: faker.date.future(),
      paymentLink: `http://sandbox.tupay.finance/pay?amount=${faker.finance.amount({ min: 100, max: 5000, dec: 2 })}&currency=USD`, 
      invoiceStatus: faker.helpers.arrayElement(['paid', 'pending', 'overdue']),
      invoiceReference: faker.string.alphanumeric(5),
      invoiceIssuedDate: faker.date.past(),
      invoiceCurrency: faker.finance.currencyCode(),
      paymentAmount: parseFloat(faker.finance.amount({ min: 100, max: 5000, dec: 2 })),
      paymentStatus: faker.helpers.arrayElement(['completed', 'failed']),
      paymentDate: faker.date.past(),
      paymentMethod: faker.helpers.arrayElement(['Credit Card', 'Bank Transfer', 'Cash']),
      paymentCurrency: faker.finance.currencyCode(),
      paymentReference: faker.string.alphanumeric(10),
      paymentConvenioNumber: '1232',
      providerName: faker.company.name(),
      providerAccountNumber: faker.finance.accountNumber(),
      providerStatus: faker.helpers.arrayElement(['active', 'inactive']),
      providerServiceType: faker.helpers.arrayElement(['Payment Processor', 'Bank', 'Loan Provider']),
      loanNumber: faker.finance.accountNumber(),
      loanAmount: parseFloat(faker.finance.amount({ min: 5000, max: 50000, dec: 2 })),
      loanInterestRate: parseFloat(faker.finance.amount({ min: 1, max: 10, dec: 2 })),
      loanTerm: faker.helpers.arrayElement(['30 years', '15 years', '5 years']),
      loanStatus: faker.helpers.arrayElement(['active', 'closed']),
      webhookTransactionId: faker.string.uuid(),
      webhookStatus: faker.helpers.arrayElement(['success', 'failed']),
      webhookResponse: {
        message: faker.lorem.sentence(),
        timestamp: faker.date.past(),
      },
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };
  }
}
