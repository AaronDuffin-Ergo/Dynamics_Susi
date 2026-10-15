export const DOCUMENT_TYPES = [
  {
    id: "DT-INC",
    name: "Proof of household income",
    applicantInstructions:
      "Upload evidence of total household income for 2025, such as a P60, statement of liability, or social welfare statement.",
    predefinedFormLink: "https://www.susi.ie/forms/household-income",
    filenamePrefix: "INC",
    expire: "Yes",
    requestType: "Required for assessment",
  },
  {
    id: "DT-P60",
    name: "P60",
    applicantInstructions: "Upload the P60 for each employed person in the household for the 2025 tax year.",
    predefinedFormLink: "https://www.susi.ie/forms/p60",
    filenamePrefix: "P60",
    expire: "Yes",
    requestType: "Required for assessment",
  },
  {
    id: "DT-ADDR",
    name: "Proof of address",
    applicantInstructions: "Upload a utility bill or bank statement, dated within the last three months, showing the home address.",
    predefinedFormLink: "https://www.susi.ie/forms/proof-of-address",
    filenamePrefix: "ADDR",
    expire: "Yes",
    requestType: "Required for assessment",
  },
  {
    id: "DT-FOR",
    name: "Foreign payment form",
    applicantInstructions: "Complete the foreign payment form if a parent or the applicant was paid outside the State.",
    predefinedFormLink: "https://www.susi.ie/forms/foreign-payment",
    filenamePrefix: "FOR",
    expire: "No",
    requestType: "Revisit document",
  },
  {
    id: "DT-REV",
    name: "Revisit declaration",
    applicantInstructions: "Complete this declaration only if SUSI asks you to revisit a document already supplied.",
    predefinedFormLink: "https://www.susi.ie/forms/revisit",
    filenamePrefix: "REV",
    expire: "No",
    requestType: "Revisit document",
  },
];

export const RELATIONSHIPS = ["Applicant", "Mother", "Father", "Spouse", "Partner", "Other"];

export const REQUEST_TYPES = ["Required for assessment", "Revisit document"];

export function emptyDocumentRequest(applicationNumber) {
  return {
    documentTypeId: "",
    relationship: "Applicant",
    assessorComment: "",
    applicantInstructions: "",
    predefinedFormLink: "",
    filenamePrefix: "",
    requestedOn: "",
    expire: "Yes",
    expiryDate: "",
    status: "Draft",
    requestedBy: "Aoife Brennan",
    submittedOn: "",
    completedOn: "",
    requestType: "Required for assessment",
    regarding: applicationNumber,
  };
}
