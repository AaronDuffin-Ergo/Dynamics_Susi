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
  return value ? String(value) : "—";
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
  if (!onOpen) {
    return (
      <button type="button" className="dynamics-grid-link mda-detail-row__lookup" onClick={(event) => event.preventDefault()}>
        {children}
      </button>
    );
  }
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

export default function InformationRequestDetailView({
  request,
  onBack,
  onOpenContact,
  onOpenApplication,
  onNavigateHome,
  sitemapCollapsed = false,
  onToggleSitemap,
}) {
  const sar = request.requestType === "SAR";

  return (
    <DynamicsAppShell
      activeNav="informationRequests"
      appClassName="mda-new-record mda-detail-record"
      headerVariant="detail"
      onNavigateHome={onNavigateHome}
      sitemapCollapsed={sitemapCollapsed}
      onToggleSitemap={onToggleSitemap}
    >
      <main className="dynamics-main mda-record-main">
        <div className="mda-record-commandbar" role="toolbar" aria-label="Record commands">
          <FluentButton appearance="subtle" icon={<ArrowLeftRegular fontSize={16} />} onClick={onBack} type="button" aria-label="Back to information requests" />
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
            <section className="mda-record-card mda-record-card--summary-band" aria-labelledby="information-request-title">
              <header className="mda-record-header mda-record-header--detail">
                <div className="mda-record-header__main mda-application-header__main">
                  <Avatar name={request.contactName} size={40} color="neutral" />
                  <div>
                    <h2 id="information-request-title" className="mda-record-header__title mda-record-header__title--primary">
                      <span className="mda-record-header__title-id">{request.requestNumber}</span>
                      <span className="mda-record-header__title-sep"> - </span>
                      <span className="mda-record-header__title-saved">Saved</span>
                    </h2>
                    <p className="mda-record-header__subtitle">Information Request · {request.requestType}</p>
                  </div>
                </div>
                <div className="mda-record-header__summary">
                  <div className="mda-record-header__context">
                    <SummaryField primary={request.requestType} caption="Request Type" />
                    <SummaryField primary={request.status} caption="Status" />
                    <SummaryField primary={request.contactName} caption="Contact" />
                    <SummaryField primary={showDate(request.dueDate)} caption="Due Date" />
                  </div>
                </div>
              </header>
            </section>

            <section className="mda-record-card mda-record-card--form" aria-label="Information request details">
              <div className="mda-detail-columns mda-contact-form">
                <p className="mda-form-section__title mda-form-section__title--first">Request</p>
                <Field label="Information Request Number" value={request.requestNumber} />
                <Field label="Request Type" value={request.requestType} />
                <Field label="Status" value={request.status} />
                <Field label="Submitted Via" value={request.submittedVia} />
                <Field label="Created Date" value={showDate(request.createdDate)} />
                <Field label="Due Date" value={showDate(request.dueDate)} />
                <Field label="Request Details" value={show(request.requestDetails)} multiline wide />

                {sar ? (
                  <>
                    <p className="mda-form-section__title">SAR</p>
                    <Field label="SAR Category" value={request.sarCategory} />
                  </>
                ) : (
                  <>
                    <p className="mda-form-section__title">FOI</p>
                    <Field label="Information Category" value={request.informationCategory} />
                    <Field label="Request Scope" value={show(request.requestScope)} multiline wide />
                  </>
                )}

                <p className="mda-form-section__title">People</p>
                <Field label="Contact">
                  <Lookup onOpen={() => onOpenContact?.(request.contactName)}>{request.contactName}</Lookup>
                </Field>
                <Field label="Related Applicant">
                  {request.relatedApplicant ? (
                    <Lookup onOpen={() => onOpenContact?.(request.relatedApplicant)}>{request.relatedApplicant}</Lookup>
                  ) : (
                    <FluentInput readOnly value="—" className="mda-input" />
                  )}
                </Field>
                <Field label="Related Application">
                  {request.applicationNumber ? (
                    <Lookup onOpen={() => onOpenApplication?.(request.applicationNumber)}>{request.applicationNumber}</Lookup>
                  ) : (
                    <FluentInput readOnly value="—" className="mda-input" />
                  )}
                </Field>

                <p className="mda-form-section__title">Extension</p>
                <Field label="Extended" value={request.extended} />
                <Field label="Extension Reason" value={show(request.extensionReason)} multiline wide />

                <p className="mda-form-section__title">Approval</p>
                <Field label="Approval Status" value={request.approvalStatus} />
                <Field label="Response Issued Date" value={showDate(request.responseIssuedDate)} />
                <Field label="Approval Comments" value={show(request.approvalComments)} multiline wide />
              </div>
            </section>
          </div>
        </div>
      </main>
    </DynamicsAppShell>
  );
}
