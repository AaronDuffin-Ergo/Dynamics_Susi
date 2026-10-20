/**
 * Sample Approval Log rows. Each row is one approval transaction
 * regarding an application. Appeal and case records are not in this mock.
 */

function at(month, day, hour, minute = 0) {
  return new Date(Date.UTC(2026, month - 1, day, hour, minute));
}

export const mockApprovalLogs = [
  {
    id: "APL-1001",
    name: "Exceptional circumstances",
    regarding: "SGS26-001377",
    requestedBy: "Aoife Brennan",
    requestedOn: at(6, 20, 9, 15),
    approver: "Niamh Gallagher",
    approvalStatus: "Pending",
    approvalOutcome: "",
    approverComments: "",
    responseDate: null,
  },
  {
    id: "APL-1002",
    name: "Exceptional Circumstances Application",
    regarding: "SGS26-001377",
    requestedBy: "Declan Moran",
    requestedOn: at(6, 12, 14, 40),
    approver: "Niamh Gallagher",
    approvalStatus: "Rejected",
    approvalOutcome: "Rejected",
    approverComments: "please request more information as evidence.",
    responseDate: at(6, 13, 11, 5),
  },
  {
    id: "APL-1004",
    name: "Grant award approval",
    regarding: "SGS26-001588",
    requestedBy: "SUSI BRE Service Account",
    requestedOn: at(5, 20, 15, 0),
    approver: "Niamh Gallagher",
    approvalStatus: "Approved",
    approvalOutcome: "Approved",
    approverComments: "Maintenance and fee grant confirmed from the BRE output.",
    responseDate: at(5, 20, 16, 12),
  },
  {
    id: "APL-1005",
    name: "Postgraduate fee assessment",
    regarding: "PGF26-001799",
    requestedBy: "Declan Moran",
    requestedOn: at(6, 22, 10, 5),
    approver: "Aoife Brennan",
    approvalStatus: "Pending",
    approvalOutcome: "",
    approverComments: "",
    responseDate: null,
  },
  {
    id: "APL-1006",
    name: "Withdraw submitted application",
    regarding: "SGS26-002221",
    requestedBy: "Aoife Brennan",
    requestedOn: at(6, 8, 9, 15),
    approver: "Niamh Gallagher",
    approvalStatus: "Cancelled",
    approvalOutcome: "",
    approverComments: "Applicant asked for the approval to be withdrawn before review.",
    responseDate: null,
  },
  {
    id: "APL-1007",
    name: "BRE approval handoff",
    regarding: "BTE26-003698",
    requestedBy: "SUSI BRE Service Account",
    requestedOn: at(7, 2, 8, 45),
    approver: "Declan Moran",
    approvalStatus: "Failed",
    approvalOutcome: "",
    approverComments: "The approval step did not complete. The request can be sent again.",
    responseDate: at(7, 2, 8, 46),
  },
];

export function approvalLogsFor(applicationNumber) {
  return mockApprovalLogs.filter((row) => row.regarding === applicationNumber);
}
