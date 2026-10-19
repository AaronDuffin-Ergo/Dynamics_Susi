import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { useCallback, useMemo, useState } from "react";
import {
  DETAIL_VIEW_TYPES,
  LIST_VIEW_TYPES,
  LayoutCustomizationProvider,
} from "./layoutCustomization/LayoutCustomizationContext.jsx";
import { ShellNavigationProvider } from "./shell/ShellNavigationContext.jsx";
import AccountDetailView from "./AccountDetailView.jsx";
import AccountsGrid from "./AccountsGrid.jsx";
import ApplicationDetailView from "./ApplicationDetailView.jsx";
import ApplicationsGrid from "./ApplicationsGrid.jsx";
import AppealDetailView from "./AppealDetailView.jsx";
import AppealsGrid from "./AppealsGrid.jsx";
import SgabAppealDetailView from "./SgabAppealDetailView.jsx";
import SgabAppealsGrid from "./SgabAppealsGrid.jsx";
import DocumentTypesGrid from "./DocumentTypesGrid.jsx";
import UsersGrid from "./UsersGrid.jsx";
import UserDetailView from "./UserDetailView.jsx";
import { mockAccounts } from "./mockAccounts.js";
import { mockUsers } from "./mockUsers.js";
import { mockAppeals } from "./mockAppeals.js";
import { mockSgabAppeals } from "./mockSgabAppeals.js";
import { mockApplications } from "./mockApplications.js";
import { mockDocumentRequests } from "./mockDocumentTypes.js";

export default function App() {
  const [applications] = useState(() => [...mockApplications]);
  const [appeals] = useState(() => [...mockAppeals]);
  const [sgabAppeals] = useState(() => [...mockSgabAppeals]);
  const [accounts] = useState(() => [...mockAccounts]);
  const [users] = useState(() => [...mockUsers]);
  const [documentRequests, setDocumentRequests] = useState(() => [...mockDocumentRequests]);
  const addDocumentRequest = useCallback((record) => {
    setDocumentRequests((current) => [...current, record]);
  }, []);
  const [view, setView] = useState({ type: "applications" });
  const [areaId, setAreaId] = useState("applications");
  const [sitemapCollapsed, setSitemapCollapsed] = useState(false);
  const toggleSitemap = useCallback(() => {
    setSitemapCollapsed((prev) => !prev);
  }, []);

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

  const detailApplication = useMemo(() => {
    if (view.type !== "applicationDetail") return null;
    return applications.find((a) => a.applicationNumber === view.applicationNumber) ?? null;
  }, [view, applications]);

  const goAccounts = useCallback(() => setView({ type: "accounts" }), []);
  const goApplicationsList = useCallback(() => setView({ type: "applications" }), []);
  const openAccount = useCallback((accountName, fromApplication) => {
    setView({ type: "accountDetail", accountName, fromApplication: fromApplication || "" });
  }, []);
  const hasAccount = useCallback((accountName) => accounts.some((account) => account.accountName === accountName), [accounts]);
  const goDocumentTypes = useCallback(() => setView({ type: "documentTypes" }), []);
  const goUsers = useCallback(() => setView({ type: "users" }), []);
  const goAppeals = useCallback(() => setView({ type: "appeals" }), []);
  const goSgabAppeals = useCallback(() => setView({ type: "sgabAppeals" }), []);
  const openSgabAppeal = useCallback((sgabAppealNumber, fromApplication) => {
    setView({ type: "sgabAppealDetail", sgabAppealNumber, fromApplication: fromApplication || "" });
  }, []);
  const openUser = useCallback((userId) => setView({ type: "userDetail", userId }), []);
  const openAppeal = useCallback((appealNumber, fromApplication) => {
    setView({ type: "appealDetail", appealNumber, fromApplication: fromApplication || "" });
  }, []);
  const openApplication = useCallback((applicationNumber, tab) => {
    setView({ type: "applicationDetail", applicationNumber, tab: tab || "general" });
  }, []);
  const shellNavigation = useMemo(
    () => ({
      onNavigateAccounts: goAccounts,
      onNavigateApplications: goApplicationsList,
      onNavigateDocumentTypes: goDocumentTypes,
      onNavigateUsers: goUsers,
      onNavigateAppeals: goAppeals,
      onNavigateSgabAppeals: goSgabAppeals,
      areaId,
      onSelectArea: setAreaId,
    }),
    [areaId, goAccounts, goAppeals, goApplicationsList, goDocumentTypes, goSgabAppeals, goUsers],
  );

  const nav = {
    onNavigateHome: goApplicationsList,
    sitemapCollapsed,
    onToggleSitemap: toggleSitemap,
  };

  const isRecordDetailView = DETAIL_VIEW_TYPES.has(view.type);
  const isListView = LIST_VIEW_TYPES.has(view.type);

  return (
    <FluentProvider theme={webLightTheme}>
      <ShellNavigationProvider value={shellNavigation}>
        <LayoutCustomizationProvider isRecordDetailView={isRecordDetailView} isListView={isListView}>
          {detailAccount ? (
            <AccountDetailView
              key={detailAccount.accountId}
              account={detailAccount}
              onBack={view.fromApplication ? () => openApplication(view.fromApplication) : goAccounts}
              onOpenAccount={openAccount}
              {...nav}
            />
          ) : detailSgabAppeal ? (
            <SgabAppealDetailView
              key={detailSgabAppeal.sgabAppealNumber}
              appeal={detailSgabAppeal}
              onBack={
                view.fromApplication
                  ? () => openApplication(view.fromApplication, "appeals")
                  : goSgabAppeals
              }
              onOpenApplication={openApplication}
              {...nav}
            />
          ) : detailAppeal ? (
            <AppealDetailView
              key={detailAppeal.appealNumber}
              appeal={detailAppeal}
              onBack={
                view.fromApplication
                  ? () => openApplication(view.fromApplication, "appeals")
                  : goAppeals
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
              onBack={goApplicationsList}
              onOpenApplication={openApplication}
              onOpenAppeal={(appealNumber) => openAppeal(appealNumber, detailApplication.applicationNumber)}
              onOpenSgabAppeal={(sgabAppealNumber) => openSgabAppeal(sgabAppealNumber, detailApplication.applicationNumber)}
              onOpenAccount={(accountName) => openAccount(accountName, detailApplication.applicationNumber)}
              hasAccount={hasAccount}
              initialTab={view.tab || "general"}
              {...nav}
            />
          ) : detailUser ? (
            <UserDetailView key={detailUser.userId} user={detailUser} onBack={goUsers} {...nav} />
          ) : view.type === "accounts" ? (
            <AccountsGrid accounts={accounts} onOpenAccount={openAccount} {...nav} />
          ) : view.type === "sgabAppeals" ? (
            <SgabAppealsGrid appeals={sgabAppeals} onOpenSgabAppeal={openSgabAppeal} {...nav} />
          ) : view.type === "appeals" ? (
            <AppealsGrid appeals={appeals} onOpenAppeal={openAppeal} {...nav} />
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
