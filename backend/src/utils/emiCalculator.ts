import { Prisma } from '@prisma/client';

export interface EMICalculationInput {
  variantPrice: Prisma.Decimal | number | string;
  tenureMonths: number;
  interestRate: Prisma.Decimal | number | string;
  processingFee?: Prisma.Decimal | number | string;
  cashbackAmount?: Prisma.Decimal | number | string;
  isZeroCost?: boolean;
}

export interface EMICalculationResult {
  principalAmount: Prisma.Decimal;
  monthlyInstallment: Prisma.Decimal;
  totalInterest: Prisma.Decimal;
  totalPayable: Prisma.Decimal;
  processingFee: Prisma.Decimal;
  cashbackAmount: Prisma.Decimal;
  interestRate: Prisma.Decimal;
  tenureMonths: number;
  isZeroCost: boolean;
}

export class EMICalculator {
  public static calculate(input: EMICalculationInput): EMICalculationResult {
    const price = new Prisma.Decimal(input.variantPrice);
    const cashback = new Prisma.Decimal(input.cashbackAmount ?? 0);
    const fee = new Prisma.Decimal(input.processingFee ?? 0);
    const ratePercent = new Prisma.Decimal(input.interestRate ?? 0);
    const tenure = input.tenureMonths;
    const isZeroCost = Boolean(input.isZeroCost);

    if (tenure <= 0 || !Number.isInteger(tenure)) {
      throw new Error('Tenure must be a positive integer');
    }

    if (price.lessThanOrEqualTo(0)) {
      throw new Error('Variant price must be greater than zero');
    }

    // Net Financed Principal = price - cashback
    const principalRaw = price.sub(cashback);
    const principal = principalRaw.lessThan(0) ? new Prisma.Decimal(0) : principalRaw;

    let monthlyInstallment: Prisma.Decimal;
    let totalInterest: Prisma.Decimal;

    if (isZeroCost || ratePercent.isZero()) {
      // Zero-Cost EMI: Principal / Tenure
      monthlyInstallment = principal.div(tenure).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
      totalInterest = new Prisma.Decimal(0);
    } else {
      // Monthly interest rate r = AnnualRate / (12 * 100)
      const r = ratePercent.div(1200);

      // Formula: EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
      const onePlusR = new Prisma.Decimal(1).add(r);
      const compoundFactor = onePlusR.pow(tenure);

      const numerator = principal.mul(r).mul(compoundFactor);
      const denominator = compoundFactor.sub(1);

      if (denominator.isZero()) {
        monthlyInstallment = principal.div(tenure).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
      } else {
        monthlyInstallment = numerator.div(denominator).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
      }

      const totalInstallmentsAmount = monthlyInstallment.mul(tenure);
      const interestRaw = totalInstallmentsAmount.sub(principal);
      totalInterest = interestRaw.lessThan(0) ? new Prisma.Decimal(0) : interestRaw.toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
    }

    // Total Payable = (Monthly Installment * Tenure) + Processing Fee
    const totalPayable = monthlyInstallment.mul(tenure).add(fee).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);

    return {
      principalAmount: principal.toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP),
      monthlyInstallment,
      totalInterest,
      totalPayable,
      processingFee: fee.toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP),
      cashbackAmount: cashback.toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP),
      interestRate: ratePercent.toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP),
      tenureMonths: tenure,
      isZeroCost,
    };
  }
}
