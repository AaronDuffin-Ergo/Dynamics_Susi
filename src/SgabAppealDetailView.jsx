import { Avatar, Button as FluentButton, Input as FluentInput } from "@fluentui/react-components";
import {
  ArrowClockwiseRegular,
  ArrowLeftRegular,
  ChevronDownRegular,
  FlowRegular,
  PersonAddRegular,
  SaveRegular,
  ShareRegular,
} from "@fluentui/react-icons";
import RecordTimelineAside from "./detailRecord/RecordTimelineAside.jsx";
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

function Field({ label, value, children }) {
  return (
    <div className="mda-detail-row">
      <label className="mda-detail-row__label">
        <span className="mda-detail-row__label-text">{label}</span>
      </label>
      <div className="mda-detail-row__control">
        <div className="mda-detail-row__control-field">
          <span className="mda-detail-row__req" aria-hidden="true" />
          <div className="mda-detail-row__control-inner">
            {children ?? <FluentInput readOnly value={value} className="mda-input" />}
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

function SummaryField({ primary, caption, showAvatar }) {
  return (
    <div className="mda-record-header__summary-field">
      <div className="mda-record-header__summary-top">
        {showAvatar ? <Avatar name={primary} size={24} color="colorful" /> : null}
        <span className="mda-record-header__summary-strong">{primary}</span>
      </div>
      <span className="mda-record-header__summary-caption">{caption}</span>
    </div>
  );
}

export default function SgabAppealDetailView({
  appeal,
  onBack,
  onOpenApplication,
  onNavigateHome,
  sitemapCollapsed = false,
  onToggleSitemap,
}) {
  return (
    <DynamicsAppShell
      activeNav="sgabAppeals"
      appClassName="mda-new-record mda-detail-record"
      headerVariant="detail"
      onNavigateHome={onNavigateHome}
      sitemapCollapsed={sitemapCollapsed}
      onToggleSitemap={onToggleSitemap}
    >
      <main className="dynamics-main mda-record-main">
        <div className="mda-record-commandbar" role="toolbar" aria-label="Record commands">
          <FluentButton
            appearance="subtle"
            icon={<ArrowLeftRegular fontSize={16} />}
            onClick={onBack}
            type="button"
            aria-label="Back to SGAB appeals"
          />
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
            <section className="mda-record-card mda-record-card--summary-band" aria-labelledby="sgab-appeal-record-title">
              <header className="mda-record-header mda-record-header--detail">
                <div className="mda-record-header__main mda-application-header__main">
                  <Avatar name={appeal.contactName} size={40} color="neutral" />
                  <div>
                    <h2 id="sgab-appeal-record-title" className="mda-record-header__title mda-record-header__title--primary">
                      <span className="mda-record-header__title-id">{appeal.sgabAppealNumber}</span>
                      <span className="mda-record-header__title-sep"> - </span>
                      <span className="mda-record-header__title-saved">Saved</span>
                    </h2>
                    <p className="mda-record-header__subtitle">SGAB Appeal</p>
                  </div>
                </div>
                <div className="mda-record-header__summary">
                  <div className="mda-record-header__context">
                    <SummaryField primary={appeal.contactName} caption="Contact" showAvatar />
                    <SummaryField primary={appeal.schemeName} caption="Scheme" />
                    <SummaryField primary={appeal.appealStatus} caption="Appeal Status" />
                    <SummaryField primary={appeal.determinationReceived} caption="Determination Received" />
                  </div>
                </div>
              </header>
              <div className="mda-tabs mda-tabs--in-summary mda-application-tabs" role="tablist" aria-label="SGAB appeal tabs">
                <button type="button" role="tab" className="mda-tab mda-tab--active" aria-selected="true">
                  General
                </button>
              </div>
            </section>

            <div className="mda-sgab-record-grid">
              <section className="mda-record-card mda-record-card--form mda-application-form" aria-label="SGAB appeal details">
                <div className="mda-detail-columns mda-appeal-form">
                  <p className="mda-form-section__title mda-form-section__title--first">SGAB Appeal</p>
                  <Field label="SGAB Appeal Number" value={appeal.sgabAppealNumber} />
                  <Field label="Application">
                    <Lookup onOpen={() => onOpenApplication?.(appeal.applicationNumber)}>{appeal.applicationNumber}</Lookup>
                  </Field>
                  <Field label="Contact">
                    <Lookup>{appeal.contactName}</Lookup>
                  </Field>
                  <Field label="Scheme">
                    <Lookup>{appeal.schemeName}</Lookup>
                  </Field>
                  <Field label="SGAB Reference" value={appeal.sgabReference} />
                  <Field label="Received Date" value={showDate(appeal.receivedDate)} />
                  <Field label="Appeal Status" value={appeal.appealStatus} />
                  <Field label="Previous SUSI Appeal Exists" value={appeal.previousSusiAppealExists} />
                  <Field label="Determination Received" value={appeal.determinationReceived} />
                  <Field label="Determination Date" value={showDate(appeal.determinationDate)} />
                  <Field label="Determination Outcome" value={show(appeal.determinationOutcome)} />
                </div>
              </section>
              <RecordTimelineAside
                activities={appeal.timeline}
                regardingLabel="SGAB Appeal"
                regardingName={appeal.sgabAppealNumber}
                recordMetaLabel={`Email received on ${showDate(appeal.receivedDate)}`}
              />
            </div>
          </div>
        </div>
      </main>
    </DynamicsAppShell>
  );
}
