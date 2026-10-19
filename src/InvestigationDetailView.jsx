import { Avatar, Button as FluentButton, Input as FluentInput, Textarea } from "@fluentui/react-components";
import {
  ArrowClockwiseRegular,
  ArrowLeftRegular,
  ChevronDownRegular,
  FlowRegular,
  PersonAddRegular,
  SaveRegular,
  ShareRegular,
} from "@fluentui/react-icons";
import DynamicsAppShell from "./shell/DynamicsAppShell.jsx";
import "./StudentsGrid.css";
import "./StudentDetailView.css";

const disabledCommand = { appearance: "subtle", type: "button", disabled: true, title: "Preview only" };

const dateOnly = new Intl.DateTimeFormat(undefined, {
  month: "numeric",
  day: "numeric",
  year: "numeric",
});

function show(value) {
  return value === undefined || value === null || value === "" ? "—" : String(value);
}

function showDate(value) {
  return value ? dateOnly.format(value) : "—";
}

function Field({ label, value, multiline = false, wide = false, children }) {
  return (
    <div className={`mda-detail-row${multiline ? " mda-detail-row--top" : ""}${wide ? " mda-detail-row--wide" : ""}`}>
      <label className="mda-detail-row__label">
        <span className="mda-detail-row__label-text">{label}</span>
      </label>
      <div className="mda-detail-row__control">
        <div className="mda-detail-row__control-field">
          <span className="mda-detail-row__req" aria-hidden="true" />
          <div className="mda-detail-row__control-inner">
            {children ??
              (multiline ? (
                <Textarea readOnly value={value} className="mda-input" resize="none" rows={3} />
              ) : (
                <FluentInput readOnly value={value} className="mda-input" />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Lookup({ children, onOpen }) {
  return (
    <button type="button" className="dynamics-grid-link mda-detail-row__lookup" onClick={onOpen}>
      {children}
    </button>
  );
}

function SummaryField({ primary, caption }) {
  return (
    <div className="mda-record-header__summary-field">
      <div className="mda-record-header__summary-top">
        <span className="mda-record-header__summary-strong">{primary || "—"}</span>
      </div>
      <span className="mda-record-header__summary-caption">{caption}</span>
    </div>
  );
}

export default function InvestigationDetailView({
  investigation,
  onBack,
  onOpenAccount,
  onOpenContact,
  onOpenApplication,
  onNavigateHome,
  sitemapCollapsed = false,
  onToggleSitemap,
}) {
  const ombudsman = investigation.investigationType === "Ombudsman";

  return (
    <DynamicsAppShell
      activeNav="complianceInvestigations"
      appClassName="mda-new-record mda-detail-record"
      headerVariant="detail"
      onNavigateHome={onNavigateHome}
      sitemapCollapsed={sitemapCollapsed}
      onToggleSitemap={onToggleSitemap}
    >
      <main className="dynamics-main mda-record-main">
        <div className="mda-record-commandbar" role="toolbar" aria-label="Record commands">
          <FluentButton appearance="subtle" icon={<ArrowLeftRegular fontSize={16} />} onClick={onBack} type="button" aria-label="Back to compliance investigations" />
          <FluentButton {...disabledCommand} icon={<SaveRegular fontSize={16} />}>Save</FluentButton>
          <FluentButton {...disabledCommand} icon={<SaveRegular fontSize={16} />}>Save &amp; Close</FluentButton>
          <FluentButton {...disabledCommand} icon={<ArrowClockwiseRegular fontSize={16} />}>Refresh</FluentButton>
          <FluentButton {...disabledCommand} icon={<PersonAddRegular fontSize={16} />}>Assign</FluentButton>
          <FluentButton {...disabledCommand} icon={<FlowRegular fontSize={16} />} iconPosition="before">
            <span className="mda-commandbar__flow-label">Flow <ChevronDownRegular fontSize={12} /></span>
          </FluentButton>
          <span className="mda-record-commandbar__spacer" aria-hidden="true" />
          <FluentButton {...disabledCommand} icon={<ShareRegular fontSize={16} />} iconPosition="before">
            <span className="mda-commandbar__flow-label">Share <ChevronDownRegular fontSize={12} /></span>
          </FluentButton>
        </div>

        <div className="mda-record-workspace">
          <div className="mda-record-form mda-detail-page-layout">
            <section className="mda-record-card mda-record-card--summary-band" aria-labelledby="investigation-title">
              <header className="mda-record-header mda-record-header--detail">
                <div className="mda-record-header__main mda-application-header__main">
                  <Avatar name={investigation.relatedApplicant} size={40} color="neutral" />
                  <div>
                    <h2 id="investigation-title" className="mda-record-header__title mda-record-header__title--primary">
                      <span className="mda-record-header__title-id">{investigation.investigationNumber}</span>
                      <span className="mda-record-header__title-sep"> - </span>
                      <span className="mda-record-header__title-saved">Saved</span>
                    </h2>
                    <p className="mda-record-header__subtitle">Compliance Investigation · {investigation.investigationType}</p>
                  </div>
                </div>
                <div className="mda-record-header__summary">
                  <div className="mda-record-header__context">
                    <SummaryField primary={investigation.investigationType} caption="Investigation Type" />
                    <SummaryField primary={investigation.status} caption="Status" />
                    <SummaryField primary={investigation.requestingOrganisation} caption="Requesting Organisation" />
                    <SummaryField primary={showDate(investigation.dueDate)} caption="Due Date" />
                  </div>
                </div>
              </header>
            </section>

            <section className="mda-record-card mda-record-card--form" aria-label="Compliance investigation details">
              <div className="mda-detail-columns mda-contact-form">
                <p className="mda-form-section__title mda-form-section__title--first">Investigation</p>
                <Field label="Investigation Number" value={investigation.investigationNumber} />
                <Field label="Investigation Type" value={investigation.investigationType} />
                <Field label="Status" value={investigation.status} />
                <Field label="Escalated" value={investigation.escalated} />
                <Field label="Received Date" value={showDate(investigation.receivedDate)} />
                <Field label="Due Date" value={showDate(investigation.dueDate)} />
                <Field label="Linked Applications Count" value={String(investigation.linkedApplicationsCount)} />
                <Field label="Linked Case Count" value={String(investigation.linkedCaseCount)} />
                <Field label="Internal Notes" value={show(investigation.internalNotes)} multiline wide />

                <p className="mda-form-section__title">Request</p>
                <Field label="Requesting Organisation">
                  <Lookup onOpen={() => onOpenAccount?.(investigation.requestingOrganisation)}>{investigation.requestingOrganisation}</Lookup>
                </Field>
                <Field label="Requestor Contact">
                  <Lookup onOpen={() => onOpenContact?.(investigation.requestorContact)}>{investigation.requestorContact}</Lookup>
                </Field>
                <Field label="Related Applicant">
                  <Lookup onOpen={() => onOpenContact?.(investigation.relatedApplicant)}>{investigation.relatedApplicant}</Lookup>
                </Field>
                <Field label="Related Application">
                  <Lookup onOpen={() => onOpenApplication?.(investigation.applicationNumber)}>{investigation.applicationNumber}</Lookup>
                </Field>

                {ombudsman ? (
                  <>
                    <p className="mda-form-section__title">Ombudsman</p>
                    <Field label="Ombudsman Reference Number" value={show(investigation.ombudsmanReference)} />
                    <Field label="Ombudsman Complaint Category" value={show(investigation.ombudsmanCategory)} />
                    <Field label="Workflow Stage" value={show(investigation.workflowStage)} />
                    <Field label="Ombudsman Outcome" value={show(investigation.ombudsmanOutcome)} multiline wide />
                  </>
                ) : null}

                <p className="mda-form-section__title">Approval</p>
                <Field label="Approval Status" value={investigation.approvalStatus} />
                <Field label="Response Issued Date" value={showDate(investigation.responseIssuedDate)} />
                <Field label="Approval Comments" value={show(investigation.approvalComments)} multiline wide />
              </div>
            </section>
          </div>
        </div>
      </main>
    </DynamicsAppShell>
  );
}
