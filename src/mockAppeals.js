/**
 * Sample Appeal records. Each appeal belongs to one application
 * that already has a decision.
 */

function on(month, day) {
  return new Date(Date.UTC(2026, month - 1, day));
}

function at(month, day, hour, minute = 0) {
  return new Date(Date.UTC(2026, month - 1, day, hour, minute));
}

export const mockAppeals = [
  {
    appealNumber: "AP26-000141",
    applicationNumber: "SGS26-001588",
    contactName: "Cian O'Sullivan",
    schemeName: "Student Grant Scheme 2026/27",
    appealType: "Income Appeal",
    status: "Upheld",
    closureCategory: "Vary",
    originalDecision: "Approved",
    originalDecisionDate: on(5, 20),
    originalAppealDeadline: on(6, 19),
    revisedAppealDeadline: on(7, 3),
    submittedOn: at(6, 2, 9, 40),
    additionalComments:
      "The household income used for the award does not include my mother's reduced hours from March.",
    appealOutcome: "Upheld",
    appealDecisionDate: on(6, 18),
    extensionRequestedOn: at(6, 16, 11, 15),
    extensionRequestComment: "I was waiting on an updated P60 from my mother's employer.",
    extensionDecision: "Approved",
    extensionAssessorComment: "Extension of 14 days granted. Evidence received within the revised deadline.",
    extensionDecidedBy: "Niamh Gallagher",
    extensionDecidedOn: at(6, 16, 15, 40),
  },
  {
    appealNumber: "AP26-000142",
    applicationNumber: "BTE26-002432",
    contactName: "Conor Walsh",
    schemeName: "Back to Education Allowance Grant 2026/27",
    appealType: "Refusal Appeal",
    status: "Awaiting Documents",
    closureCategory: "",
    originalDecision: "Refused",
    originalDecisionDate: on(5, 15),
    originalAppealDeadline: on(6, 14),
    revisedAppealDeadline: null,
    submittedOn: at(5, 28, 16, 5),
    additionalComments: "My reckonable income was assessed on a bonus that will not be paid again.",
    appealOutcome: "",
    appealDecisionDate: null,
    extensionRequestedOn: null,
    extensionRequestComment: "",
    extensionDecision: "",
    extensionAssessorComment: "",
    extensionDecidedBy: "",
    extensionDecidedOn: null,
  },
  {
    appealNumber: "AP26-000143",
    applicationNumber: "SGS26-003276",
    contactName: "Darragh Kelly",
    schemeName: "Student Grant Scheme 2026/27",
    appealType: "Extension Request",
    status: "Closed",
    closureCategory: "",
    originalDecision: "Approved",
    originalDecisionDate: on(5, 10),
    originalAppealDeadline: on(6, 9),
    revisedAppealDeadline: on(6, 23),
    submittedOn: at(6, 8, 10, 20),
    additionalComments: "I need more time to gather the fee-grant evidence from the college.",
    appealOutcome: "",
    appealDecisionDate: null,
    extensionRequestedOn: at(6, 8, 10, 20),
    extensionRequestComment: "The college has not yet issued the fee statement for 2026/27.",
    extensionDecision: "Approved",
    extensionAssessorComment: "14-day extension approved. Revised deadline is 23 June 2026.",
    extensionDecidedBy: "Aoife Brennan",
    extensionDecidedOn: at(6, 8, 14, 0),
  },
];

export function appealsFor(applicationNumber) {
  return mockAppeals.filter((appeal) => appeal.applicationNumber === applicationNumber);
}
