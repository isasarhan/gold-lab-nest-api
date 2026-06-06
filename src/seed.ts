/**
 * Seed script — populates the database with demo data.
 * Run with: npm run seed
 */
import mongoose, { Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// ── Enums (inlined to avoid NestJS module resolution) ────────────────────────

enum Role { Admin = 'admin', Manager = 'manager', Moderator = 'moderator', User = 'user' }
enum CustomerType { Individual = 'individual', Wholesaler = 'wholesaler', Retailer = 'retailer', Distributor = 'distributor', Reseller = 'reseller', Corporate = 'corporate', Government = 'government' }
enum Karat { K18 = '18K', K21 = '21K', K24 = '24K' }
enum ItemType { Gormet = 'gormet', LAZER = 'lazer', Boul = 'boul', Lock = 'lock', Stamp = 'stamp', Ramle = 'ramle', Forza = 'forza', WeddingRing = 'wedding ring', Ring = 'ring', Bracelet = 'bracelet', Necklace = 'necklace', Bangle = 'bangle', Other = 'other' }
enum Currency { Usd = 'USD', Lbp = 'LBP', Eur = 'EUR', Other = 'OTHER' }
enum Sector { Inventory = 'inventory', Melting = 'melting', Table = 'table', Pull = 'pull', Saw = 'saw', Delivery = 'delivery', Setting = 'setting' }
enum PaymentTypeEnum { Bonus = 'bonus', Advance = 'advance', Overtime = 'overtime', Commission = 'commission', Monthly = 'monthly' }
enum MonthEnum { January = 'January', February = 'February', March = 'March', April = 'April', May = 'May', June = 'June', July = 'July', August = 'August', September = 'September', October = 'October', November = 'November', December = 'December' }

// ── Schemas ───────────────────────────────────────────────────────────────────

const UserSchema = new mongoose.Schema({
  username: String, name: String, email: { type: String, unique: true },
  password: String, phone: String, isSuperAdmin: Boolean, profileUrl: String,
  role: { type: String, enum: Object.values(Role), default: Role.User },
  isApproved: { type: Boolean, default: false },
});

const CustomerSchema = new mongoose.Schema({
  name: String, email: String, phone: String, location: String,
  type: { type: String, enum: Object.values(CustomerType), default: CustomerType.Retailer },
});

const EmployeeSchema = new mongoose.Schema({ name: String, position: String, phone: String, email: String, salary: Number }, { timestamps: true });

const SupplierSchema = new mongoose.Schema({ name: String, weight: { type: Number, default: 0 }, silver: { type: Number, default: 0 }, cash: { type: Number, default: 0 }, phone: String, description: String }, { timestamps: true });

const InventorySchema = new mongoose.Schema({ name: { type: String, unique: true }, weight: { type: Number, default: 0 }, cash: { type: Number, default: 0 } });

const OrderSchema = new mongoose.Schema({
  customer: { type: Types.ObjectId, ref: 'Customer' }, weight: Number, karat: { type: String, enum: Object.values(Karat), default: Karat.K18 },
  perGram: Number, perItem: Number, invoiceNb: String, type: { type: String, enum: Object.values(ItemType), default: ItemType.Other },
  quantity: { type: Number, default: 1 }, description: String, date: { type: Date, default: Date.now },
}, { timestamps: true });

const InvoiceSchema = new mongoose.Schema({
  invoiceNb: String, customer: { type: Types.ObjectId, ref: 'Customer' },
  orders: [{ type: Types.ObjectId, ref: 'Order' }], totalWeight: Number, totalCash: Number, date: { type: Date, default: Date.now },
}, { timestamps: true });

const PaymentSchema = new mongoose.Schema({
  customer: { type: Types.ObjectId, ref: 'Customer' }, invoiceNb: String, date: { type: Date, default: Date.now },
  weight: Number, karat: Number, cash: Number,
  currency: { type: String, enum: Object.values(Currency), default: Currency.Usd }, description: String,
}, { timestamps: true });

const SupplySchema = new mongoose.Schema({
  supplier: { type: Types.ObjectId, ref: 'Supplier' }, weight: Number, karat: { type: String, enum: Object.values(Karat), default: Karat.K18 },
  perGram: Number, date: { type: Date, default: Date.now }, description: String, invoiceNb: String,
  type: { type: String, enum: Object.values(ItemType), default: ItemType.Other },
}, { timestamps: true });

const SupplyPaymentSchema = new mongoose.Schema({
  supplier: { type: Types.ObjectId, ref: 'Supplier' }, invoiceNb: String, date: { type: Date, default: Date.now },
  weight: Number, karat: Number, cash: Number,
  currency: { type: String, enum: Object.values(Currency), default: Currency.Usd }, description: String,
}, { timestamps: true });

const BalanceSchema = new mongoose.Schema({ customer: { type: Types.ObjectId, ref: 'Customer' }, gold: { type: Number, default: 0 }, cash: { type: Number, default: 0 } }, { timestamps: true });

const EmployeeAttendanceSchema = new mongoose.Schema({ employee: { type: Types.ObjectId, ref: 'Employee' }, arrival: Date, departure: Date }, { timestamps: true });

const SalaryReportSchema = new mongoose.Schema({
  date: { month: { type: String, enum: Object.values(MonthEnum) }, year: String },
  employee: { _id: { type: Types.ObjectId, ref: 'Employee' }, name: String, salary: Number },
  payments: [{ date: Date, amount: Number, type: { type: String, enum: Object.values(PaymentTypeEnum), default: PaymentTypeEnum.Monthly }, description: String }],
});

const DailyWorkflowSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  reports: [{ from: { type: String, enum: Object.values(Sector) }, to: { type: String, enum: Object.values(Sector) }, karat: { type: String, enum: Object.values(Karat) }, weight: Number, quantity: Number, description: String }],
  balances: [{ sector: { type: String, enum: Object.values(Sector) }, weight: Number, quantity: Number, karat: { type: String, enum: Object.values(Karat) } }],
});

// ── Models ────────────────────────────────────────────────────────────────────

const User = mongoose.model('User', UserSchema);
const Customer = mongoose.model('Customer', CustomerSchema);
const Employee = mongoose.model('Employee', EmployeeSchema);
const Supplier = mongoose.model('Supplier', SupplierSchema);
const Inventory = mongoose.model('Inventory', InventorySchema);
const Order = mongoose.model('Order', OrderSchema);
const Invoice = mongoose.model('Invoice', InvoiceSchema);
const Payment = mongoose.model('Payment', PaymentSchema);
const Supply = mongoose.model('Supply', SupplySchema);
const SupplyPayment = mongoose.model('SupplyPayment', SupplyPaymentSchema);
const Balance = mongoose.model('Balance', BalanceSchema);
const EmployeeAttendance = mongoose.model('EmployeeAttendance', EmployeeAttendanceSchema);
const SalaryReport = mongoose.model('SalaryReport', SalaryReportSchema);
const DailyWorkflow = mongoose.model('DailyWorkflow', DailyWorkflowSchema);

// ── Helpers ───────────────────────────────────────────────────────────────────

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

// ── Main seed ─────────────────────────────────────────────────────────────────

async function seed() {
  const uri = process.env.DATABASE_HOST;
  if (!uri) throw new Error('DATABASE_HOST is not set in .env');

  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('Connected.\n');

  // Clear all collections
  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}), Customer.deleteMany({}), Employee.deleteMany({}),
    Supplier.deleteMany({}), Inventory.deleteMany({}), Order.deleteMany({}),
    Invoice.deleteMany({}), Payment.deleteMany({}), Supply.deleteMany({}),
    SupplyPayment.deleteMany({}), Balance.deleteMany({}),
    EmployeeAttendance.deleteMany({}), SalaryReport.deleteMany({}),
    DailyWorkflow.deleteMany({}),
  ]);
  console.log('Done.\n');

  // ── Users ──────────────────────────────────────────────────────────────────
  console.log('Seeding users...');
  const salt = await bcrypt.genSalt(10);
  await User.insertMany([
    { username: 'admin', name: 'Admin User', email: 'admin@goldlab.com', password: await bcrypt.hash('Admin@123', salt), role: Role.Admin, isApproved: true, isSuperAdmin: true },
    { username: 'manager1', name: 'Sara Khalil', email: 'sara@goldlab.com', password: await bcrypt.hash('Manager@123', salt), role: Role.Manager, isApproved: true },
    { username: 'user1', name: 'Ali Hassan', email: 'ali@goldlab.com', password: await bcrypt.hash('User@123', salt), role: Role.User, isApproved: true },
  ]);

  // ── Customers ──────────────────────────────────────────────────────────────
  console.log('Seeding customers...');
  const customers = await Customer.insertMany([
    { name: 'Nour Jewellery', email: 'nour@example.com', phone: '+961 70 111 222', location: 'Beirut', type: CustomerType.Retailer },
    { name: 'Gold Palace LLC', email: 'info@goldpalace.com', phone: '+961 3 444 555', location: 'Tripoli', type: CustomerType.Wholesaler },
    { name: 'Hana Boutique', email: 'hana@boutique.com', phone: '+961 76 888 999', location: 'Sidon', type: CustomerType.Individual },
    { name: 'Al-Nour Trading', email: 'alnour@trading.com', phone: '+961 1 234 567', location: 'Jounieh', type: CustomerType.Distributor },
    { name: 'Farid & Sons', email: 'farid@sons.com', phone: '+961 3 987 654', location: 'Zahle', type: CustomerType.Corporate },
  ]);
  const [cNour, cPalace, cHana, cAlNour, cFarid] = customers;

  // ── Employees ──────────────────────────────────────────────────────────────
  console.log('Seeding employees...');
  const employees = await Employee.insertMany([
    { name: 'Rami Saleh', position: 'Goldsmith', phone: '+961 70 100 200', email: 'rami@goldlab.com', salary: 1200 },
    { name: 'Lara Nassar', position: 'Polisher', phone: '+961 71 300 400', email: 'lara@goldlab.com', salary: 900 },
    { name: 'Karim Mansour', position: 'Setter', phone: '+961 3 500 600', email: 'karim@goldlab.com', salary: 1100 },
    { name: 'Maya Haddad', position: 'Sales', phone: '+961 76 700 800', email: 'maya@goldlab.com', salary: 1000 },
  ]);
  const [eRami, eLara, eKarim, eMaya] = employees;

  // ── Suppliers ──────────────────────────────────────────────────────────────
  console.log('Seeding suppliers...');
  const suppliers = await Supplier.insertMany([
    { name: 'Al-Masraf Gold Co.', weight: 500, silver: 50, cash: 12000, phone: '+961 1 555 666', description: 'Main gold bullion supplier' },
    { name: 'Beirut Refinery', weight: 200, silver: 100, cash: 5000, phone: '+961 3 777 888', description: 'Refined gold and silver' },
    { name: 'Swiss Import Ltd.', weight: 300, silver: 0, cash: 20000, phone: '+961 1 999 000', description: 'Imported Swiss gold bars' },
  ]);
  const [sMasraf, sBeirut, sSwiss] = suppliers;

  // ── Inventory ─────────────────────────────────────────────────────────────
  console.log('Seeding inventory...');
  await Inventory.insertMany([
    { name: '18K Gold Stock', weight: 1250.5, cash: 0 },
    { name: '21K Gold Stock', weight: 430.2, cash: 0 },
    { name: '24K Gold Stock', weight: 180.0, cash: 0 },
    { name: 'Cash Register', weight: 0, cash: 35000 },
    { name: 'Silver Stock', weight: 620.0, cash: 0 },
  ]);

  // ── Orders ────────────────────────────────────────────────────────────────
  console.log('Seeding orders...');
  const orders = await Order.insertMany([
    { customer: cNour._id, weight: 12.5, karat: Karat.K18, perGram: 55, perItem: 0, invoiceNb: 'INV-001', type: ItemType.Necklace, quantity: 2, description: '18K necklace set', date: daysAgo(30) },
    { customer: cNour._id, weight: 8.2, karat: Karat.K18, perGram: 55, perItem: 0, invoiceNb: 'INV-001', type: ItemType.Bracelet, quantity: 3, description: '18K bracelet', date: daysAgo(30) },
    { customer: cPalace._id, weight: 45.0, karat: Karat.K21, perGram: 60, perItem: 0, invoiceNb: 'INV-002', type: ItemType.Ring, quantity: 10, description: '21K rings bulk', date: daysAgo(20) },
    { customer: cHana._id, weight: 5.5, karat: Karat.K18, perGram: 0, perItem: 280, invoiceNb: 'INV-003', type: ItemType.WeddingRing, quantity: 2, description: 'Wedding bands', date: daysAgo(15) },
    { customer: cAlNour._id, weight: 30.0, karat: Karat.K24, perGram: 75, perItem: 0, invoiceNb: 'INV-004', type: ItemType.Gormet, quantity: 5, description: '24K gormet chain', date: daysAgo(10) },
    { customer: cFarid._id, weight: 18.0, karat: Karat.K21, perGram: 60, perItem: 0, invoiceNb: 'INV-005', type: ItemType.Bangle, quantity: 4, description: '21K bangle set', date: daysAgo(5) },
    { customer: cPalace._id, weight: 22.0, karat: Karat.K18, perGram: 55, perItem: 0, invoiceNb: 'INV-006', type: ItemType.Forza, quantity: 6, description: 'Forza chain 18K', date: daysAgo(3) },
  ]);

  // ── Invoices ──────────────────────────────────────────────────────────────
  console.log('Seeding invoices...');
  await Invoice.insertMany([
    {
      invoiceNb: 'INV-001', customer: cNour._id, orders: [orders[0]._id, orders[1]._id],
      totalWeight: 12.5 + 8.2, totalCash: (12.5 * 55) + (8.2 * 55), date: daysAgo(30),
    },
    {
      invoiceNb: 'INV-002', customer: cPalace._id, orders: [orders[2]._id],
      totalWeight: 45.0, totalCash: 45.0 * 60, date: daysAgo(20),
    },
    {
      invoiceNb: 'INV-003', customer: cHana._id, orders: [orders[3]._id],
      totalWeight: 5.5, totalCash: 2 * 280, date: daysAgo(15),
    },
    {
      invoiceNb: 'INV-004', customer: cAlNour._id, orders: [orders[4]._id],
      totalWeight: 30.0, totalCash: 30.0 * 75, date: daysAgo(10),
    },
    {
      invoiceNb: 'INV-005', customer: cFarid._id, orders: [orders[5]._id],
      totalWeight: 18.0, totalCash: 18.0 * 60, date: daysAgo(5),
    },
  ]);

  // ── Customer Payments ─────────────────────────────────────────────────────
  console.log('Seeding customer payments...');
  await Payment.insertMany([
    { customer: cNour._id, invoiceNb: 'INV-001', date: daysAgo(28), weight: 0, karat: 995, cash: 1133, currency: Currency.Usd, description: 'Partial payment INV-001' },
    { customer: cPalace._id, invoiceNb: 'INV-002', date: daysAgo(18), weight: 10, karat: 750, cash: 0, currency: Currency.Usd, description: 'Gold payment for bulk order' },
    { customer: cHana._id, invoiceNb: 'INV-003', date: daysAgo(14), weight: 0, karat: 995, cash: 560, currency: Currency.Usd, description: 'Full payment for wedding bands' },
    { customer: cAlNour._id, invoiceNb: 'INV-004', date: daysAgo(8), weight: 0, karat: 995, cash: 1500, currency: Currency.Usd, description: 'Deposit on INV-004' },
    { customer: cFarid._id, invoiceNb: 'INV-005', date: daysAgo(4), weight: 5, karat: 875, cash: 0, currency: Currency.Usd, description: 'Gold trade-in' },
  ]);

  // ── Supplies ──────────────────────────────────────────────────────────────
  console.log('Seeding supplies...');
  await Supply.insertMany([
    { supplier: sMasraf._id, weight: 200, karat: Karat.K18, perGram: 48, date: daysAgo(45), description: 'Monthly 18K stock', invoiceNb: 'SUP-001', type: ItemType.Other },
    { supplier: sBeirut._id, weight: 100, karat: Karat.K21, perGram: 52, date: daysAgo(35), description: '21K refined gold', invoiceNb: 'SUP-002', type: ItemType.Other },
    { supplier: sSwiss._id, weight: 150, karat: Karat.K24, perGram: 68, date: daysAgo(25), description: 'Pure gold bars import', invoiceNb: 'SUP-003', type: ItemType.Other },
    { supplier: sMasraf._id, weight: 80, karat: Karat.K18, perGram: 49, date: daysAgo(12), description: 'Gormet chain stock', invoiceNb: 'SUP-004', type: ItemType.Gormet },
  ]);

  // ── Supply Payments ───────────────────────────────────────────────────────
  console.log('Seeding supply payments...');
  await SupplyPayment.insertMany([
    { supplier: sMasraf._id, invoiceNb: 'SUP-001', date: daysAgo(44), weight: 0, karat: 0, cash: 9600, currency: Currency.Usd, description: 'Full payment SUP-001' },
    { supplier: sBeirut._id, invoiceNb: 'SUP-002', date: daysAgo(33), weight: 0, karat: 0, cash: 5200, currency: Currency.Usd, description: 'Full payment SUP-002' },
    { supplier: sSwiss._id, invoiceNb: 'SUP-003', date: daysAgo(24), weight: 0, karat: 0, cash: 10200, currency: Currency.Usd, description: 'Partial payment SUP-003' },
    { supplier: sMasraf._id, invoiceNb: 'SUP-004', date: daysAgo(10), weight: 20, karat: 750, cash: 0, currency: Currency.Usd, description: 'Gold trade for SUP-004' },
  ]);

  // ── Balances ──────────────────────────────────────────────────────────────
  console.log('Seeding balances...');
  await Balance.insertMany([
    { customer: cNour._id, gold: 5.5, cash: 0 },
    { customer: cPalace._id, gold: 35.0, cash: 2700 },
    { customer: cHana._id, gold: 0, cash: 0 },
    { customer: cAlNour._id, gold: 0, cash: 750 },
    { customer: cFarid._id, gold: 13.0, cash: 1080 },
  ]);

  // ── Employee Attendance ───────────────────────────────────────────────────
  console.log('Seeding employee attendance...');
  const attendanceRecords: any[] = [];
  const allEmployees = [eRami, eLara, eKarim, eMaya];
  for (let d = 6; d >= 0; d--) {
    for (const emp of allEmployees) {
      const arrival = new Date(daysAgo(d));
      arrival.setHours(8, 30, 0, 0);
      const departure = new Date(daysAgo(d));
      departure.setHours(17, 0, 0, 0);
      attendanceRecords.push({ employee: emp._id, arrival, departure });
    }
  }
  await EmployeeAttendance.insertMany(attendanceRecords);

  // ── Salary Reports ────────────────────────────────────────────────────────
  console.log('Seeding salary reports...');
  const salaryData = [
    { emp: eRami, salary: 1200 },
    { emp: eLara, salary: 900 },
    { emp: eKarim, salary: 1100 },
    { emp: eMaya, salary: 1000 },
  ];
  const months = [
    { month: MonthEnum.January, year: '2026' },
    { month: MonthEnum.February, year: '2026' },
    { month: MonthEnum.March, year: '2026' },
  ];
  const salaryReports: any[] = [];
  for (const { emp, salary } of salaryData) {
    for (const date of months) {
      const payments: any[] = [
        { date: new Date(`${date.year}-${Object.values(MonthEnum).indexOf(date.month) + 1}-25`), amount: salary, type: PaymentTypeEnum.Monthly, description: `${date.month} salary` },
      ];
      if (date.month === MonthEnum.March) {
        payments.push({ date: new Date('2026-03-10'), amount: 150, type: PaymentTypeEnum.Bonus, description: 'Q1 performance bonus' });
      }
      salaryReports.push({ date, employee: { _id: emp._id, name: (emp as any).name, salary }, payments });
    }
  }
  await SalaryReport.insertMany(salaryReports);

  // ── Daily Workflows ───────────────────────────────────────────────────────
  console.log('Seeding daily workflows...');
  const workflows: any[] = [];
  for (let d = 4; d >= 0; d--) {
    workflows.push({
      date: daysAgo(d),
      reports: [
        { from: Sector.Inventory, to: Sector.Melting, karat: Karat.K18, weight: 50 + d * 5, quantity: 0, description: 'Melting batch' },
        { from: Sector.Melting, to: Sector.Table, karat: Karat.K18, weight: 48 + d * 5, quantity: 0, description: 'Rolled to table' },
        { from: Sector.Table, to: Sector.Saw, karat: Karat.K18, weight: 45 + d * 4, quantity: 10 + d, description: 'Cut pieces' },
        { from: Sector.Saw, to: Sector.Setting, karat: Karat.K18, weight: 44 + d * 4, quantity: 10 + d, description: 'Sent to setting' },
        { from: Sector.Setting, to: Sector.Delivery, karat: Karat.K18, weight: 43 + d * 3, quantity: 8 + d, description: 'Ready for delivery' },
      ],
      balances: [
        { sector: Sector.Inventory, weight: 1200 - d * 10, quantity: 0, karat: Karat.K18 },
        { sector: Sector.Melting, weight: 2 + d, quantity: 0, karat: Karat.K18 },
        { sector: Sector.Table, weight: 3 + d, quantity: 0, karat: Karat.K18 },
        { sector: Sector.Setting, weight: 1 + d, quantity: 2, karat: Karat.K18 },
        { sector: Sector.Delivery, weight: 43 + d * 3, quantity: 8 + d, karat: Karat.K18 },
      ],
    });
  }
  await DailyWorkflow.insertMany(workflows);

  // ── Done ──────────────────────────────────────────────────────────────────
  console.log('\n✔  Database seeded successfully!\n');
  console.log('Demo credentials:');
  console.log('  Admin   → admin@goldlab.com   / Admin@123');
  console.log('  Manager → sara@goldlab.com    / Manager@123');
  console.log('  User    → ali@goldlab.com     / User@123\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
