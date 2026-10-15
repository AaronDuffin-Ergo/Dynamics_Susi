/**
 * Mock Answer records: one per scheme question, linked to the open application.
 */

export const ANSWER_SECTIONS = [
  { id: "personal", label: "Personal Details" },
  { id: "course", label: "Course Details" },
  { id: "household", label: "Household" },
  { id: "income", label: "Income" },
  { id: "residency", label: "Residency" },
];

const QUESTIONS = [
  { id: "Q-1001", section: "personal", text: "Date of birth", core: true },
  { id: "Q-1002", section: "personal", text: "PPSN", core: true },
  { id: "Q-1003", section: "personal", text: "Nationality", core: true },
  { id: "Q-1004", section: "personal", text: "Marital status" },
  { id: "Q-2001", section: "course", text: "Institution", core: true },
  { id: "Q-2002", section: "course", text: "Course", core: true },
  { id: "Q-2003", section: "course", text: "Year of study", core: true },
  { id: "Q-2004", section: "course", text: "Previously attended third level?" },
  { id: "Q-3001", section: "household", text: "Number of dependent children in household" },
  { id: "Q-3002", section: "household", text: "Number of household members in full-time education", core: true },
  { id: "Q-3003", section: "household", text: "Parents' marital status" },
  { id: "Q-4001", section: "income", text: "Total reckonable household income 2025", core: true },
  { id: "Q-4002", section: "income", text: "Source of household income" },
  { id: "Q-4003", section: "income", text: "In receipt of social welfare payment?", core: true },
  { id: "Q-5001", section: "residency", text: "Normal residence address", core: true },
  { id: "Q-5002", section: "residency", text: "Distance from home to college (km)" },
  { id: "Q-5003", section: "residency", text: "Resident in the State for 3 of the last 5 years?", core: true },
];

const KELLY = {
  "Q-1001": { applicant: "11/11/1994" },
  "Q-1002": { applicant: "1234567TA", source: "feed", validation: "Validation Pending" },
  "Q-1003": { applicant: "Irish" },
  "Q-1004": { applicant: "Single" },
  "Q-2001": { applicant: "University College Cork" },
  "Q-2002": { applicant: "BSc Computer Science (CK401)" },
  "Q-2003": { applicant: "Year 1 – 2026/27" },
  "Q-2004": { applicant: "No" },
  "Q-3001": { applicant: "" },
  "Q-3002": { applicant: "2" },
  "Q-3003": { applicant: "Married" },
  "Q-4001": {
    applicant: "€52,400",
    assessor: "€48,950",
    reason: "Verified against Revenue P60 2025; applicant figure included non-reckonable child benefit.",
    validation: "Valid",
  },
  "Q-4002": { applicant: "PAYE employment" },
  "Q-4003": { applicant: "" },
  "Q-5001": { applicant: "14 Glenview Road, Ballincollig, Co. Cork" },
  "Q-5002": { applicant: "" },
  "Q-5003": { applicant: "Yes" },
};

function at(base, days, hour, minute = 0) {
  const date = new Date(base.getTime() + days * 86400000);
  date.setUTCHours(hour, minute, 0, 0);
  return date;
}

function genericAnswer(question, application) {
  switch (question.id) {
    case "Q-2001":
      return application.institution;
    case "Q-2002":
      return application.course;
    case "Q-2003":
      return application.pointOfEntry;
    case "Q-3002":
      return application.applicantClass === "Postgraduate" ? "1" : "";
    case "Q-5003":
      return application.status === "Draft" ? "" : "Yes";
    default:
      return "";
  }
}

export function answersFor(application) {
  const isKelly = application.applicationNumber === "SGS26-001377";
  const submitted = application.status !== "Draft";
  const questions = isKelly ? QUESTIONS : QUESTIONS.filter((question) => question.core);

  return questions.map((question, index) => {
    const preset = isKelly ? KELLY[question.id] ?? {} : {};
    const applicantAnswer = isKelly ? preset.applicant ?? "" : genericAnswer(question, application);
    const answered = Boolean(applicantAnswer);
    const lastUpdatedOn = answered
      ? at(application.submittedOn ?? application.createdOn, index % 3 ? -1 : 0, 9 + (index % 8), (index * 7) % 60)
      : application.createdOn;

    return {
      answerId: `${application.applicationNumber}-${question.id}`,
      questionId: question.id,
      question: question.text,
      section: question.section,
      sectionLabel: ANSWER_SECTIONS.find((section) => section.id === question.section).label,
      applicantAnswer,
      assessorAnswer: preset.assessor ?? "",
      assessorAnswerReason: preset.reason ?? "",
      source: preset.source ?? "applicant",
      validationStatus:
        preset.validation ?? (answered && submitted ? "Valid" : "Not Validated"),
      lastUpdatedOn,
      order: index,
    };
  });
}
