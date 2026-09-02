import { describe, it, expect } from 'vitest';
import { EMICalculator } from '../utils/emiCalculator.js';
import { Prisma } from '@prisma/client';

describe('EMICalculator Pure Financial Engine', () => {
  describe('Zero-Cost EMI Calculations', () => {
    it('should correctly calculate zero-cost 6-month EMI without interest', () => {
      const result = EMICalculator.calculate({
        variantPrice: 12000,
        tenureMonths: 6,
        interestRate: 0,
        isZeroCost: true,
      });

      expect(result.principalAmount.toNumber()).toBe(12000);
      expect(result.monthlyInstallment.toNumber()).toBe(2000);
      expect(result.totalInterest.toNumber()).toBe(0);
      expect(result.totalPayable.toNumber()).toBe(12000);
    });

    it('should correctly account for processing fee in total payable for zero-cost plan', () => {
      const result = EMICalculator.calculate({
        variantPrice: 12000,
        tenureMonths: 6,
        interestRate: 0,
        processingFee: 199,
        isZeroCost: true,
      });

      expect(result.monthlyInstallment.toNumber()).toBe(2000);
      expect(result.totalPayable.toNumber()).toBe(12199);
    });

    it('should correctly deduct cashback amount from principal financed', () => {
      const result = EMICalculator.calculate({
        variantPrice: 134900,
        tenureMonths: 6,
        interestRate: 0,
        cashbackAmount: 3000,
        processingFee: 199,
        isZeroCost: true,
      });

      expect(result.principalAmount.toNumber()).toBe(131900);
      expect(result.monthlyInstallment.toNumber()).toBe(21983.33);
      expect(result.totalPayable.toNumber()).toBe(132098.98); // (21983.33 * 6) + 199
    });
  });

  describe('Standard Interest-Bearing EMI Calculations', () => {
    it('should correctly calculate reducing-balance 12-month EMI at 14.5% interest', () => {
      const result = EMICalculator.calculate({
        variantPrice: 100000,
        tenureMonths: 12,
        interestRate: 14.5,
        isZeroCost: false,
      });

      expect(result.principalAmount.toNumber()).toBe(100000);
      expect(result.monthlyInstallment.toNumber()).toBe(9002.25);
      expect(result.totalPayable.toNumber()).toBe(108027); // 9002.25 * 12
      expect(result.totalInterest.toNumber()).toBe(8027);
    });

    it('should handle decimal price values with half-up rounding precision', () => {
      const result = EMICalculator.calculate({
        variantPrice: new Prisma.Decimal('99999.99'),
        tenureMonths: 24,
        interestRate: new Prisma.Decimal('13.50'),
        processingFee: new Prisma.Decimal('499.00'),
        cashbackAmount: new Prisma.Decimal('2500.00'),
        isZeroCost: false,
      });

      expect(result.principalAmount.toNumber()).toBe(97499.99);
      expect(result.monthlyInstallment.toNumber()).toBe(4658.26);
      expect(result.totalPayable.toNumber()).toBe(112297.24); // (4658.26 * 24) + 499
    });
  });

  describe('Validation & Edge Cases', () => {
    it('should throw error for non-positive or non-integer tenure', () => {
      expect(() =>
        EMICalculator.calculate({
          variantPrice: 50000,
          tenureMonths: 0,
          interestRate: 10,
        })
      ).toThrow('Tenure must be a positive integer');

      expect(() =>
        EMICalculator.calculate({
          variantPrice: 50000,
          tenureMonths: -3,
          interestRate: 10,
        })
      ).toThrow('Tenure must be a positive integer');
    });

    it('should throw error for zero or negative price', () => {
      expect(() =>
        EMICalculator.calculate({
          variantPrice: 0,
          tenureMonths: 6,
          interestRate: 10,
        })
      ).toThrow('Variant price must be greater than zero');
    });
  });
});
