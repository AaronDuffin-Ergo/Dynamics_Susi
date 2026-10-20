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

const dateTime = new Intl.DateTimeFormat(undefined, {
  month: "numeric",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function show(value) {
  return value ? String(value) : "—";
}

function showDate(value, withTime) {
  if (!value) return "—";
  return (withTime ? dateTime : dateOnly).format(value);
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

export default function AppealDetailView({
  appeal,
  onBack,
  onOpenApplication,
  onNavigateHome,
  sitemapCollapsed = false,
  onToggleSitemap,
}) {
  return (
    <DynamicsAppShell
      activeNav="appeals"
      appClassName="mda-new-record mda-detail-record"
      headerVariant="detail"
      onNavigateHome={onNavigateHome}
      sitemapCollapsed={sitemapCollapsed}
      onToggleSitemap={onToggleSitemap}
    >
      <main className="dynamics-main mda-record-main">
        <div className="mda-record-commandbar" role="toolbar" aria-label="Record commands">
          <FluentButton appearance="subtle" icon={<ArrowLeftRegular fontSize={16} />} onClick={onBack} type="button" aria-label="Back to appeals" />
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
            <section className="mda-record-card mda-record-card--summary-band" aria-labelledby="appeal-record-title">
              <header className="mda-record-header mda-record-header--detail">
                <div className="mda-record-header__main mda-application-header__main">
                  <Avatar name={appeal.contactName} size={40} color="neutral" />
                  <div>
                    <h2 id="appeal-record-title" className="mda-record-header__title mda-record-header__title--primary">
                      <span className="mda-record-header__title-id">{appeal.appealNumber}</span>
                      <span className="mda-record-header__title-sep"> - </span>
                      <span className="mda-record-header__title-saved">Saved</span>
                    </h2>
                    <p className="mda-record-header__subtitle">Appeal · {appeal.appealType}</p>
                  </div>
                </div>
                <div className="mda-record-header__summary">
                  <div className="mda-record-header__context">
                    <div className="mda-record-header__summary-field">
                      <div className="mda-record-header__summary-top">
                        <Avatar name={appeal.contactName} size={24} color="colorful" />
                        <span className="mda-record-header__summary-strong">{appeal.contactName}</span>
                      </div>
                      <span className="mda-record-header__summary-caption">Contact</span>
                    </div>
                    <div className="mda-record-header__summary-field">
                      <span className="mda-record-header__summary-strong">{appeal.schemeName}</span>
                      <span className="mda-record-header__summary-caption">Scheme</span>
                    </div>
                    <div className="mda-record-header__summary-field">
                      <span className="mda-record-header__summary-strong">{appeal.status}</span>
                      <span className="mda-record-header__summary-caption">Status</span>
                    </div>
                    <div className="mda-record-header__summary-field">
                      <span className="mda-record-header__summary-strong">{appeal.appealType}</span>
                      <span className="mda-record-header__summary-caption">Appeal Type</span>
                    </div>
                  </div>
                </div>
              </header>
              <div className="mda-tabs mda-tabs--in-summary mda-application-tabs" role="tablist" aria-label="Appeal tabs">
                <button type="button" role="tab" className="mda-tab mda-tab--active" aria-selected="true">
                  General
                </button>
              </div>
            </section>

            <section className="mda-record-card mda-record-card--form mda-application-form" aria-label="Appeal details">
              <div className="mda-detail-columns mda-appeal-form">
                <p className="mda-form-section__title mda-form-section__title--first">Appeal</p>
                <Field label="Appeal Number" value={appeal.appealNumber} />
                <Field label="Application">
                  <Lookup onOpen={() => onOpenApplication?.(appeal.applicationNumber)}>{appeal.applicationNumber}</Lookup>
                </Field>
                <Field label="Contact">
                  <Lookup>{appeal.contactName}</Lookup>
                </Field>
                <Field label="Scheme">
                  <Lookup>{appeal.schemeName}</Lookup>
                </Field>
                <Field label="Appeal Type" value={appeal.appealType} />
                <Field label="Status" value={appeal.status} />

                <p className="mda-form-section__title">Original decision</p>
                <Field label="Original Decision" value={show(appeal.originalDecision)} />
                <Field label="Original Decision Date" value={showDate(appeal.originalDecisionDate)} />
                <Field label="Original Appeal Deadline" value={showDate(appeal.originalAppealDeadline)} />
                <Field label="Revised Appeal Deadline" value={showDate(appeal.revisedAppealDeadline)} />
                <Field label="Submitted On" value={showDate(appeal.submittedOn, true)} />
                <Field label="Additional Comments" value={show(appeal.additionalComments)} multiline wide />

                <p className="mda-form-section__title">Outcome</p>
                <Field label="Closure Category" value={show(appeal.closureCategory)} />
                <Field label="Appeal Outcome" value={show(appeal.appealOutcome)} />
                <Field label="Appeal Decision Date" value={showDate(appeal.appealDecisionDate)} />

                <p className="mda-form-section__title">Extension</p>
                <Field label="Extension Requested On" value={showDate(appeal.extensionRequestedOn, true)} />
                <Field label="Extension Request Comment" value={show(appeal.extensionRequestComment)} multiline wide />
                <Field label="Extension Decision" value={show(appeal.extensionDecision)} />
                <Field label="Extension Assessor Comment" value={show(appeal.extensionAssessorComment)} multiline wide />
                <Field label="Extension Decided By">
                  {appeal.extensionDecidedBy ? <Lookup>{appeal.extensionDecidedBy}</Lookup> : <FluentInput readOnly value="—" className="mda-input" />}
                </Field>
                <Field label="Extension Decided On" value={showDate(appeal.extensionDecidedOn, true)} />
              </div>
            </section>
          </div>
        </div>
      </main>
    </DynamicsAppShell>
  );
}
