/**
 * Annual Fee record and the College Fee rows created from it.
 * One College Fee for each college in the tranche. Each College Fee
 * holds its tranche, reconciliation and post-reconciliation payments.
 */

const rows = [
  {
    collegeFeeNumber: "CF-2026-000101",
    college: "University College Cork",
    creditorId: "CR-UCC-0042",
    paymentCode: "UCC01",
    awardedApplicantCount: 842,
    baseCalculatedAmount: 4210000,
    marginPercentage: 2.5,
    finalTrancheAmount: 4315250,
    reconciliationAmount: 27350,
    reconciliationOverride: 24100,
    postReconciliationAmount: 12600,
    reconciledApplicationCount: 829,
  },
  {
    collegeFeeNumber: "CF-2026-000102",
    college: "Technological University Dublin",
    creditorId: "CR-TUD-0117",
    paymentCode: "TUD01",
    awardedApplicantCount: 610,
    baseCalculatedAmount: 3050000,
    marginPercentage: 2.5,
    finalTrancheAmount: 3100000,
    reconciliationAmount: 18750,
    postReconciliationAmount: 8400,
    reconciledApplicationCount: 602,
  },
  {
    collegeFeeNumber: "CF-2026-000103",
    college: "Dublin City University",
    creditorId: "CR-DCU-0063",
    paymentCode: "DCU01",
    awardedApplicantCount: 488,
    baseCalculatedAmount: 2440000,
    marginPercentage: 2,
    finalTrancheAmount: 2488800,
    reconciliationAmount: 11200,
    postReconciliationAmount: 5200,
    reconciledApplicationCount: 481,
  },
  {
    collegeFeeNumber: "CF-2026-000104",
    college: "Maynooth University",
    creditorId: "CR-MU-0088",
    paymentCode: "MU01",
    awardedApplicantCount: 356,
    baseCalculatedAmount: 1780000,
    marginPercentage: 2.5,
    finalTrancheAmount: 1824500,
    reconciliationAmount: 9300,
    postReconciliationAmount: 3900,
    reconciledApplicationCount: 350,
  },
  {
    collegeFeeNumber: "CF-2026-000105",
    college: "University of Galway",
    creditorId: "CR-UG-0071",
    paymentCode: "UG01",
    awardedApplicantCount: 401,
    baseCalculatedAmount: 2005000,
    marginPercentage: 3,
    finalTrancheAmount: 2065150,
    reconciliationAmount: 10450,
    postReconciliationAmount: 4700,
    reconciledApplicationCount: 395,
  },
];

function paymentNumber(n) {
  return `CP-2026-${String(n).padStart(6, "0")}`;
}

function collegeFee(row, index) {
  const marginAmount = Math.round(row.baseCalculatedAmount * (row.marginPercentage / 100));
  const reconciliationDue = row.reconciliationOverride ?? row.reconciliationAmount;
  const payments = [
    {
      collegePaymentNumber: paymentNumber(index * 3 + 1),
      paymentType: "Tranche",
      paymentCode: row.paymentCode,
      status: "Paid",
      amount: row.finalTrancheAmount,
      overrideAmount: null,
    },
    {
      collegePaymentNumber: paymentNumber(index * 3 + 2),
      paymentType: "Reconciliation",
      paymentCode: row.paymentCode,
      status: "Approved",
      amount: row.reconciliationAmount,
      overrideAmount: row.reconciliationOverride ?? null,
    },
    {
      collegePaymentNumber: paymentNumber(index * 3 + 3),
      paymentType: "Post-Reconciliation",
      paymentCode: row.paymentCode,
      status: "Draft",
      amount: row.postReconciliationAmount,
      overrideAmount: null,
    },
  ];
  return {
    ...row,
    feeNumber: "FEE-2026-000014",
    academicYear: "2026/27",
    marginAmount,
    calculatedTrancheAmount: row.baseCalculatedAmount + marginAmount,
    totalTranchePaid: row.finalTrancheAmount,
    totalReconciledFee: row.finalTrancheAmount + reconciliationDue,
    totalReconciliationPaid: 0,
    totalPostReconciliationPaid: 0,
    unreconciledApplicationCount: row.awardedApplicantCount - row.reconciledApplicationCount,
    payments,
  };
}

export const mockFees = [
  {
    feeNumber: "FEE-2026-000014",
    academicYear: "2026/27",
    schemeName: "Student Grant Scheme 2026/27",
    status: "Tranche calculated",
    collegeFees: rows.map(collegeFee),
  },
];

export function findCollegeFee(collegeFeeNumber) {
  for (const fee of mockFees) {
    const match = fee.collegeFees.find((row) => row.collegeFeeNumber === collegeFeeNumber);
    if (match) return { fee, collegeFee: match };
  }
  return null;
}
