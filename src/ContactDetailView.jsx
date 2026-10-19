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
import { fullName, maskBic, maskIban } from "./mockContacts.js";
import DynamicsAppShell from "./shell/DynamicsAppShell.jsx";
import "./StudentsGrid.css";
import "./StudentDetailView.css";

const disabledCommand = { appearance: "subtle", type: "button", disabled: true, title: "Preview only" };

function show(value) {
  return value ? String(value) : "—";
}

function Field({ label, value, wide = false, children }) {
  return (
    <div className={`mda-detail-row${wide ? " mda-detail-row--wide" : ""}`}>
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

export default function ContactDetailView({
  contact,
  onBack,
  onOpenAccount,
  onNavigateHome,
  sitemapCollapsed = false,
  onToggleSitemap,
}) {
  const name = fullName(contact);
  const applicant = contact.contactType === "Applicant";

  return (
    <DynamicsAppShell
      activeNav="contacts"
      appClassName="mda-new-record mda-detail-record"
      headerVariant="detail"
      onNavigateHome={onNavigateHome}
      sitemapCollapsed={sitemapCollapsed}
      onToggleSitemap={onToggleSitemap}
    >
      <main className="dynamics-main mda-record-main">
        <div className="mda-record-commandbar" role="toolbar" aria-label="Record commands">
          <FluentButton appearance="subtle" icon={<ArrowLeftRegular fontSize={16} />} onClick={onBack} type="button" aria-label="Back to contacts" />
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
            <section className="mda-record-card mda-record-card--summary-band" aria-labelledby="contact-record-title">
              <header className="mda-record-header mda-record-header--detail">
                <div className="mda-record-header__main mda-application-header__main">
                  <Avatar name={name} size={40} color="neutral" />
                  <div>
                    <h2 id="contact-record-title" className="mda-record-header__title mda-record-header__title--primary">
                      <span className="mda-record-header__title-id">{name}</span>
                      <span className="mda-record-header__title-sep"> - </span>
                      <span className="mda-record-header__title-saved">Saved</span>
                    </h2>
                    <p className="mda-record-header__subtitle">Contact · {contact.contactType}</p>
                  </div>
                </div>
                <div className="mda-record-header__summary">
                  <div className="mda-record-header__context">
                    <SummaryField primary={contact.contactType} caption="Contact Type" />
                    <SummaryField
                      primary={applicant ? contact.language : contact.parentAccountName}
                      caption={applicant ? "Preferred Language" : "Parent Account"}
                    />
                    <SummaryField primary={contact.email} caption="Email" />
                    <SummaryField primary={contact.status} caption="Status" />
                  </div>
                </div>
              </header>
            </section>

            <section className="mda-record-card mda-record-card--form" aria-label="Contact details">
              <div className="mda-detail-columns mda-contact-form">
                <p className="mda-form-section__title mda-form-section__title--first">Contact</p>
                <Field label="Contact ID" value={contact.contactId} />
                <Field label="Status" value={contact.status} />
                <Field label="First Name" value={contact.firstName} />
                <Field label="Last Name" value={contact.lastName} />
                <Field label="Contact Type" value={contact.contactType} />
                <Field label="Parent Account">
                  {contact.parentAccountName ? (
                    <Lookup onOpen={() => onOpenAccount?.(contact.parentAccountName)}>{contact.parentAccountName}</Lookup>
                  ) : (
                    <FluentInput readOnly value="—" className="mda-input" />
                  )}
                </Field>
                <Field label="Email Address" value={contact.email} />
                <Field label="Alternative Email Address" value={show(contact.alternativeEmail)} />
                <Field label="Telephone Number" value={show(contact.telephone)} />
                <Field label="Mobile Number" value={show(contact.mobile)} />
                <Field label="Address" value={show(contact.address)} wide />
                <Field label="Eircode" value={show(contact.eircode)} />

                {applicant ? (
                  <>
                    <p className="mda-form-section__title">Applicant profile</p>
                    <Field label="Preferred Communication Language" value={show(contact.language)} />
                    <Field label="IBAN" value={show(maskIban(contact.iban))} />
                    <Field label="BIC" value={show(maskBic(contact.bic))} />
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
