import { Avatar, Button as FluentButton, Input as FluentInput, Textarea } from "@fluentui/react-components";
import {
  AddRegular,
  ArrowClockwiseRegular,
  ArrowLeftRegular,
  CalendarRegular,
  ChevronDownRegular,
  DeleteRegular,
  DocumentBulletListRegular,
  MoreVerticalRegular,
  PersonAddRegular,
  ProhibitedRegular,
  SaveRegular,
  ShieldCheckmarkRegular,
} from "@fluentui/react-icons";
import RecordTimelineAside from "./detailRecord/RecordTimelineAside.jsx";
import DynamicsAppShell from "./shell/DynamicsAppShell.jsx";
import "./StudentsGrid.css";
import "./StudentDetailView.css";

const disabledCommand = { appearance: "subtle", type: "button", disabled: true, title: "Preview only" };

const dateOnly = new Intl.DateTimeFormat("en-IE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

const TABS = ["General", "Details", "Documents", "Related"];
const EMPTY = "---";

function show(value) {
  return value ? String(value) : EMPTY;
}

function showDate(value) {
  return value ? dateOnly.format(value) : EMPTY;
}

function Field({ label, value, required = false, multiline = false, kind = "text", children }) {
  const trailingIcon =
    kind === "choice" ? (
      <ChevronDownRegular fontSize={16} aria-hidden />
    ) : kind === "date" ? (
      <CalendarRegular fontSize={16} aria-hidden />
    ) : undefined;
  return (
    <div className={`mda-detail-row${multiline ? " mda-detail-row--top" : ""}`}>
      <label className="mda-detail-row__label">
        <span className="mda-detail-row__label-text">{label}</span>
      </label>
      <div className="mda-detail-row__control">
        <div className="mda-detail-row__control-field">
          <span className="mda-detail-row__req" aria-hidden="true">
            {required ? "*" : ""}
          </span>
          <div className="mda-detail-row__control-inner">
            {children ??
              (multiline ? (
                <Textarea readOnly value={value} className="mda-input" resize="none" rows={3} />
              ) : (
                <FluentInput readOnly value={value} className="mda-input" contentAfter={trailingIcon} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Lookup({ children, onOpen, person = false }) {
  if (!children) return <FluentInput readOnly value={EMPTY} className="mda-input" />;
  return (
    <div className="mda-detail-row__owner">
      {person ? <Avatar name={String(children)} size={20} color="colorful" /> : null}
      <button type="button" className="dynamics-grid-link mda-detail-row__lookup" onClick={onOpen}>
        {children}
      </button>
    </div>
  );
}

function SummaryField({ primary, caption, children }) {
  return (
    <div className="mda-record-header__summary-field">
      <div className="mda-record-header__summary-top">
        {children ?? <span className="mda-record-header__summary-strong">{primary}</span>}
      </div>
      <span className="mda-record-header__summary-caption">{caption}</span>
    </div>
  );
}

export default function SgabAppealDetailView({
  appeal,
  onBack,
  onOpenApplication,
  onOpenAppeal,
  onOpenContact,
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
          <FluentButton {...disabledCommand} icon={<AddRegular fontSize={16} />}>New</FluentButton>
          <FluentButton {...disabledCommand} icon={<ProhibitedRegular fontSize={16} />}>Deactivate</FluentButton>
          <FluentButton {...disabledCommand} icon={<PersonAddRegular fontSize={16} />}>Assign</FluentButton>
          <FluentButton {...disabledCommand} icon={<DeleteRegular fontSize={16} />}>Delete</FluentButton>
          <FluentButton {...disabledCommand} icon={<ArrowClockwiseRegular fontSize={16} />}>Refresh</FluentButton>
          <FluentButton {...disabledCommand} icon={<ShieldCheckmarkRegular fontSize={16} />}>Check Access</FluentButton>
          <FluentButton {...disabledCommand} icon={<DocumentBulletListRegular fontSize={16} />}>
            Generate Document Pack
          </FluentButton>
          <FluentButton {...disabledCommand} icon={<MoreVerticalRegular fontSize={16} />} aria-label="More commands" />
        </div>

        <div className="mda-record-workspace">
          <div className="mda-record-form mda-detail-page-layout">
            <section className="mda-record-card mda-record-card--summary-band" aria-labelledby="sgab-appeal-record-title">
              <header className="mda-record-header mda-record-header--detail">
                <div className="mda-record-header__main mda-application-header__main">
                  <Avatar name="SGAB Appeal" initials="SA" size={40} color="lavender" />
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
                    <SummaryField primary={appeal.appealStatus} caption="Appeal Status" />
                    <SummaryField primary={showDate(appeal.receivedDate)} caption="Received Date" />
                    <SummaryField caption="Owner">
                      <Avatar name={appeal.owner} size={24} color="colorful" />
                      <span className="mda-record-header__summary-strong mda-record-header__summary-link-text">{appeal.owner}</span>
                      <ChevronDownRegular fontSize={12} aria-hidden />
                    </SummaryField>
                  </div>
                </div>
              </header>
              <div className="mda-tabs mda-tabs--in-summary mda-application-tabs" role="tablist" aria-label="SGAB appeal tabs">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    className={`mda-tab${tab === "General" ? " mda-tab--active" : ""}`}
                    aria-selected={tab === "General"}
                  >
                    {tab}
                    {tab === "Related" ? <ChevronDownRegular fontSize={12} aria-hidden /> : null}
                  </button>
                ))}
              </div>
            </section>

            <div className="mda-sgab-record-grid">
              <div className="mda-sgab-rail">
                <section className="mda-record-card mda-record-card--form mda-application-form" aria-label="SGAB Appeal Information">
                  <div className="mda-detail-columns mda-sgab-form">
                    <p className="mda-form-section__title mda-form-section__title--first">SGAB Appeal Information</p>
                    <Field label="SGAB Appeal Number" value={appeal.sgabAppealNumber} required />
                    <Field label="SGAB Reference" value={appeal.sgabReference} required />
                    <Field label="Received Date" value={showDate(appeal.receivedDate)} required kind="date" />
                    <Field label="Appeal Status" value={appeal.appealStatus} required kind="choice" />
                    <Field label="Previous SUSI Appeal Exists" value={appeal.previousSusiAppealExists} required kind="choice" />

                    <p className="mda-form-section__title mda-sgab-form__subtitle">Additional Information</p>
                    <Field label="Description" value={show(appeal.description)} multiline />
                  </div>
                </section>

                <section className="mda-record-card mda-record-card--form mda-application-form" aria-label="Determination">
                  <div className="mda-detail-columns mda-sgab-form">
                    <p className="mda-form-section__title mda-form-section__title--first">Determination</p>
                    <Field label="Determination Received" value={show(appeal.determinationReceived)} kind="choice" />
                    <Field label="Determination Date" value={showDate(appeal.determinationDate)} kind="date" />
                    <Field label="Determination Outcome" value={show(appeal.determinationOutcome)} multiline />
                  </div>
                </section>
              </div>

              <RecordTimelineAside
                activities={appeal.timeline}
                regardingLabel="SGAB Appeal"
                regardingName={appeal.sgabAppealNumber}
                recordMetaLabel={`Email received on ${showDate(appeal.receivedDate)}`}
              />

              <div className="mda-sgab-rail">
                <section className="mda-record-card mda-record-card--form" aria-label="Related Application">
                  <div className="mda-detail-columns mda-sgab-rail__form">
                    <p className="mda-form-section__title mda-form-section__title--first">Related Application</p>
                    <Field label="Application" required>
                      <Lookup onOpen={() => onOpenApplication?.(appeal.applicationNumber)}>{appeal.applicationNumber}</Lookup>
                    </Field>
                    <Field label="Applicant" required>
                      <Lookup person onOpen={() => onOpenContact?.(appeal.contactName)}>
                        {appeal.contactName}
                      </Lookup>
                    </Field>
                    <Field label="Scheme" required>
                      <Lookup>{appeal.schemeName}</Lookup>
                    </Field>
                  </div>
                </section>

                <section className="mda-record-card mda-record-card--form" aria-label="Related Appeal">
                  <div className="mda-detail-columns mda-sgab-rail__form">
                    <p className="mda-form-section__title mda-form-section__title--first">Related Appeal</p>
                    <Field label="Appeal">
                      <Lookup onOpen={appeal.relatedAppealNumber ? () => onOpenAppeal?.(appeal.relatedAppealNumber) : undefined}>
                        {appeal.relatedAppealNumber}
                      </Lookup>
                    </Field>
                    <Field label="Officer">
                      <Lookup person>{appeal.relatedAppealOfficer}</Lookup>
                    </Field>
                    <Field label="Status" value={show(appeal.relatedAppealStatus)} />
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
    </DynamicsAppShell>
  );
}
