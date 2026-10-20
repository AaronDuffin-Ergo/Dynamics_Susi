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
import CollegePaymentsSubgrid from "./CollegePaymentsSubgrid.jsx";
import DynamicsAppShell from "./shell/DynamicsAppShell.jsx";
import "./StudentsGrid.css";
import "./StudentDetailView.css";

const disabledCommand = { appearance: "subtle", type: "button", disabled: true, title: "Preview only" };
const money = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" });
const TABS = [
  { id: "general", label: "General" },
  { id: "collegePayments", label: "College Payments" },
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

function Lookup({ children, onOpen }) {
  return (
    <div className="mda-detail-row__owner">
      <button type="button" className="dynamics-grid-link mda-detail-row__lookup" onClick={onOpen}>
        {children}
      </button>
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

export default function CollegeFeeDetailView({
  collegeFee,
  initialTab = "collegePayments",
  onBack,
  onOpenFee,
  onOpenCollege,
  onNavigateHome,
  sitemapCollapsed = false,
  onToggleSitemap,
}) {
  const [tab, setTab] = useState(initialTab);
  const row = collegeFee;

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
            aria-label="Back to fee"
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
            <section className="mda-record-card mda-record-card--summary-band" aria-labelledby="college-fee-record-title">
              <header className="mda-record-header mda-record-header--detail">
                <div className="mda-record-header__main mda-application-header__main">
                  <Avatar name="College Fee" initials="CF" size={40} color="teal" />
                  <div>
                    <h2 id="college-fee-record-title" className="mda-record-header__title mda-record-header__title--primary">
                      <span className="mda-record-header__title-id">{row.collegeFeeNumber}</span>
                      <span className="mda-record-header__title-sep"> - </span>
                      <span className="mda-record-header__title-saved">Saved</span>
                    </h2>
                    <p className="mda-record-header__subtitle">College Fee</p>
                  </div>
                </div>
                <div className="mda-record-header__summary">
                  <div className="mda-record-header__context">
                    <SummaryField primary={row.college} caption="College" />
                    <SummaryField primary={row.academicYear} caption="Academic Year" />
                    <SummaryField primary={money.format(row.finalTrancheAmount)} caption="Final Tranche Amount" />
                  </div>
                </div>
              </header>
              <div className="mda-tabs mda-tabs--in-summary mda-application-tabs" role="tablist" aria-label="College fee tabs">
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
              <section className="mda-record-card mda-record-card--form" aria-label="College fee details">
                <div className="mda-detail-columns">
                  <p className="mda-form-section__title mda-form-section__title--first">College Fee Information</p>
                  <Field label="College Fee Number" value={row.collegeFeeNumber} required />
                  <Field label="Fee" required>
                    <Lookup onOpen={() => onOpenFee?.(row.feeNumber)}>{row.feeNumber}</Lookup>
                  </Field>
                  <Field label="College" required>
                    <Lookup onOpen={() => onOpenCollege?.(row.college)}>{row.college}</Lookup>
                  </Field>
                  <Field label="Creditor ID" value={row.creditorId} />
                  <Field label="Academic Year" value={row.academicYear} required />
                  <Field label="Awarded Applicant Count" value={String(row.awardedApplicantCount)} />

                  <p className="mda-form-section__title">Tranche</p>
                  <Field label="Base Calculated Amount for Tranche" value={money.format(row.baseCalculatedAmount)} />
                  <Field label="Margin Percentage" value={`${row.marginPercentage.toFixed(2)}%`} />
                  <Field label="Margin Amount" value={money.format(row.marginAmount)} />
                  <Field label="Calculated Tranche Amount" value={money.format(row.calculatedTrancheAmount)} />
                  <Field label="Final Tranche Amount" value={money.format(row.finalTrancheAmount)} />
                  <Field label="Total Tranche Paid" value={money.format(row.totalTranchePaid)} />

                  <p className="mda-form-section__title">Reconciliation</p>
                  <Field label="Total Reconciled Fee" value={money.format(row.totalReconciledFee)} />
                  <Field label="Total Reconciliation Paid" value={money.format(row.totalReconciliationPaid)} />
                  <Field label="Total Post-Reconciliation Paid" value={money.format(row.totalPostReconciliationPaid)} />
                  <Field label="Reconciled Application Count" value={String(row.reconciledApplicationCount)} />
                  <Field label="Unreconciled Application Count" value={String(row.unreconciledApplicationCount)} />
                </div>
              </section>
            ) : (
              <CollegePaymentsSubgrid rows={row.payments} />
            )}
          </div>
        </div>
      </main>
    </DynamicsAppShell>
  );
}
