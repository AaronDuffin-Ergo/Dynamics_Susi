import { Avatar, Input as FluentInput } from "@fluentui/react-components";

const EMPTY_VALUE = "—";

function displayOrEmpty(value) {
  return value ? String(value) : EMPTY_VALUE;
}

function readOnlyField(id, label, section, sectionLabel, getValue, extra = {}) {
  return {
    id,
    label,
    section,
    sectionLabel,
    getDisplayValue: (record, ctx) => displayOrEmpty(getValue(record, ctx)),
    render: (record, ctx) => (
      <FluentInput readOnly value={displayOrEmpty(getValue(record, ctx))} className="mda-input" />
    ),
    ...extra,
  };
}

function lookupField(id, label, section, sectionLabel, getValue, getOnOpen, extra = {}) {
  return {
    id,
    label,
    section,
    sectionLabel,
    lockControlType: true,
    getDisplayValue: (record) => displayOrEmpty(getValue(record)),
    render: (record, ctx) => {
      const value = getValue(record);
      if (!value) return <FluentInput readOnly value={EMPTY_VALUE} className="mda-input" />;
      const onOpen = getOnOpen?.(record, ctx);
      return (
        <button
          type="button"
          className="dynamics-grid-link mda-detail-row__lookup"
          onClick={onOpen ?? undefined}
          title={onOpen ? `Open ${value}` : value}
        >
          {value}
        </button>
      );
    },
    ...extra,
  };
}

export const APPLICATION_DETAIL_FIELDS = [
  readOnlyField("applicationNumber", "Application Number", "application", "Application", (a) => a.applicationNumber, {
    required: true,
  }),
  readOnlyField("applicationId", "Application ID", "application", "Application", (a) => a.applicationId),
  readOnlyField("applicationType", "Application Type", "application", "Application", (a) => a.applicationType, {
    required: true,
  }),
  readOnlyField("status", "Application Status", "application", "Application", (a) => a.status, { required: true }),
  readOnlyField("externalStatus", "External Status", "application", "Application", (a) => a.externalStatus),
  readOnlyField("decision", "Decision", "application", "Application", (a) => a.decision),
  {
    id: "contact",
    label: "Contact",
    required: true,
    section: "applicant",
    sectionLabel: "Applicant and Scheme",
    lockControlType: true,
    getDisplayValue: (a) => a.contactName,
    render: (a) => (
      <div className="mda-detail-row__owner">
        <Avatar name={a.contactName} size={20} color="colorful" />
        <button type="button" className="dynamics-grid-link mda-detail-row__lookup">
          {a.contactName}
        </button>
      </div>
    ),
  },
  lookupField("scheme", "Scheme", "applicant", "Applicant and Scheme", (a) => a.schemeName, null, {
    required: true,
  }),
  lookupField(
    "previousApplication",
    "Previous Application",
    "applicant",
    "Applicant and Scheme",
    (a) => a.previousApplication,
    (a, ctx) =>
      ctx.hasApplication?.(a.previousApplication) ? () => ctx.onOpenApplication(a.previousApplication) : null,
  ),
  lookupField("course", "Course", "study", "Course and Eligibility", (a) => a.course),
  lookupField("institution", "Institution", "study", "Course and Eligibility", (a) => a.institution),
  readOnlyField("pointOfEntry", "Point of Entry", "study", "Course and Eligibility", (a) => a.pointOfEntry),
  readOnlyField("applicantClass", "Applicant Class", "study", "Course and Eligibility", (a) => a.applicantClass),
  readOnlyField("createdOn", "Created On", "audit", "Audit", (_a, ctx) => ctx.createdLabel),
  readOnlyField("createdBy", "Created By", "audit", "Audit", (a) => a.createdBy),
  readOnlyField("submittedOn", "Submitted On", "audit", "Audit", (_a, ctx) => ctx.submittedLabel),
];
