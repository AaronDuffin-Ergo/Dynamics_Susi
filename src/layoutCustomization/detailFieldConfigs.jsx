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

export const DEVELOPMENT_DETAIL_FIELDS = [
  {
    id: "name",
    label: "Name",
    required: true,
    lockControlType: true,
    render: (d) => <FluentInput readOnly value={d.name} className="mda-input" />,
  },
  {
    id: "location",
    label: "Location",
    required: true,
    getDisplayValue: (d) => d.location,
    render: (d) => <FluentInput readOnly value={d.location} className="mda-input" />,
  },
  {
    id: "developmentId",
    label: "Development ID",
    getDisplayValue: (d) => d.developmentId,
    render: (d) => <FluentInput readOnly value={d.developmentId} className="mda-input" />,
  },
  {
    id: "status",
    label: "Status",
    getDisplayValue: (d) => d.status,
    render: (d) => <FluentInput readOnly value={d.status} className="mda-input" />,
  },
  {
    id: "totalUnits",
    label: "Total units",
    getDisplayValue: (d) => String(d.totalUnits),
    render: (d) => <FluentInput readOnly value={String(d.totalUnits)} className="mda-input" />,
  },
  {
    id: "createdOn",
    label: "Record created",
    getDisplayValue: (_d, ctx) => ctx.createdLabel ?? "",
    render: (d, ctx) => <FluentInput readOnly value={ctx.createdLabel ?? ""} className="mda-input" />,
  },
  {
    id: "owner",
    label: "Owner",
    lockControlType: true,
    render: (d) => (
      <div className="mda-detail-row__owner">
        <Avatar name={d.ownerName} size={20} color="colorful" />
        <FluentInput readOnly value={d.ownerName} className="mda-input mda-detail-row__owner-input" />
      </div>
    ),
  },
];

export const PROPERTY_DETAIL_FIELDS = [
  {
    id: "propertyId",
    label: "Property ID",
    required: true,
    getDisplayValue: (p) => p.propertyId,
    render: (p) => <FluentInput readOnly value={p.propertyId} className="mda-input" />,
  },
  {
    id: "type",
    label: "Type",
    required: true,
    getDisplayValue: (p) => p.type,
    render: (p) => <FluentInput readOnly value={p.type} className="mda-input" />,
  },
  {
    id: "bedrooms",
    label: "Bedrooms",
    required: true,
    getDisplayValue: (p) => String(p.bedrooms ?? ""),
    render: (p) => <FluentInput readOnly value={String(p.bedrooms ?? "")} className="mda-input" />,
  },
  {
    id: "price",
    label: "Price",
    required: true,
    getDisplayValue: (_p, ctx) => ctx.priceLabel ?? "",
    render: (p, ctx) => <FluentInput readOnly value={ctx.priceLabel ?? ""} className="mda-input" />,
  },
  {
    id: "status",
    label: "Status",
    required: true,
    getDisplayValue: (p) => p.status,
    render: (p) => <FluentInput readOnly value={p.status} className="mda-input" />,
  },
  {
    id: "development",
    label: "Development",
    lockControlType: true,
    render: (p, ctx) => (
      <button
        type="button"
        className="dynamics-grid-link"
        onClick={() => ctx.onOpenDevelopment?.(p.developmentId)}
      >
        {p.developmentName}
      </button>
    ),
  },
  {
    id: "developmentId",
    label: "Development ID",
    getDisplayValue: (p) => p.developmentId,
    render: (p) => <FluentInput readOnly value={p.developmentId} className="mda-input" />,
  },
];

export const BUYER_DETAIL_FIELDS = [
  {
    id: "buyerId",
    label: "Buyer ID",
    required: true,
    getDisplayValue: (b) => b.buyerId,
    render: (b) => <FluentInput readOnly value={b.buyerId} className="mda-input" />,
  },
  {
    id: "fullName",
    label: "Name",
    required: true,
    lockControlType: true,
    render: (b) => <FluentInput readOnly value={b.fullName} className="mda-input" />,
  },
  {
    id: "email",
    label: "Email",
    required: true,
    getDisplayValue: (b) => b.email,
    render: (b) => <FluentInput readOnly value={b.email} className="mda-input" />,
  },
  {
    id: "phone",
    label: "Phone",
    required: true,
    getDisplayValue: (b) => b.phone,
    render: (b) => <FluentInput readOnly value={b.phone} className="mda-input" />,
  },
  {
    id: "interestedDevelopment",
    label: "Interested development",
    lockControlType: true,
    render: (b, ctx) => (
      <button
        type="button"
        className="dynamics-grid-link"
        onClick={() => ctx.onOpenDevelopment?.(b.interestedDevelopmentId)}
      >
        {b.interestedDevelopmentName}
      </button>
    ),
  },
  {
    id: "interestedDevelopmentId",
    label: "Development ID",
    getDisplayValue: (b) => b.interestedDevelopmentId,
    render: (b) => <FluentInput readOnly value={b.interestedDevelopmentId} className="mda-input" />,
  },
];

export const CONTRACT_DETAIL_FIELDS = [
  {
    id: "contractId",
    label: "Contract ID",
    required: true,
    section: "basic",
    sectionLabel: "Basic Information",
    getDisplayValue: (c) => c.contractId,
    render: (c) => <FluentInput readOnly value={c.contractId} className="mda-input" />,
  },
  {
    id: "status",
    label: "Status",
    required: true,
    section: "basic",
    sectionLabel: "Basic Information",
    getDisplayValue: (c) => c.status,
    render: (c) => <FluentInput readOnly value={c.status} className="mda-input" />,
  },
  {
    id: "contractDate",
    label: "Date",
    required: true,
    section: "basic",
    sectionLabel: "Basic Information",
    getDisplayValue: (_c, ctx) => ctx.contractDateLabel ?? "",
    render: (c, ctx) => <FluentInput readOnly value={ctx.contractDateLabel ?? ""} className="mda-input" />,
  },
  {
    id: "buyerName",
    label: "Buyer",
    required: true,
    section: "relationships",
    sectionLabel: "Relationships",
    getDisplayValue: (c) => c.buyerName,
    render: (c) => <FluentInput readOnly value={c.buyerName} className="mda-input" />,
  },
  {
    id: "buyerId",
    label: "Buyer ID",
    section: "relationships",
    sectionLabel: "Relationships",
    getDisplayValue: (c) => c.buyerId,
    render: (c) => <FluentInput readOnly value={c.buyerId} className="mda-input" />,
  },
  {
    id: "propertyLabel",
    label: "Property",
    required: true,
    section: "relationships",
    sectionLabel: "Relationships",
    getDisplayValue: (c) => c.propertyLabel,
    render: (c) => <FluentInput readOnly value={c.propertyLabel} className="mda-input" />,
  },
  {
    id: "propertyId",
    label: "Property ID",
    section: "relationships",
    sectionLabel: "Relationships",
    getDisplayValue: (c) => c.propertyId,
    render: (c) => <FluentInput readOnly value={c.propertyId} className="mda-input" />,
  },
];

export const SALES_STAFF_DETAIL_FIELDS = [
  {
    id: "name",
    label: "Name",
    required: true,
    section: "basic",
    sectionLabel: "Basic Information",
    lockControlType: true,
    render: (s) => <FluentInput readOnly value={s.name} className="mda-input" />,
  },
  {
    id: "role",
    label: "Role",
    required: true,
    section: "basic",
    sectionLabel: "Basic Information",
    getDisplayValue: (s) => s.role,
    render: (s) => <FluentInput readOnly value={s.role} className="mda-input" />,
  },
  {
    id: "email",
    label: "Email",
    required: true,
    section: "basic",
    sectionLabel: "Basic Information",
    getDisplayValue: (s) => s.email,
    render: (s) => <FluentInput readOnly value={s.email} className="mda-input" />,
  },
  {
    id: "assignedDevelopmentName",
    label: "Assigned Development",
    required: true,
    section: "organisation",
    sectionLabel: "Organisation Details",
    getDisplayValue: (s) => s.assignedDevelopmentName,
    render: (s) => <FluentInput readOnly value={s.assignedDevelopmentName} className="mda-input" />,
  },
  {
    id: "createdOn",
    label: "Created On",
    section: "organisation",
    sectionLabel: "Organisation Details",
    getDisplayValue: (_s, ctx) => ctx.createdLabel ?? "",
    render: (s, ctx) => <FluentInput readOnly value={ctx.createdLabel ?? ""} className="mda-input" />,
  },
];
