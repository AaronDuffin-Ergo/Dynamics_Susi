import { useCallback, useMemo, useState } from "react";
import { Avatar, Button as FluentButton } from "@fluentui/react-components";
import {
  AddRegular,
  ArrowClockwiseRegular,
  ArrowLeftRegular,
  ChevronDownRegular,
  DocumentBulletListRegular,
  FlowRegular,
  PersonAddRegular,
  SaveRegular,
  ShareRegular,
  ShieldCheckmarkRegular,
} from "@fluentui/react-icons";
import DynamicsAppShell from "./shell/DynamicsAppShell.jsx";
import RecordTimelineAside from "./detailRecord/RecordTimelineAside.jsx";
import CustomizableCardGrid from "./layoutCustomization/CustomizableCardGrid.jsx";
import CustomizableFieldSection from "./layoutCustomization/CustomizableFieldSection.jsx";
import { APPLICATION_DETAIL_FIELDS } from "./layoutCustomization/detailFieldConfigs.jsx";
import "./StudentsGrid.css";
import "./StudentDetailView.css";

const dateLong = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const dateShort = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

const APPLICATION_TABS = [
  { id: "general", label: "General" },
  {
    id: "bre",
    label: "BRE Output",
    title: "Business rules engine output",
    description: "Eligibility and means-test results returned by the BRE for this application.",
    items: ["BRE run history", "Rule outcomes", "Calculated award"],
  },
  {
    id: "answers",
    label: "Answers",
    title: "Application answers",
    description: "Answer records created for every question on the scheme, updated each time the applicant saves.",
    items: ["Form sections", "Questions and answers", "Question rule outcomes"],
  },
  {
    id: "documents",
    label: "Documents",
    title: "Documents and document requests",
    description: "Supporting documents uploaded by the applicant and requests raised by assessors.",
    items: ["Documents", "Document requests"],
  },
  {
    id: "payments",
    label: "Payments",
    title: "Payments",
    description: "Grant payment schedule and payment history for awarded applications.",
    items: ["Payment schedule", "Payment history"],
  },
  {
    id: "linked",
    label: "Linked",
    title: "Linked records",
    description: "Records connected to this application.",
    items: ["Cases", "Linked applications", "CIRs"],
  },
  {
    id: "appeals",
    label: "Appeals",
    title: "Appeals",
    description: "Appeals raised against the decision on this application.",
    items: ["Appeals", "SGAB"],
  },
  {
    id: "qa",
    label: "QA",
    title: "Quality assurance",
    description: "Quality assurance checks completed on the processing of this application.",
    items: ["QA reviews", "QA outcomes"],
  },
  {
    id: "feeds",
    label: "Feeds",
    title: "Feeds",
    description: "Data exchanged with external sources for this application.",
    items: ["Inbound feeds", "Outbound feeds"],
  },
];

function HeaderSummaryField({ primary, secondary, showAvatar }) {
  const text = primary || "—";
  return (
    <div className="mda-record-header__summary-field">
      <div className="mda-record-header__summary-top">
        {showAvatar && primary ? <Avatar name={primary} size={24} color="colorful" /> : null}
        <span className="mda-record-header__summary-strong">{text}</span>
      </div>
      <span className="mda-record-header__summary-caption">{secondary}</span>
    </div>
  );
}

function TabPlaceholder({ tab }) {
  return (
    <section className="mda-record-card mda-application-tab-placeholder" aria-labelledby={`tab-${tab.id}-title`}>
      <h3 id={`tab-${tab.id}-title`} className="mda-application-tab-placeholder__title">
        {tab.title}
      </h3>
      <p className="mda-application-tab-placeholder__text">{tab.description}</p>
      <ul className="mda-application-tab-placeholder__list" aria-label={`${tab.label} sections`}>
        {tab.items.map((item) => (
          <li key={item} className="mda-application-tab-placeholder__item">
            {item}
          </li>
        ))}
      </ul>
      <p className="mda-application-tab-placeholder__note">Layout to be defined in a later mockup.</p>
    </section>
  );
}

const disabledCommand = { appearance: "subtle", type: "button", disabled: true, title: "Preview only" };

export default function ApplicationDetailView({
  application,
  applications,
  onBack,
  onOpenApplication,
  onNavigateHome,
  sitemapCollapsed = false,
  onToggleSitemap,
}) {
  const [activeTabId, setActiveTabId] = useState("general");
  const activeTab = APPLICATION_TABS.find((t) => t.id === activeTabId) ?? APPLICATION_TABS[0];

  const hasApplication = useCallback(
    (applicationNumber) => applications.some((a) => a.applicationNumber === applicationNumber),
    [applications],
  );

  const fieldContext = useMemo(
    () => ({
      createdLabel: dateLong.format(application.createdOn),
      submittedLabel: application.submittedOn ? dateLong.format(application.submittedOn) : "",
      hasApplication,
      onOpenApplication,
    }),
    [application, hasApplication, onOpenApplication],
  );

  return (
    <DynamicsAppShell
      activeNav="applications"
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
            aria-label="Back to applications"
          />
          <FluentButton {...disabledCommand} icon={<SaveRegular fontSize={16} />}>
            Save
          </FluentButton>
          <FluentButton {...disabledCommand} icon={<SaveRegular fontSize={16} />}>
            Save &amp; Close
          </FluentButton>
          <FluentButton {...disabledCommand} icon={<AddRegular fontSize={16} />}>
            New
          </FluentButton>
          <FluentButton {...disabledCommand} icon={<ArrowClockwiseRegular fontSize={16} />}>
            Refresh
          </FluentButton>
          <FluentButton {...disabledCommand} icon={<ShieldCheckmarkRegular fontSize={16} />}>
            Check Access
          </FluentButton>
          <FluentButton {...disabledCommand} icon={<PersonAddRegular fontSize={16} />}>
            Assign
          </FluentButton>
          <FluentButton {...disabledCommand} icon={<FlowRegular fontSize={16} />} iconPosition="before">
            <span className="mda-commandbar__flow-label">
              Flow <ChevronDownRegular fontSize={12} />
            </span>
          </FluentButton>
          <FluentButton {...disabledCommand} icon={<DocumentBulletListRegular fontSize={16} />} iconPosition="before">
            <span className="mda-commandbar__flow-label">
              Run Report <ChevronDownRegular fontSize={12} />
            </span>
          </FluentButton>
          <span className="mda-record-commandbar__spacer" aria-hidden="true" />
          <FluentButton {...disabledCommand} icon={<ShareRegular fontSize={16} />} iconPosition="before">
            <span className="mda-commandbar__flow-label">
              Share <ChevronDownRegular fontSize={12} />
            </span>
          </FluentButton>
        </div>

        <div className="mda-record-workspace">
          <div className="mda-record-form mda-detail-page-layout">
            <section
              className="mda-record-card mda-record-card--summary-band"
              aria-labelledby="mda-application-detail-card-title"
            >
              <header className="mda-record-header mda-record-header--detail">
                <div className="mda-record-header__main mda-application-header__main">
                  <Avatar name={application.contactName} size={40} color="neutral" />
                  <div>
                    <h2
                      id="mda-application-detail-card-title"
                      className="mda-record-header__title mda-record-header__title--primary"
                    >
                      <span className="mda-record-header__title-id">{application.applicationNumber}</span>
                      <span className="mda-record-header__title-sep"> - </span>
                      <span className="mda-record-header__title-saved">Saved</span>
                    </h2>
                    <p className="mda-record-header__subtitle">Application · {application.applicationType}</p>
                  </div>
                </div>
                <div className="mda-record-header__summary">
                  <div className="mda-record-header__context">
                    <HeaderSummaryField primary={application.contactName} secondary="Contact" showAvatar />
                    <HeaderSummaryField primary={application.schemeName} secondary="Scheme" />
                    <HeaderSummaryField primary={application.status} secondary="Application Status" />
                    <HeaderSummaryField primary={application.externalStatus} secondary="External Status" />
                  </div>
                </div>
              </header>

              <div className="mda-tabs mda-tabs--in-summary mda-application-tabs" role="tablist" aria-label="Application tabs">
                {APPLICATION_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    id={`application-tab-${tab.id}`}
                    aria-selected={activeTabId === tab.id}
                    aria-controls="application-tab-panel"
                    className={`mda-tab ${activeTabId === tab.id ? "mda-tab--active" : ""}`}
                    onClick={() => setActiveTabId(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </section>

            <div id="application-tab-panel" role="tabpanel" aria-labelledby={`application-tab-${activeTab.id}`}>
              {activeTab.id === "general" ? (
                <CustomizableCardGrid
                  entityKey="application"
                  cards={{
                    form: {
                      label: "Application details",
                      render: () => (
                        <section
                          className="mda-record-card mda-record-card--form mda-application-form"
                          aria-label="Application details"
                        >
                          <CustomizableFieldSection
                            entityKey="application"
                            record={application}
                            fields={APPLICATION_DETAIL_FIELDS}
                            context={fieldContext}
                          />
                        </section>
                      ),
                    },
                    timeline: {
                      label: "Timeline",
                      render: () => (
                        <RecordTimelineAside
                          activities={application.timeline}
                          regardingLabel="Application"
                          regardingName={application.applicationNumber}
                          recordMetaLabel={`Record created on ${dateShort.format(application.createdOn)}`}
                        />
                      ),
                    },
                  }}
                />
              ) : (
                <TabPlaceholder tab={activeTab} />
              )}
            </div>
          </div>
        </div>
      </main>
    </DynamicsAppShell>
  );
}
