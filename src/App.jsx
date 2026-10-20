import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { useCallback, useMemo, useState } from "react";
import {
  DETAIL_VIEW_TYPES,
  LIST_VIEW_TYPES,
  LayoutCustomizationProvider,
} from "./layoutCustomization/LayoutCustomizationContext.jsx";
import { ShellNavigationProvider } from "./shell/ShellNavigationContext.jsx";
import { SGAB_APP_AREAS, SITEMAP_AREAS } from "./shell/sitemapAreas.js";
import AccountDetailView from "./AccountDetailView.jsx";
import AccountsGrid from "./AccountsGrid.jsx";
import ContactDetailView from "./ContactDetailView.jsx";
import ContactsGrid from "./ContactsGrid.jsx";
import ApplicationDetailView from "./ApplicationDetailView.jsx";
import ApplicationsGrid from "./ApplicationsGrid.jsx";
import AppealDetailView from "./AppealDetailView.jsx";
import AppealsGrid from "./AppealsGrid.jsx";
import SgabAppealDetailView from "./SgabAppealDetailView.jsx";
import SgabAppealsGrid from "./SgabAppealsGrid.jsx";
import InformationRequestDetailView from "./InformationRequestDetailView.jsx";
import InformationRequestsGrid from "./InformationRequestsGrid.jsx";
import InvestigationDetailView from "./InvestigationDetailView.jsx";
import InvestigationsGrid from "./InvestigationsGrid.jsx";
import DocumentTypesGrid from "./DocumentTypesGrid.jsx";
import FeeDetailView from "./FeeDetailView.jsx";
import FeesGrid from "./FeesGrid.jsx";
import UsersGrid from "./UsersGrid.jsx";
import UserDetailView from "./UserDetailView.jsx";
import { mockAccounts } from "./mockAccounts.js";
import { mockContacts } from "./mockContacts.js";
import { mockUsers } from "./mockUsers.js";
import { mockAppeals } from "./mockAppeals.js";
import { mockSgabAppeals } from "./mockSgabAppeals.js";
import { mockInformationRequests } from "./mockInformationRequests.js";
import { mockInvestigations } from "./mockInvestigations.js";
import { mockApplications } from "./mockApplications.js";
import { mockFees } from "./mockFees.js";
import { mockDocumentRequests } from "./mockDocumentTypes.js";

export default function App() {
  const [applications] = useState(() => [...mockApplications]);
  const [appeals] = useState(() => [...mockAppeals]);
  const [sgabAppeals] = useState(() => [...mockSgabAppeals]);
  const [accounts] = useState(() => [...mockAccounts]);
  const [contacts] = useState(() => [...mockContacts]);
  const [informationRequests] = useState(() => [...mockInformationRequests]);
  const [investigations] = useState(() => [...mockInvestigations]);
  const [users] = useState(() => [...mockUsers]);
  const [fees] = useState(() => [...mockFees]);
  const [documentRequests, setDocumentRequests] = useState(() => [...mockDocumentRequests]);
  const addDocumentRequest = useCallback((record) => {
    setDocumentRequests((current) => [...current, record]);
  }, []);
  const [view, setView] = useState({ type: "applications" });
  const [appId, setAppId] = useState("mySusi");
  const [areaId, setAreaId] = useState("applications");
  const [sitemapCollapsed, setSitemapCollapsed] = useState(false);
  const toggleSitemap = useCallback(() => {
    setSitemapCollapsed((prev) => !prev);
  }, []);

  const detailInvestigation = useMemo(() => {
    if (view.type !== "investigationDetail") return null;
    return investigations.find((item) => item.investigationNumber === view.investigationNumber) ?? null;
  }, [investigations, view]);

  const detailInformationRequest = useMemo(() => {
    if (view.type !== "informationRequestDetail") return null;
    return informationRequests.find((request) => request.requestNumber === view.requestNumber) ?? null;
  }, [informationRequests, view]);

  const detailContact = useMemo(() => {
    if (view.type !== "contactDetail") return null;
    return contacts.find((contact) => `${contact.firstName} ${contact.lastName}` === view.contactName) ?? null;
  }, [contacts, view]);

  const detailAccount = useMemo(() => {
    if (view.type !== "accountDetail") return null;
    return accounts.find((account) => account.accountName === view.accountName) ?? null;
  }, [accounts, view]);

  const detailSgabAppeal = useMemo(() => {
    if (view.type !== "sgabAppealDetail") return null;
    return sgabAppeals.find((appeal) => appeal.sgabAppealNumber === view.sgabAppealNumber) ?? null;
  }, [sgabAppeals, view]);

  const detailAppeal = useMemo(() => {
    if (view.type !== "appealDetail") return null;
    return appeals.find((appeal) => appeal.appealNumber === view.appealNumber) ?? null;
  }, [appeals, view]);

  const detailUser = useMemo(() => {
    if (view.type !== "userDetail") return null;
    return users.find((user) => user.userId === view.userId) ?? null;
  }, [view, users]);

  const detailFee = useMemo(() => {
    if (view.type !== "feeDetail") return null;
    return fees.find((fee) => fee.feeNumber === view.feeNumber) ?? null;
  }, [fees, view]);

  const detailApplication = useMemo(() => {
    if (view.type !== "applicationDetail") return null;
    return applications.find((a) => a.applicationNumber === view.applicationNumber) ?? null;
  }, [view, applications]);

  const leaveSgabApp = useCallback(() => {
    setAppId("mySusi");
    setAreaId((current) => (current === "sgab" || current === "administration" ? "applications" : current));
  }, []);
  const goInformationRequests = useCallback(() => {
    setAppId("mySusi");
    setAreaId("customerServices");
    setView({ type: "informationRequests" });
  }, []);
  const openInformationRequest = useCallback((requestNumber) => {
    setAppId("mySusi");
    setAreaId("customerServices");
    setView({ type: "informationRequestDetail", requestNumber });
  }, []);
  const goInvestigations = useCallback(() => {
    setAppId("mySusi");
    setAreaId("customerServices");
    setView({ type: "investigations" });
  }, []);
  const openInvestigation = useCallback((investigationNumber) => {
    setAppId("mySusi");
    setAreaId("customerServices");
    setView({ type: "investigationDetail", investigationNumber });
  }, []);
  const goContacts = useCallback(() => {
    leaveSgabApp();
    setView({ type: "contacts" });
  }, [leaveSgabApp]);
  const openContact = useCallback((contactName, source = {}) => {
    leaveSgabApp();
    setView({
      type: "contactDetail",
      contactName,
      fromAccount: source.fromAccount || "",
      fromApplication: source.fromApplication || "",
      fromInformationRequest: source.fromInformationRequest || "",
      fromInvestigation: source.fromInvestigation || "",
    });
  }, [leaveSgabApp]);
  const hasContact = useCallback(
    (contactName) => contacts.some((contact) => `${contact.firstName} ${contact.lastName}` === contactName),
    [contacts],
  );
  const goAccounts = useCallback(() => {
    leaveSgabApp();
    setView({ type: "accounts" });
  }, [leaveSgabApp]);
  const goApplicationsList = useCallback(() => {
    leaveSgabApp();
    setView({ type: "applications" });
  }, [leaveSgabApp]);
  const openAccount = useCallback((accountName, fromApplication, fromContact, fromInvestigation) => {
    leaveSgabApp();
    setView({
      type: "accountDetail",
      accountName,
      fromApplication: fromApplication || "",
      fromContact: fromContact || "",
      fromInvestigation: fromInvestigation || "",
    });
  }, [leaveSgabApp]);
  const hasAccount = useCallback((accountName) => accounts.some((account) => account.accountName === accountName), [accounts]);
  const goDocumentTypes = useCallback(() => {
    leaveSgabApp();
    setView({ type: "documentTypes" });
  }, [leaveSgabApp]);
  const goUsers = useCallback(() => {
    leaveSgabApp();
    setView({ type: "users" });
  }, [leaveSgabApp]);
  const goAppealsList = useCallback(() => {
    leaveSgabApp();
    setView({ type: "appeals" });
  }, [leaveSgabApp]);
  const goFeesList = useCallback(() => {
    setAppId("mySusi");
    setAreaId("payments");
    setView({ type: "fees" });
  }, []);
  const openFee = useCallback((feeNumber) => {
    setAppId("mySusi");
    setAreaId("payments");
    setView({ type: "feeDetail", feeNumber, tab: "collegeFees" });
  }, []);
  const goFees = useCallback(() => openFee("FEE-2026-000014"), [openFee]);
  const goAppeals = useCallback(() => {
    leaveSgabApp();
    setView({ type: "appealDetail", appealNumber: "AP26-000141" });
  }, [leaveSgabApp]);
  const goSgabAppealsList = useCallback(() => {
    setAreaId(appId === "sgab" ? "sgab" : "applications");
    setView({ type: "sgabAppeals" });
  }, [appId]);
  const goSgabAppeals = useCallback(() => {
    setAreaId(appId === "sgab" ? "sgab" : "applications");
    setView({ type: "sgabAppealDetail", sgabAppealNumber: "SGAB-2026-000123" });
  }, [appId]);
  const openSgabAppeal = useCallback((sgabAppealNumber, fromApplication) => {
    setAreaId(appId === "sgab" ? "sgab" : "applications");
    setView({ type: "sgabAppealDetail", sgabAppealNumber, fromApplication: fromApplication || "" });
  }, [appId]);
  const openUser = useCallback((userId) => {
    leaveSgabApp();
    setView({ type: "userDetail", userId });
  }, [leaveSgabApp]);
  const selectApp = useCallback((nextAppId) => {
    if (nextAppId === "sgab") {
      setAppId("sgab");
      setAreaId("sgab");
      setView({ type: "sgabAppealDetail", sgabAppealNumber: "SGAB-2026-000123" });
      return;
    }
    setAppId("mySusi");
    setAreaId("applications");
    setView({ type: "applications" });
  }, []);
  const selectArea = useCallback((nextAreaId) => {
    setAreaId((current) => (appId === "sgab" && nextAreaId !== "sgab" ? current : nextAreaId));
  }, [appId]);
  const openAppeal = useCallback((appealNumber, fromApplication) => {
    leaveSgabApp();
    setView({ type: "appealDetail", appealNumber, fromApplication: fromApplication || "" });
  }, [leaveSgabApp]);
  const openApplication = useCallback((applicationNumber, tab, fromInformationRequest, fromInvestigation) => {
    leaveSgabApp();
    setView({
      type: "applicationDetail",
      applicationNumber,
      tab: tab || "general",
      fromInformationRequest: fromInformationRequest || "",
      fromInvestigation: fromInvestigation || "",
    });
  }, [leaveSgabApp]);
  const shellNavigation = useMemo(
    () => ({
      onNavigateAccounts: goAccounts,
      onNavigateContacts: goContacts,
      onNavigateInformationRequests: goInformationRequests,
      onNavigateInvestigations: goInvestigations,
      onNavigateApplications: goApplicationsList,
      onNavigateDocumentTypes: goDocumentTypes,
      onNavigateUsers: goUsers,
      onNavigateAppeals: goAppeals,
      onNavigateFees: goFees,
      onNavigateSgabAppeals: goSgabAppeals,
      appId,
      appLabel: "My SUSI",
      areas: appId === "sgab" ? SGAB_APP_AREAS : SITEMAP_AREAS,
      areaId,
      onSelectApp: selectApp,
      onSelectArea: selectArea,
    }),
    [appId, areaId, goAccounts, goAppeals, goApplicationsList, goContacts, goDocumentTypes, goFees, goInformationRequests, goInvestigations, goSgabAppeals, goUsers, selectApp, selectArea],
  );

  const nav = {
    onNavigateHome: appId === "sgab" ? goSgabAppealsList : goApplicationsList,
    sitemapCollapsed,
    onToggleSitemap: toggleSitemap,
  };

  const isRecordDetailView = DETAIL_VIEW_TYPES.has(view.type);
  const isListView = LIST_VIEW_TYPES.has(view.type);

  return (
    <FluentProvider theme={webLightTheme}>
      <ShellNavigationProvider value={shellNavigation}>
        <LayoutCustomizationProvider isRecordDetailView={isRecordDetailView} isListView={isListView}>
          {detailInvestigation ? (
            <InvestigationDetailView
              key={detailInvestigation.investigationNumber}
              investigation={detailInvestigation}
              onBack={goInvestigations}
              onOpenAccount={(accountName) => openAccount(accountName, "", "", detailInvestigation.investigationNumber)}
              onOpenContact={(contactName) => openContact(contactName, { fromInvestigation: detailInvestigation.investigationNumber })}
              onOpenApplication={(applicationNumber) => openApplication(applicationNumber, "general", "", detailInvestigation.investigationNumber)}
              {...nav}
            />
          ) : detailInformationRequest ? (
            <InformationRequestDetailView
              key={detailInformationRequest.requestNumber}
              request={detailInformationRequest}
              onBack={goInformationRequests}
              onOpenContact={(contactName) =>
                openContact(contactName, { fromInformationRequest: detailInformationRequest.requestNumber })
              }
              onOpenApplication={(applicationNumber) => openApplication(applicationNumber, "general", detailInformationRequest.requestNumber)}
              {...nav}
            />
          ) : detailContact ? (
            <ContactDetailView
              key={detailContact.contactId}
              contact={detailContact}
              onBack={
                view.fromAccount
                  ? () => openAccount(view.fromAccount, view.fromApplication)
                  : view.fromApplication
                    ? () => openApplication(view.fromApplication)
                    : view.fromInformationRequest
                      ? () => openInformationRequest(view.fromInformationRequest)
                      : view.fromInvestigation
                        ? () => openInvestigation(view.fromInvestigation)
                        : goContacts
              }
              onOpenAccount={(accountName) => openAccount(accountName, "", detailContact.fullName || `${detailContact.firstName} ${detailContact.lastName}`)}
              {...nav}
            />
          ) : detailAccount ? (
            <AccountDetailView
              key={detailAccount.accountId}
              account={detailAccount}
              onBack={
                view.fromContact
                  ? () => openContact(view.fromContact)
                  : view.fromApplication
                    ? () => openApplication(view.fromApplication)
                    : view.fromInvestigation
                      ? () => openInvestigation(view.fromInvestigation)
                      : goAccounts
              }
              onOpenAccount={openAccount}
              onOpenContact={(contactName) =>
                openContact(contactName, { fromAccount: detailAccount.accountName, fromApplication: view.fromApplication })
              }
              {...nav}
            />
          ) : detailSgabAppeal ? (
            <SgabAppealDetailView
              key={detailSgabAppeal.sgabAppealNumber}
              appeal={detailSgabAppeal}
              onBack={
                view.fromApplication
                  ? () => openApplication(view.fromApplication, "appeals")
                  : goSgabAppealsList
              }
              onOpenApplication={openApplication}
              onOpenAppeal={(appealNumber) => openAppeal(appealNumber)}
              onOpenContact={(contactName) => openContact(contactName)}
              {...nav}
            />
          ) : detailFee ? (
            <FeeDetailView
              key={detailFee.feeNumber}
              fee={detailFee}
              initialTab={view.tab || "collegeFees"}
              onBack={goFeesList}
              onOpenCollege={(college) => openAccount(college)}
              {...nav}
            />
          ) : detailAppeal ? (
            <AppealDetailView
              key={detailAppeal.appealNumber}
              appeal={detailAppeal}
              onBack={
                view.fromApplication
                  ? () => openApplication(view.fromApplication, "appeals")
                  : goAppealsList
              }
              onOpenApplication={openApplication}
              {...nav}
            />
          ) : detailApplication ? (
            <ApplicationDetailView
              key={`${detailApplication.applicationNumber}-${view.tab || "general"}`}
              application={detailApplication}
              applications={applications}
              documentRequests={documentRequests}
              onCreateDocumentRequest={addDocumentRequest}
              onBack={
                view.fromInformationRequest
                  ? () => openInformationRequest(view.fromInformationRequest)
                  : view.fromInvestigation
                    ? () => openInvestigation(view.fromInvestigation)
                    : goApplicationsList
              }
              onOpenApplication={openApplication}
              onOpenAppeal={(appealNumber) => openAppeal(appealNumber, detailApplication.applicationNumber)}
              onOpenSgabAppeal={(sgabAppealNumber) => openSgabAppeal(sgabAppealNumber, detailApplication.applicationNumber)}
              onOpenAccount={(accountName) => openAccount(accountName, detailApplication.applicationNumber)}
              hasAccount={hasAccount}
              onOpenContact={(contactName) => openContact(contactName, { fromApplication: detailApplication.applicationNumber })}
              hasContact={hasContact}
              initialTab={view.tab || "general"}
              {...nav}
            />
          ) : detailUser ? (
            <UserDetailView key={detailUser.userId} user={detailUser} onBack={goUsers} {...nav} />
          ) : view.type === "investigations" ? (
            <InvestigationsGrid investigations={investigations} onOpenInvestigation={openInvestigation} {...nav} />
          ) : view.type === "informationRequests" ? (
            <InformationRequestsGrid requests={informationRequests} onOpenRequest={openInformationRequest} {...nav} />
          ) : view.type === "contacts" ? (
            <ContactsGrid contacts={contacts} onOpenContact={openContact} {...nav} />
          ) : view.type === "accounts" ? (
            <AccountsGrid accounts={accounts} onOpenAccount={openAccount} {...nav} />
          ) : view.type === "sgabAppeals" ? (
            <SgabAppealsGrid appeals={sgabAppeals} onOpenSgabAppeal={openSgabAppeal} {...nav} />
          ) : view.type === "appeals" ? (
            <AppealsGrid appeals={appeals} onOpenAppeal={openAppeal} {...nav} />
          ) : view.type === "fees" ? (
            <FeesGrid fees={fees} onOpenFee={openFee} {...nav} />
          ) : view.type === "users" ? (
            <UsersGrid users={users} onOpenUser={openUser} {...nav} />
          ) : view.type === "documentTypes" ? (
            <DocumentTypesGrid {...nav} />
          ) : (
            <ApplicationsGrid applications={applications} onOpenApplication={openApplication} {...nav} />
          )}
        </LayoutCustomizationProvider>
      </ShellNavigationProvider>
    </FluentProvider>
  );
}
