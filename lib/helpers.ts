import { ObjectId } from 'mongodb';
import crypto from 'crypto';

export function generateEmployeeId(): string {
  return `EMP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateEquipmentId(): string {
  return `EQP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateCheckoutId(): string {
  return `CHK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateRegistrationCode(): string {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isOverdue(returnDateTime: Date | undefined): boolean {
  if (!returnDateTime) {
    return false;
  }

  return new Date() > new Date(returnDateTime);
}

export function getDaysDifference(startDate: Date, endDate: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / msPerDay);
}

export function generateErrorResponse(message: string, error?: any) {
  return {
    success: false,
    message,
    error: error?.message || error?.toString(),
  };
}

export function generateSuccessResponse<T>(message: string, data?: T) {
  return {
    success: true,
    message,
    data,
  };
}
