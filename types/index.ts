import { ObjectId } from 'mongodb';

export interface Employee {
  _id?: ObjectId;
  employeeId: string;
  name: string;
  email: string;
  password: string;
  registrationCode?: string;
  role: 'admin' | 'employee';
  department: string;
  phoneNumber: string;
  createdAt: Date;
  createdBy?: ObjectId;
  isActive: boolean;
}

export interface Equipment {
  _id?: ObjectId;
  equipmentId: string;
  name: string;
  description: string;
  totalQuantity: number;
  availableQuantity: number;
  category: string;
  location: string;
  condition: 'good' | 'fair' | 'damaged';
  dateAdded: Date;
  addedBy?: ObjectId;
  lastUpdated: Date;
}

export interface Checkout {
  _id?: ObjectId;
  checkoutId: string;
  equipmentId: ObjectId;
  employeeId: ObjectId;
  quantityCheckout: number;
  checkoutDateTime: Date;
  returnDateTime?: Date;
  status: 'checked_out' | 'returned' | 'overdue';
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  approvedBy?: ObjectId;
  returnCondition?: 'good' | 'fair' | 'damaged';
}

export interface RegistrationCode {
  _id?: ObjectId;
  code: string;
  createdBy: ObjectId;
  usedBy?: ObjectId;
  isUsed: boolean;
  expiresAt: Date;
  createdAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
