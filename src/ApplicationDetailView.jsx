import { useCallback, useMemo, useState } from "react";
import { Avatar, Button as FluentButton, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger } from "@fluentui/react-components";
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
import AnswersSubgrid from "./AnswersSubgrid.jsx";
import DocumentRequestQuickCreate from "./DocumentRequestQuickCreate.jsx";
import ApplicationRecordRail from "./detailRecord/ApplicationRecordRail.jsx";
import RecordTimelineAside from "./detailRecord/RecordTimelineAside.jsx";
import ApprovalLogSubgrid from "./ApprovalLogSubgrid.jsx";
import AppealsSubgrid from "./AppealsSubgrid.jsx";
import SgabAppealsSubgrid from "./SgabAppealsSubgrid.jsx";
import RelatedApplicationsSubgrid from "./RelatedApplicationsSubgrid.jsx";
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
  { id: "approvals", label: "Approvals" },
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

const DOC_COLUMNS = [
  { id: "documentTypeName", label: "Document Type", required: true },
  { id: "relationship", label: "Relationship", required: true },
  { id: "requestType", label: "Request Type" },
  { id: "status", label: "Status", required: true },
  { id: "requestedOn", label: "Requested On" },
  { id: "expiryDate", label: "Expiry Date" },
];

function formatRequestDate(value) {
  if (!value) return "—";
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat(undefined, { month: "numeric", day: "numeric", year: "numeric" }).format(
    new Date(year, month - 1, day),
  );
}

function documentCell(request, columnId) {
  if (columnId === "requestedOn") return request.requestedOn || "";
  if (columnId === "expiryDate") return request.expire === "Yes" ? request.expiryDate || "" : "No expiry";
  return request[columnId] ?? "";
}

function DocumentRequestsPanel({ requests, onNew }) {
  const [sort, setSort] = useState({ column: "documentTypeName", direction: "ascending" });
  const [selected, setSelected] = useState(() => new Set());
  const [notice, setNotice] = useState("");

  const sorted = useMemo(() => {
    const copy = [...requests];
    copy.sort((a, b) => {
      const result = String(documentCell(a, sort.column)).localeCompare(String(documentCell(b, sort.column)));
      return sort.direction === "ascending" ? result : -result;
    });
    return copy;
  }, [requests, sort]);

  const allSelected = requests.length > 0 && selected.size === requests.length;
  const someSelected = selected.size > 0 && !allSelected;

  const toggleSort = (columnId) => {
    setSort((current) =>
      current.column === columnId
        ? { column: columnId, direction: current.direction === "ascending" ? "descending" : "ascending" }
        : { column: columnId, direction: "ascending" },
    );
  };

  const toggleRow = (id) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="mda-record-card mda-related-subgrid" aria-label="Document Requests">
      <header className="mda-related-subgrid__header">
        <h3 className="mda-related-subgrid__title">Document Requests</h3>
        <div className="mda-related-subgrid__commands" role="toolbar" aria-label="Document request commands">
          <FluentButton appearance="subtle" type="button" onClick={onNew}>
            <span className="dynamics-cmd-btn__inner">
              <AddRegular className="dynamics-cmd-btn__icon" />
              <span>New Document Request</span>
            </span>
          </FluentButton>
          <FluentButton
            appearance="subtle"
            type="button"
            onClick={() => {
              setSelected(new Set());
              setSort({ column: "documentTypeName", direction: "ascending" });
              setNotice("");
            }}
          >
            <span className="dynamics-cmd-btn__inner">
              <ArrowClockwiseRegular className="dynamics-cmd-btn__icon" />
              <span>Refresh</span>
            </span>
          </FluentButton>
          <Menu>
            <MenuTrigger disableButtonEnhancement>
              <FluentButton appearance="subtle" type="button">
                <span className="dynamics-cmd-btn__inner">
                  <FlowRegular className="dynamics-cmd-btn__icon" />
                  <span>Flow</span>
                  <ChevronDownRegular className="dynamics-cmd-btn__chevron" aria-hidden />
                </span>
              </FluentButton>
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem disabled>No flows are available</MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </div>
      </header>
      {notice ? <p className="mda-related-subgrid__notice">{notice}</p> : null}
      <div className="mda-related-subgrid__scroll">
        <table className="mda-related-subgrid__table">
          <thead>
            <tr>
              <th className="mda-related-subgrid__check" scope="col">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(element) => {
                    if (element) element.indeterminate = someSelected;
                  }}
                  onChange={() => setSelected(allSelected ? new Set() : new Set(requests.map((item) => item.id)))}
                  aria-label="Select all document requests"
                  disabled={requests.length === 0}
                />
              </th>
              {DOC_COLUMNS.map((column) => {
                const active = sort.column === column.id;
                return (
                  <th key={column.id} scope="col" aria-sort={active ? sort.direction : "none"}>
                    <button type="button" className="mda-related-subgrid__sort" onClick={() => toggleSort(column.id)}>
                      <span>
                        {column.label}
                        {column.required ? <span className="mda-related-subgrid__req"> *</span> : null}
                      </span>
                      <ChevronDownRegular
                        className={`mda-related-subgrid__chevron${active && sort.direction === "ascending" ? " mda-related-subgrid__chevron--up" : ""}`}
                        aria-hidden
                      />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map((request) => {
              const isSelected = selected.has(request.id);
              return (
                <tr
                  key={request.id}
                  className={isSelected ? "mda-related-subgrid__row--selected" : ""}
                  onClick={() => toggleRow(request.id)}
                >
                  <td className="mda-related-subgrid__check">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRow(request.id)}
                      onClick={(event) => event.stopPropagation()}
                      aria-label={`Select ${request.documentTypeName}`}
                    />
                  </td>
                  <td>
                    <button type="button" className="dynamics-grid-link">
                      {request.documentTypeName}
                    </button>
                  </td>
                  <td>{request.relationship}</td>
                  <td>{request.requestType}</td>
                  <td>{request.status}</td>
                  <td>{formatRequestDate(request.requestedOn)}</td>
                  <td>{request.expire === "Yes" ? formatRequestDate(request.expiryDate) : "No expiry"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {requests.length === 0 ? (
          <p className="mda-related-subgrid__empty">No document requests.</p>
        ) : null}
      </div>
      <footer className="mda-related-subgrid__footer">Rows: {requests.length}</footer>
    </section>
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
  documentRequests = [],
  onCreateDocumentRequest,
  onBack,
  onOpenApplication,
  onOpenAppeal,
  onOpenSgabAppeal,
  onOpenAccount,
  hasAccount,
  initialTab = "general",
  onNavigateHome,
  sitemapCollapsed = false,
  onToggleSitemap,
}) {
  const [activeTabId, setActiveTabId] = useState(initialTab);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
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
      hasAccount,
      onOpenAccount,
    }),
    [application, hasAccount, hasApplication, onOpenAccount, onOpenApplication],
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
                    rail: {
                      label: "Related",
                      render: () => <ApplicationRecordRail application={application} />,
                    },
                  }}
                />
              ) : activeTab.id === "answers" ? (
                <AnswersSubgrid application={application} />
              ) : activeTab.id === "documents" ? (
                <DocumentRequestsPanel
                  requests={documentRequests.filter((item) => item.regarding === application.applicationNumber)}
                  onNew={() => setQuickCreateOpen(true)}
                />
              ) : activeTab.id === "linked" ? (
                <RelatedApplicationsSubgrid
                  applicationNumber={application.applicationNumber}
                  onOpenApplication={onOpenApplication}
                />
              ) : activeTab.id === "approvals" ? (
                <ApprovalLogSubgrid applicationNumber={application.applicationNumber} />
              ) : activeTab.id === "appeals" ? (
                <div className="mda-related-stack">
                  <AppealsSubgrid applicationNumber={application.applicationNumber} onOpenAppeal={onOpenAppeal} />
                  <SgabAppealsSubgrid applicationNumber={application.applicationNumber} onOpenSgabAppeal={onOpenSgabAppeal} />
                </div>
              ) : (
                <TabPlaceholder tab={activeTab} />
              )}
            </div>
          </div>
        </div>
        {quickCreateOpen ? (
          <DocumentRequestQuickCreate
            application={application}
            onClose={() => setQuickCreateOpen(false)}
            onSave={onCreateDocumentRequest}
          />
        ) : null}
      </main>
    </DynamicsAppShell>
  );
}
