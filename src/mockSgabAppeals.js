/**
 * Sample SGAB Appeal records. Each one is linked to an application.
 * A previous SUSI appeal is recorded only when one exists.
 */

function on(month, day) {
  return new Date(Date.UTC(2026, month - 1, day));
}

function atTime(date, hour, minute) {
  const next = new Date(date.getTime());
  next.setUTCHours(hour, minute, 0, 0);
  return next;
}

function buildTimeline(appeal) {
  const events = [
    {
      id: `${appeal.sgabAppealNumber}-email`,
      kind: "email",
      at: atTime(appeal.receivedDate, 9, 12),
      actor: "SGAB",
      title: "Email from",
      state: "Received",
      summary: `SGAB reference ${appeal.sgabReference}`,
      body: `Email received from SGAB about ${appeal.contactName}. Reference ${appeal.sgabReference}. Linked to application ${appeal.applicationNumber}.`,
    },
    {
      id: `${appeal.sgabAppealNumber}-created`,
      kind: "autoPost",
      at: atTime(appeal.receivedDate, 9, 14),
      title: "SGAB appeal created",
      body: `${appeal.sgabAppealNumber} was created from the SGAB email and linked to ${appeal.applicationNumber}.`,
    },
    {
      id: `${appeal.sgabAppealNumber}-task`,
      kind: "task",
      at: atTime(appeal.receivedDate, 11, 5),
      actor: "Aoife Brennan",
      title: "Task for",
      state: appeal.determinationReceived === "Yes" ? "Closed" : "Open",
      summary: "Review the SGAB escalation",
      body: `Review the SUSI appeal history for ${appeal.contactName} and prepare the file for SGAB.`,
    },
  ];
  if (appeal.determinationReceived === "Yes" && appeal.determinationDate) {
    events.push({
      id: `${appeal.sgabAppealNumber}-determination`,
      kind: "email",
      at: atTime(appeal.determinationDate, 15, 40),
      actor: "SGAB",
      title: "Email from",
      state: "Received",
      summary: "Determination received",
      body: appeal.determinationOutcome || "SGAB sent the determination on this appeal.",
    });
  }
  return events.sort((a, b) => b.at - a.at);
}

const records = [
  {
    sgabAppealNumber: "SGAB26-000201",
    applicationNumber: "SGS26-001588",
    contactName: "Cian O'Sullivan",
    schemeName: "Student Grant Scheme 2026/27",
    sgabReference: "SGAB/2026/01482",
    receivedDate: on(7, 2),
    appealStatus: "Determination Issued",
    previousSusiAppealExists: "Yes",
    determinationReceived: "Yes",
    determinationDate: on(8, 18),
    determinationOutcome: "Allowed — original decision set aside",
    owner: "Niamh Gallagher",
    description: "Appeal received from SGAB regarding the household income assessment.",
    relatedAppealNumber: "AP26-000141",
    relatedAppealOfficer: "Declan Moran",
    relatedAppealStatus: "Rejected",
  },
  {
    sgabAppealNumber: "SGAB26-000202",
    applicationNumber: "SGS26-003276",
    contactName: "Darragh Kelly",
    schemeName: "Student Grant Scheme 2026/27",
    sgabReference: "SGAB/2026/01604",
    receivedDate: on(7, 8),
    appealStatus: "Awaiting Determination",
    previousSusiAppealExists: "Yes",
    determinationReceived: "No",
    determinationDate: null,
    determinationOutcome: "",
    owner: "Aoife Brennan",
    description: "Appeal received from SGAB about the fee-only award.",
    relatedAppealNumber: "AP26-000143",
    relatedAppealOfficer: "Aoife Brennan",
    relatedAppealStatus: "Closed",
  },
  {
    sgabAppealNumber: "SGAB26-000203",
    applicationNumber: "BTE26-003698",
    contactName: "Patrick Healy",
    schemeName: "Back to Education Allowance Grant 2026/27",
    sgabReference: "SGAB/2026/01715",
    receivedDate: on(7, 21),
    appealStatus: "Received",
    previousSusiAppealExists: "No",
    determinationReceived: "No",
    determinationDate: null,
    determinationOutcome: "",
    owner: "Declan Moran",
    description: "Appeal received directly from SGAB. No SUSI appeal was lodged first.",
    relatedAppealNumber: "",
    relatedAppealOfficer: "",
    relatedAppealStatus: "",
  },
];

export const mockSgabAppeals = records.map((appeal) => ({
  ...appeal,
  timeline: buildTimeline(appeal),
}));

export function sgabAppealsFor(applicationNumber) {
  return mockSgabAppeals.filter((appeal) => appeal.applicationNumber === applicationNumber);
}
