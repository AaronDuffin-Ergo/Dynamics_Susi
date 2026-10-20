import {
  BoardRegular,
  BookOpenRegular,
  BookQuestionMarkRegular,
  BriefcaseRegular,
  BuildingRegular,
  ClipboardCheckmarkRegular,
  ClipboardRegular,
  ClipboardTaskListLtrRegular,
  DataBarVerticalRegular,
  DocumentFolderRegular,
  DocumentTextRegular,
  GavelRegular,
  ListRegular,
  MoneyRegular,
  PaymentRegular,
  PeopleQueueRegular,
  PersonRegular,
  PeopleTeamRegular,
  ScalesRegular,
  SettingsRegular,
  ShieldCheckmarkRegular,
  ShieldLockRegular,
  ShieldTaskRegular,
  TableRegular,
  TagRegular,
  TaskListSquareLtrRegular,
  WalletRegular,
} from "@fluentui/react-icons";

const ITEMS = {
  dashboards: { label: "Dashboards", Icon: BoardRegular },
  activities: { label: "Activities", Icon: ClipboardRegular },
  queueItems: { label: "Queue Items", Icon: PeopleQueueRegular },
  accounts: { label: "Accounts", Icon: BuildingRegular },
  contacts: { label: "Contacts", Icon: PersonRegular },
  courses: { label: "Courses", Icon: BookOpenRegular },
  applications: { label: "Applications", Icon: ClipboardTaskListLtrRegular },
  appeals: { label: "Appeals", Icon: GavelRegular },
  sgabAppeals: { label: "SGAB Appeals", Icon: ScalesRegular },
  cases: { label: "Cases", Icon: BriefcaseRegular },
  informationRequests: { label: "Information Requests", Icon: ShieldLockRegular },
  complianceInvestigations: { label: "Compliance Investigations", Icon: ShieldTaskRegular },
  knowledgeArticles: { label: "Knowledge Articles", Icon: DocumentTextRegular },
  collegeFiles: { label: "College Files", Icon: DocumentFolderRegular },
  fees: { label: "Fees", Icon: MoneyRegular },
  applicantPaymentRun: { label: "Applicant Payment Run", Icon: PaymentRegular },
  bursary: { label: "Bursary", Icon: WalletRegular },
  applicationsQa: { label: "Applications QA", Icon: ClipboardCheckmarkRegular },
  casesQa: { label: "Cases QA", Icon: ShieldCheckmarkRegular },
  activitiesQa: { label: "Activities QA", Icon: TaskListSquareLtrRegular },
  cao: { label: "CAO", Icon: DataBarVerticalRegular },
  scheme: { label: "Scheme", Icon: SettingsRegular },
  paymentCodes: { label: "Payment Codes", Icon: TagRegular },
  appealGrounds: { label: "Appeal Grounds", Icon: ListRegular },
  appealGroundsReasons: { label: "Appeal Grounds Reasons", Icon: BookQuestionMarkRegular },
  documentTypes: { label: "Document Types", Icon: TableRegular },
  users: { label: "Users", Icon: PeopleTeamRegular },
};

const MY_WORK = { label: "My Work", items: ["dashboards", "activities", "queueItems"] };
const GENERAL = { label: "General", items: ["accounts", "contacts", "courses"] };

export const SITEMAP_AREAS = [
  {
    id: "applications",
    label: "Applications",
    color: "#0f6cbd",
    groups: [MY_WORK, GENERAL, { label: "Assessments", items: ["applications", "appeals"] }],
  },
  {
    id: "customerServices",
    label: "Customer Services",
    color: "#107c10",
    groups: [
      MY_WORK,
      GENERAL,
      { label: "Service", items: ["cases", "informationRequests", "complianceInvestigations", "knowledgeArticles"] },
      { label: "Assessments", items: ["applications", "appeals"] },
    ],
  },
  {
    id: "payments",
    label: "Payments",
    color: "#8a3707",
    groups: [
      MY_WORK,
      GENERAL,
      { label: "Assessments", items: ["applications"] },
      { label: "File Processing", items: ["collegeFiles", "fees", "applicantPaymentRun", "bursary"] },
    ],
  },
  {
    id: "qualityAssurance",
    label: "Quality Assurance",
    color: "#5c2e91",
    groups: [
      MY_WORK,
      { label: "General", items: ["accounts", "contacts"] },
      { label: "QA Records", items: ["applicationsQa", "casesQa", "activitiesQa"] },
    ],
  },
  {
    id: "administration",
    label: "Administration",
    color: "#3b3a39",
    groups: [
      { label: "Assessments", items: ["sgabAppeals"] },
      { label: "General", items: ["users"] },
      { label: "Configuration", items: ["cao", "scheme"] },
      {
        label: "Lookups",
        items: ["paymentCodes", "appealGrounds", "appealGroundsReasons", "documentTypes"],
      },
    ],
  },
];

export function sitemapItem(itemId) {
  return ITEMS[itemId];
}
