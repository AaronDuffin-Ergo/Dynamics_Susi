/**
 * Annual Fee record and the College Fee rows created from it.
 * One College Fee for each college in the tranche.
 */

const rows = [
  { college: "University College Cork", awardedApplicantCount: 842, baseCalculatedAmount: 4210000, marginPercentage: 2.5, finalTrancheAmount: 4315250 },
  { college: "Technological University Dublin", awardedApplicantCount: 610, baseCalculatedAmount: 3050000, marginPercentage: 2.5, finalTrancheAmount: 3100000 },
  { college: "Dublin City University", awardedApplicantCount: 488, baseCalculatedAmount: 2440000, marginPercentage: 2, finalTrancheAmount: 2488800 },
  { college: "Maynooth University", awardedApplicantCount: 356, baseCalculatedAmount: 1780000, marginPercentage: 2.5, finalTrancheAmount: 1824500 },
  { college: "University of Galway", awardedApplicantCount: 401, baseCalculatedAmount: 2005000, marginPercentage: 3, finalTrancheAmount: 2065150 },
];

function collegeFee(row) {
  const marginAmount = Math.round(row.baseCalculatedAmount * (row.marginPercentage / 100));
  return {
    ...row,
    marginAmount,
    calculatedTrancheAmount: row.baseCalculatedAmount + marginAmount,
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
