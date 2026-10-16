/**
 * Sample SGAB Appeal records. Each one is linked to an application.
 * A previous SUSI appeal is recorded only when one exists.
 */

function on(month, day) {
  return new Date(Date.UTC(2026, month - 1, day));
}

export const mockSgabAppeals = [
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
  },
];

export function sgabAppealsFor(applicationNumber) {
  return mockSgabAppeals.filter((appeal) => appeal.applicationNumber === applicationNumber);
}
