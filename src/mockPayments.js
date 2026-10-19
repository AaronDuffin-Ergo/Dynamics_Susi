/**
 * Sample payment schedules. A schedule exists only after an award.
 * Standard courses use nine maintenance dates. A fee-only award has
 * the fee payment and no maintenance instalments.
 */

function on(month, day, year = 2026) {
  return new Date(Date.UTC(year, month - 1, day));
}

const money = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" });

function monthsFrom(startMonth, startYear, count) {
  return Array.from({ length: count }, (_, index) => {
    const month = ((startMonth - 1 + index) % 12) + 1;
    const year = startYear + Math.floor((startMonth - 1 + index) / 12);
    return on(month, 15, year);
  });
}

const CIAN_DATES = monthsFrom(9, 2026, 9);
const CIAN_AMOUNT = 302.4;

const CIAN_ROWS = [
  { status: "Processed", verified: "Yes", attendanceOutcome: "Registered", released: true, notes: "" },
  { status: "Processed", verified: "Yes", attendanceOutcome: "Registered", released: true, notes: "" },
  { status: "Processed", verified: "Yes", attendanceOutcome: "Registered", released: true, notes: "" },
  {
    status: "Bounced Back",
    verified: "Yes",
    attendanceOutcome: "Registered",
    released: true,
    notes: "Payment returned by the bank. The applicant IBAN is being checked.",
  },
  {
    status: "On Hold",
    verified: "No",
    attendanceOutcome: "Not returned",
    released: false,
    notes: "January registration file has not been received from the college.",
  },
  {
    status: "Suspended",
    verified: "No",
    attendanceOutcome: "",
    released: false,
    notes: "Suspended until the bounced payment is resolved.",
  },
  { status: "Planned", verified: "", attendanceOutcome: "", released: false, notes: "" },
  { status: "Planned", verified: "", attendanceOutcome: "", released: false, notes: "" },
  {
    status: "Cancelled",
    verified: "",
    attendanceOutcome: "",
    released: false,
    notes: "Final instalment cancelled. Course end date confirmed as 30 April 2027.",
  },
];

function cianPayments() {
  return CIAN_ROWS.map((row, index) => {
    const sequence = index + 1;
    const scheduledDate = CIAN_DATES[index];
    const sent = row.released;
    return {
      id: `PAY-1588-${sequence}`,
      applicationNumber: "SGS26-001588",
      sequence,
      paymentCode: "MAINT-SGS",
      scheduledDate,
      amount: CIAN_AMOUNT,
      status: row.status,
      releasedDate: sent ? scheduledDate : null,
      externalReference: sent ? `FIN-2026-1588-${String(sequence).padStart(2, "0")}` : "",
      notes: row.notes,
      registrationVerified: row.verified,
      attendanceOutcome: row.attendanceOutcome,
      collegeFile: row.verified === "Yes" ? `CF-DCU-2026-${String(scheduledDate.getUTCMonth() + 1).padStart(2, "0")}` : "",
    };
  });
}

const schedules = {
  "SGS26-001588": {
    header: {
      award: "Awarded – Maintenance and fee grant",
      awardBand: "Band 2",
      maintenanceRate: `${money.format(CIAN_AMOUNT)} per month`,
      feeEntitlement: "Full fee grant",
      restrictions: "None",
      instalments: "9",
      totalScheduled: money.format(CIAN_AMOUNT * 9),
      courseDates: "14 Sep 2026 – 30 Apr 2027",
      scheduleBasis: "Standard course — nine maintenance payments",
    },
    payments: cianPayments(),
  },
  "SGS26-003276": {
    header: {
      award: "Awarded – Fee grant only",
      awardBand: "Fee grant only",
      maintenanceRate: "Not awarded",
      feeEntitlement: money.format(3000),
      restrictions: "No maintenance. Fee grant only.",
      instalments: "1",
      totalScheduled: money.format(3000),
      courseDates: "7 Sep 2026 – 14 May 2027",
      scheduleBasis: "Fee payment only",
    },
    payments: [
      {
        id: "PAY-3276-1",
        applicationNumber: "SGS26-003276",
        sequence: 1,
        paymentCode: "FEE-SGS",
        scheduledDate: on(10, 15, 2026),
        amount: 3000,
        status: "Processed",
        releasedDate: on(10, 15, 2026),
        externalReference: "FIN-2026-3276-01",
        notes: "",
        registrationVerified: "Yes",
        attendanceOutcome: "Registered",
        collegeFile: "CF-TUD-2026-10",
      },
    ],
  },
};

export function paymentScheduleFor(applicationNumber) {
  return schedules[applicationNumber] ?? null;
}

export { money };
