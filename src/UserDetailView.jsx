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
import DynamicsAppShell from "./shell/DynamicsAppShell.jsx";
import "./StudentsGrid.css";
import "./StudentDetailView.css";

const disabledCommand = { appearance: "subtle", type: "button", disabled: true, title: "Preview only" };

function Field({ label, value }) {
  return (
    <div className="mda-detail-row">
      <label className="mda-detail-row__label">
        <span className="mda-detail-row__label-text">{label}</span>
      </label>
      <div className="mda-detail-row__control">
        <div className="mda-detail-row__control-field">
          <span className="mda-detail-row__req" aria-hidden="true" />
          <div className="mda-detail-row__control-inner">
            <FluentInput readOnly value={value} className="mda-input" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserDetailView({ user, onBack, onNavigateHome, sitemapCollapsed = false, onToggleSitemap }) {
  return (
    <DynamicsAppShell
      activeNav="users"
      appClassName="mda-new-record mda-detail-record"
      headerVariant="detail"
      onNavigateHome={onNavigateHome}
      sitemapCollapsed={sitemapCollapsed}
      onToggleSitemap={onToggleSitemap}
    >
      <main className="dynamics-main mda-record-main">
        <div className="mda-record-commandbar" role="toolbar" aria-label="Record commands">
          <FluentButton appearance="subtle" icon={<ArrowLeftRegular fontSize={16} />} onClick={onBack} type="button" aria-label="Back to users" />
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
            <section className="mda-record-card mda-record-card--summary-band" aria-labelledby="user-record-title">
              <header className="mda-record-header mda-record-header--detail">
                <div className="mda-record-header__main mda-application-header__main">
                  <Avatar name={user.fullName} size={40} color="neutral" />
                  <div>
                    <h2 id="user-record-title" className="mda-record-header__title mda-record-header__title--primary">
                      <span className="mda-record-header__title-id">{user.fullName}</span>
                      <span className="mda-record-header__title-sep"> - </span>
                      <span className="mda-record-header__title-saved">Saved</span>
                    </h2>
                    <p className="mda-record-header__subtitle">User · {user.title}</p>
                  </div>
                </div>
              </header>
            </section>

            <section className="mda-record-card mda-record-card--form" aria-label="User details">
              <div className="mda-detail-columns mda-user-form">
                <p className="mda-form-section__title mda-form-section__title--first">User</p>
                <Field label="Full Name" value={user.fullName} />
                <Field label="Email" value={user.email} />
                <p className="mda-form-section__title">QA Sampling</p>
                <Field label="QA Sampling Frequency" value={String(user.qaSamplingFrequency)} />
                <Field label="QA Assessment Counter" value={String(user.qaAssessmentCounter)} />
                <Field label="QA Sampling Enabled" value={user.qaSamplingEnabled} />
              </div>
            </section>
          </div>
        </div>
      </main>
    </DynamicsAppShell>
  );
}
