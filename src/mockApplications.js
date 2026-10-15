/**
 * Mock SUSI Application header records with lifecycle timeline activities.
 */

const SCHEMES = {
  sgs: { name: "Student Grant Scheme 2026/27", prefix: "SGS26" },
  pgf: { name: "Postgraduate Fee Grant 2026/27", prefix: "PGF26" },
  btea: { name: "Back to Education Allowance Grant 2026/27", prefix: "BTE26" },
};

const STAGES = {
  Draft: { externalStatus: "Draft – not submitted", step: 0 },
  Submitted: { externalStatus: "Application received", step: 1 },
  "Awaiting Documents": { externalStatus: "Further information required", step: 2 },
  "In Review": { externalStatus: "Being processed", step: 3 },
  "Decision Issued": { externalStatus: "Decision available", step: 4 },
};

const ASSESSORS = ["Aoife Brennan", "Declan Moran", "Niamh Gallagher", "Ronan Fitzpatrick"];

function guid(seed) {
  let h = 0x811c9dc5 ^ seed;
  const hex = () => {
    h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d);
    h = Math.imul(h ^ (h >>> 12), 0x297a2d39);
    h ^= h >>> 15;
    return (h >>> 0).toString(16).padStart(8, "0");
  };
  const a = hex();
  const b = hex();
  const c = hex();
  const d = hex();
  return `${a}-${b.slice(0, 4)}-4${b.slice(5, 8)}-a${c.slice(1, 4)}-${c.slice(4)}${d}`;
}

function at(month, day, hour, minute = 0) {
  return new Date(Date.UTC(2026, month - 1, day, hour, minute));
}

function addDays(date, days, hour, minute = 0) {
  const next = new Date(date.getTime() + days * 86400000);
  next.setUTCHours(hour, minute, 0, 0);
  return next;
}

const BASE = [
  {
    contact: "Kelly Steer",
    scheme: "sgs",
    type: "New",
    status: "Awaiting Documents",
    created: at(5, 12, 19, 42),
    course: "BSc Computer Science (CK401)",
    institution: "University College Cork",
    pointOfEntry: "Year 1 – 2026/27",
    applicantClass: "New Entrant",
    missingDocument: "Proof of 2025 household income",
  },
  {
    contact: "Cian O'Sullivan",
    scheme: "sgs",
    type: "Renewal",
    status: "Decision Issued",
    created: at(4, 22, 9, 15),
    course: "BA Business and Law (DC111)",
    institution: "Dublin City University",
    pointOfEntry: "Year 3 – 2024/25",
    applicantClass: "Continuing Student",
    previous: "SGS25-004218",
    decision: "Awarded – Maintenance and fee grant",
  },
  {
    contact: "Saoirse Kavanagh",
    scheme: "pgf",
    type: "New",
    status: "In Review",
    created: at(6, 3, 14, 5),
    course: "MSc Data Analytics (MU-MDA)",
    institution: "Maynooth University",
    pointOfEntry: "Postgraduate Year 1 – 2026/27",
    applicantClass: "Postgraduate",
  },
  {
    contact: "Oisín Doyle",
    scheme: "sgs",
    type: "New",
    status: "Draft",
    created: at(9, 28, 21, 10),
    course: "",
    institution: "",
    pointOfEntry: "",
    applicantClass: "",
  },
  {
    contact: "Aisling Murphy",
    scheme: "sgs",
    type: "Change in Record",
    status: "Submitted",
    created: at(9, 15, 11, 30),
    course: "BEng Civil Engineering (LM114)",
    institution: "University of Limerick",
    pointOfEntry: "Year 2 – 2025/26",
    applicantClass: "Continuing Student",
    previous: "SGS25-005512",
  },
  {
    contact: "Conor Walsh",
    scheme: "btea",
    type: "New",
    status: "Decision Issued",
    created: at(5, 2, 10, 0),
    course: "Higher Certificate in Science (MTU-HCS)",
    institution: "Munster Technological University",
    pointOfEntry: "Year 1 – 2026/27",
    applicantClass: "Mature Student",
    decision: "Refused – Reckonable income above threshold",
  },
  {
    contact: "Róisín Byrne",
    scheme: "sgs",
    type: "Renewal",
    status: "In Review",
    created: at(5, 19, 8, 45),
    course: "BA Psychology (TR015)",
    institution: "Trinity College Dublin",
    pointOfEntry: "Year 2 – 2025/26",
    applicantClass: "Continuing Student",
    previous: "SGS25-007731",
  },
  {
    contact: "Eoin Fitzgerald",
    scheme: "pgf",
    type: "New",
    status: "Awaiting Documents",
    created: at(7, 7, 16, 20),
    course: "Professional Master of Education (UG-PME)",
    institution: "University of Galway",
    pointOfEntry: "Postgraduate Year 1 – 2026/27",
    applicantClass: "Postgraduate",
    missingDocument: "Evidence of independent residence",
  },
  {
    contact: "Ciara Nolan",
    scheme: "sgs",
    type: "New",
    status: "Submitted",
    created: at(8, 21, 13, 55),
    course: "BSc Nursing – General (SE901)",
    institution: "South East Technological University",
    pointOfEntry: "Year 1 – 2026/27",
    applicantClass: "New Entrant",
  },
  {
    contact: "Darragh Kelly",
    scheme: "sgs",
    type: "Renewal",
    status: "Decision Issued",
    created: at(4, 18, 20, 30),
    course: "BSc Architecture (TU-ARC)",
    institution: "Technological University Dublin",
    pointOfEntry: "Year 4 – 2023/24",
    applicantClass: "Continuing Student",
    previous: "SGS25-002904",
    decision: "Awarded – Fee grant only",
  },
  {
    contact: "Méabh Quinn",
    scheme: "sgs",
    type: "New",
    status: "Draft",
    created: at(10, 6, 18, 5),
    course: "BA Early Childhood Education (AU-ECE)",
    institution: "Atlantic Technological University",
    pointOfEntry: "Year 1 – 2026/27",
    applicantClass: "",
  },
  {
    contact: "Patrick Healy",
    scheme: "btea",
    type: "Renewal",
    status: "In Review",
    created: at(6, 25, 9, 40),
    course: "BA Social Care Practice (TU-SCP)",
    institution: "Technological University Dublin",
    pointOfEntry: "Year 2 – 2025/26",
    applicantClass: "Mature Student",
    previous: "BTE25-000612",
  },
];

function buildEvents(app, index) {
  const { step } = STAGES[app.status];
  const assessor = ASSESSORS[index % ASSESSORS.length];
  const ref = app.applicationNumber;
  const events = [];
  const created = app.createdOn;

  events.push({
    id: `${ref}-created`,
    kind: "autoPost",
    at: created,
    title: "Draft application created",
    body: `Created on first save in the portal. Blank answers pre-created for all questions applicable to ${app.schemeName}.`,
  });

  const savedOn = addDays(created, 2, 20, 14);
  events.push({
    id: `${ref}-saved`,
    kind: "portal",
    at: savedOn,
    actor: app.contactName,
    title: "Portal Activity from",
    state: "Closed",
    summary: "Application saved as draft",
    body:
      step === 0 && !app.course
        ? "Personal details confirmed from registration. Course and institution not yet selected."
        : `Answers saved for Personal details, Household and Course sections. Course selected: ${app.course || "not selected"}.`,
  });

  if (step === 0) return events.sort((a, b) => b.at - a.at);

  events.push({
    id: `${ref}-submitted`,
    kind: "portal",
    at: app.submittedOn,
    actor: app.contactName,
    title: "Portal Activity from",
    state: "Closed",
    summary: "Application submitted",
    body: `Declaration accepted and application submitted. Point of entry calculated as ${app.pointOfEntry}; applicant class set to ${app.applicantClass}.`,
  });

  events.push({
    id: `${ref}-status-submitted`,
    kind: "autoPost",
    at: addDays(app.submittedOn, 0, app.submittedOn.getUTCHours(), app.submittedOn.getUTCMinutes() + 1),
    title: "Status changed",
    body: "Application Status changed from Draft to Submitted by SUSI Application Process.",
  });

  if (step === 2 || step >= 3) {
    const requestedOn = addDays(app.submittedOn, 6, 10, 5);
    const document = app.missingDocument ?? "Proof of 2025 household income";
    events.push({
      id: `${ref}-doc-request`,
      kind: "task",
      at: requestedOn,
      actor: assessor,
      title: "Document Request by",
      state: step === 2 ? "Open" : "Closed",
      summary: document,
      body: `Requested ${document.toLowerCase()} to complete the means assessment. Due within 14 days.`,
    });
    events.push({
      id: `${ref}-doc-email`,
      kind: "email",
      at: addDays(requestedOn, 0, 10, 12),
      actor: "SUSI Notifications",
      title: "Email from",
      state: "Sent",
      summary: "Further information required for your application",
      body: `Dear ${app.contactName.split(" ")[0]}, we need some more information before we can continue processing application ${ref}. Please upload ${document.toLowerCase()} in the portal.`,
    });
  }

  if (step >= 3) {
    events.push({
      id: `${ref}-assessment`,
      kind: "task",
      at: addDays(app.submittedOn, 15, 9, 30),
      actor: assessor,
      title: "Assessment Task for",
      state: step === 3 ? "Open" : "Closed",
      summary: "Means and eligibility assessment",
      body: "BRE output reviewed. Nationality, residency and progression checks passed; reckonable income assessment in progress.",
    });
  }

  if (step === 4) {
    const decidedOn = addDays(app.submittedOn, 24, 15, 0);
    events.push({
      id: `${ref}-decision`,
      kind: "autoPost",
      at: decidedOn,
      title: "Decision recorded",
      body: `Decision set to "${app.decision}" by ${assessor}.`,
    });
    events.push({
      id: `${ref}-decision-email`,
      kind: "email",
      at: addDays(decidedOn, 0, 15, 20),
      actor: "SUSI Notifications",
      title: "Email from",
      state: "Sent",
      summary: "Your grant decision is available",
      body: `Dear ${app.contactName.split(" ")[0]}, a decision has been made on application ${ref}. Log in to the SUSI portal to view your decision letter and appeal options.`,
    });
  }

  return events.sort((a, b) => b.at - a.at);
}

export const mockApplications = BASE.map((base, index) => {
  const scheme = SCHEMES[base.scheme];
  const stage = STAGES[base.status];
  const applicationNumber = `${scheme.prefix}-${String(1377 + index * 211).padStart(6, "0")}`;
  const submittedOn = stage.step > 0 ? addDays(base.created, 3 + (index % 4), 9 + ((index * 5) % 12), (index * 17) % 60) : null;

  const app = {
    applicationId: guid(index + 1),
    applicationNumber,
    contactName: base.contact,
    schemeName: scheme.name,
    applicationType: base.type,
    status: base.status,
    externalStatus: stage.externalStatus,
    createdOn: base.created,
    createdBy: base.type === "Renewal" ? "SUSI Renewal Process" : `${base.contact} (Applicant)`,
    submittedOn,
    course: base.course,
    institution: base.institution,
    pointOfEntry: base.pointOfEntry,
    applicantClass: base.applicantClass,
    previousApplication: base.previous ?? "",
    decision: base.decision ?? "",
    missingDocument: base.missingDocument,
  };

  return { ...app, timeline: buildEvents(app, index) };
});
