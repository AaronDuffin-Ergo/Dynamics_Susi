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
import { isCollegeAccount } from "./mockAccounts.js";
import DynamicsAppShell from "./shell/DynamicsAppShell.jsx";
import "./StudentsGrid.css";
import "./StudentDetailView.css";

const disabledCommand = { appearance: "subtle", type: "button", disabled: true, title: "Preview only" };

function show(value) {
  return value ? String(value) : "—";
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

function SummaryField({ primary, caption, showAvatar = false }) {
  return (
    <div className="mda-record-header__summary-field">
      <div className="mda-record-header__summary-top">
        {showAvatar ? <Avatar name={primary} size={24} color="colorful" /> : null}
        <span className="mda-record-header__summary-strong">{primary || "—"}</span>
      </div>
      <span className="mda-record-header__summary-caption">{caption}</span>
    </div>
  );
}

export default function AccountDetailView({
  account,
  onBack,
  onOpenAccount,
  onNavigateHome,
  sitemapCollapsed = false,
  onToggleSitemap,
}) {
  const college = isCollegeAccount(account);

  return (
    <DynamicsAppShell
      activeNav="accounts"
      appClassName="mda-new-record mda-detail-record"
      headerVariant="detail"
      onNavigateHome={onNavigateHome}
      sitemapCollapsed={sitemapCollapsed}
      onToggleSitemap={onToggleSitemap}
    >
      <main className="dynamics-main mda-record-main">
        <div className="mda-record-commandbar" role="toolbar" aria-label="Record commands">
          <FluentButton appearance="subtle" icon={<ArrowLeftRegular fontSize={16} />} onClick={onBack} type="button" aria-label="Back to accounts" />
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
            <section className="mda-record-card mda-record-card--summary-band" aria-labelledby="account-record-title">
              <header className="mda-record-header mda-record-header--detail">
                <div className="mda-record-header__main mda-application-header__main">
                  <Avatar name={account.accountName} size={40} color="neutral" />
                  <div>
                    <h2 id="account-record-title" className="mda-record-header__title mda-record-header__title--primary">
                      <span className="mda-record-header__title-id">{account.accountName}</span>
                      <span className="mda-record-header__title-sep"> - </span>
                      <span className="mda-record-header__title-saved">Saved</span>
                    </h2>
                    <p className="mda-record-header__subtitle">Account · {account.accountType}</p>
                  </div>
                </div>
                <div className="mda-record-header__summary">
                  <div className="mda-record-header__context">
                    <SummaryField primary={account.primaryContact} caption="Primary Contact" showAvatar />
                    <SummaryField primary={account.accountType} caption="Account Type" />
                    <SummaryField primary={college ? account.collegeType : account.country} caption={college ? "College Type" : "Country"} />
                    <SummaryField primary={account.status} caption="Status" />
                  </div>
                </div>
              </header>
            </section>

            <section className="mda-record-card mda-record-card--form" aria-label="Account details">
              <div className="mda-detail-columns mda-account-form">
                <p className="mda-form-section__title mda-form-section__title--first">Account</p>
                <Field label="Account Name" value={account.accountName} />
                <Field label="Account Type" value={account.accountType} />
                <Field label="Status" value={account.status} />
                <Field label="Parent Account">
                  {account.parentAccountName ? (
                    <Lookup onOpen={() => onOpenAccount?.(account.parentAccountName)}>{account.parentAccountName}</Lookup>
                  ) : (
                    <FluentInput readOnly value="—" className="mda-input" />
                  )}
                </Field>
                <Field label="Primary Contact">
                  <div className="mda-detail-row__owner">
                    <Avatar name={account.primaryContact} size={20} color="colorful" />
                    <Lookup>{account.primaryContact}</Lookup>
                  </div>
                </Field>
                <Field label="Main Email Address" value={account.mainEmail} />
                <Field label="Address" value={account.address} wide />
                <Field label="Eircode" value={show(account.eircode)} />
                <Field label="Country" value={account.country} />

                {college ? (
                  <>
                    <p className="mda-form-section__title">College</p>
                    <Field label="College Code" value={account.collegeCode} />
                    <Field label="College Type" value={account.collegeType} />
                    <Field label="Registration Address" value={show(account.registrationAddress)} wide />
                    <Field label="Payment Code" value={show(account.paymentCode)} />
                    <Field label="Funding Approval Status" value={show(account.fundingApprovalStatus)} />
                    <Field label="File Output Type" value={show(account.fileOutputType)} />
                    <Field label="Use Parent Payment Details" value={show(account.useParentPaymentDetails)} />
                    <Field label="Use Parent Contact Details" value={show(account.useParentContactDetails)} />
                    <Field label="Tuition Account Information" value={show(account.tuitionAccountInformation)} multiline wide />
                    <Field label="Capitation Account Information" value={show(account.capitationAccountInformation)} multiline wide />
                  </>
                ) : null}
              </div>
            </section>
          </div>
        </div>
      </main>
    </DynamicsAppShell>
  );
}
