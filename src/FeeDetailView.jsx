import { useState } from "react";
import { Avatar, Button as FluentButton, Input as FluentInput } from "@fluentui/react-components";
import {
  AddRegular,
  ArrowClockwiseRegular,
  ArrowLeftRegular,
  DeleteRegular,
  PersonAddRegular,
  ProhibitedRegular,
  SaveRegular,
} from "@fluentui/react-icons";
import CollegeFeesSubgrid from "./CollegeFeesSubgrid.jsx";
import DynamicsAppShell from "./shell/DynamicsAppShell.jsx";
import "./StudentsGrid.css";
import "./StudentDetailView.css";

const disabledCommand = { appearance: "subtle", type: "button", disabled: true, title: "Preview only" };
const TABS = [
  { id: "general", label: "General" },
  { id: "collegeFees", label: "College Fees" },
];

function Field({ label, value, required = false, children }) {
  return (
    <div className="mda-detail-row">
      <label className="mda-detail-row__label">
        <span className="mda-detail-row__label-text">{label}</span>
      </label>
      <div className="mda-detail-row__control">
        <div className="mda-detail-row__control-field">
          <span className="mda-detail-row__req" aria-hidden="true">
            {required ? "*" : ""}
          </span>
          <div className="mda-detail-row__control-inner">
            {children ?? <FluentInput readOnly value={value} className="mda-input" />}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryField({ primary, caption }) {
  return (
    <div className="mda-record-header__summary-field">
      <div className="mda-record-header__summary-top">
        <span className="mda-record-header__summary-strong">{primary}</span>
      </div>
      <span className="mda-record-header__summary-caption">{caption}</span>
    </div>
  );
}

export default function FeeDetailView({
  fee,
  initialTab = "collegeFees",
  onBack,
  onOpenCollege,
  onNavigateHome,
  sitemapCollapsed = false,
  onToggleSitemap,
}) {
  const [tab, setTab] = useState(initialTab);

  return (
    <DynamicsAppShell
      activeNav="fees"
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
            aria-label="Back to fees"
          />
          <FluentButton {...disabledCommand} icon={<SaveRegular fontSize={16} />}>Save</FluentButton>
          <FluentButton {...disabledCommand} icon={<SaveRegular fontSize={16} />}>Save &amp; Close</FluentButton>
          <FluentButton {...disabledCommand} icon={<AddRegular fontSize={16} />}>New</FluentButton>
          <FluentButton {...disabledCommand} icon={<ProhibitedRegular fontSize={16} />}>Deactivate</FluentButton>
          <FluentButton {...disabledCommand} icon={<PersonAddRegular fontSize={16} />}>Assign</FluentButton>
          <FluentButton {...disabledCommand} icon={<DeleteRegular fontSize={16} />}>Delete</FluentButton>
          <FluentButton {...disabledCommand} icon={<ArrowClockwiseRegular fontSize={16} />}>Refresh</FluentButton>
        </div>

        <div className="mda-record-workspace">
          <div className="mda-record-form mda-detail-page-layout">
            <section className="mda-record-card mda-record-card--summary-band" aria-labelledby="fee-record-title">
              <header className="mda-record-header mda-record-header--detail">
                <div className="mda-record-header__main mda-application-header__main">
                  <Avatar name="Fee" initials="FE" size={40} color="forest" />
                  <div>
                    <h2 id="fee-record-title" className="mda-record-header__title mda-record-header__title--primary">
                      <span className="mda-record-header__title-id">{fee.feeNumber}</span>
                      <span className="mda-record-header__title-sep"> - </span>
                      <span className="mda-record-header__title-saved">Saved</span>
                    </h2>
                    <p className="mda-record-header__subtitle">Fee</p>
                  </div>
                </div>
                <div className="mda-record-header__summary">
                  <div className="mda-record-header__context">
                    <SummaryField primary={fee.academicYear} caption="Academic Year" />
                    <SummaryField primary={fee.status} caption="Status" />
                  </div>
                </div>
              </header>
              <div className="mda-tabs mda-tabs--in-summary mda-application-tabs" role="tablist" aria-label="Fee tabs">
                {TABS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    className={`mda-tab${tab === item.id ? " mda-tab--active" : ""}`}
                    aria-selected={tab === item.id}
                    onClick={() => setTab(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </section>

            {tab === "general" ? (
              <section className="mda-record-card mda-record-card--form" aria-label="Fee details">
                <div className="mda-detail-columns">
                  <p className="mda-form-section__title mda-form-section__title--first">Fee Information</p>
                  <Field label="Fee Number" value={fee.feeNumber} required />
                  <Field label="Academic Year" value={fee.academicYear} required />
                  <Field label="Scheme" value={fee.schemeName} required />
                  <Field label="Status" value={fee.status} required />
                </div>
              </section>
            ) : (
              <CollegeFeesSubgrid rows={fee.collegeFees} onOpenCollege={onOpenCollege} />
            )}
          </div>
        </div>
      </main>
    </DynamicsAppShell>
  );
}
