import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { useCallback, useMemo, useState } from "react";
import {
  DETAIL_VIEW_TYPES,
  LIST_VIEW_TYPES,
  LayoutCustomizationProvider,
} from "./layoutCustomization/LayoutCustomizationContext.jsx";
import { ShellNavigationProvider } from "./shell/ShellNavigationContext.jsx";
import ApplicationDetailView from "./ApplicationDetailView.jsx";
import ApplicationsGrid from "./ApplicationsGrid.jsx";
import AppealDetailView from "./AppealDetailView.jsx";
import AppealsGrid from "./AppealsGrid.jsx";
import DocumentTypesGrid from "./DocumentTypesGrid.jsx";
import UsersGrid from "./UsersGrid.jsx";
import UserDetailView from "./UserDetailView.jsx";
import { mockUsers } from "./mockUsers.js";
import { mockAppeals } from "./mockAppeals.js";
import { mockApplications } from "./mockApplications.js";
import { mockDocumentRequests } from "./mockDocumentTypes.js";

export default function App() {
  const [applications] = useState(() => [...mockApplications]);
  const [appeals] = useState(() => [...mockAppeals]);
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

  const goApplicationsList = useCallback(() => setView({ type: "applications" }), []);
  const goDocumentTypes = useCallback(() => setView({ type: "documentTypes" }), []);
  const goUsers = useCallback(() => setView({ type: "users" }), []);
  const goAppeals = useCallback(() => setView({ type: "appeals" }), []);
  const openUser = useCallback((userId) => setView({ type: "userDetail", userId }), []);
  const openAppeal = useCallback((appealNumber, fromApplication) => {
    setView({ type: "appealDetail", appealNumber, fromApplication: fromApplication || "" });
  }, []);
  const openApplication = useCallback((applicationNumber, tab) => {
    setView({ type: "applicationDetail", applicationNumber, tab: tab || "general" });
  }, []);
  const shellNavigation = useMemo(
    () => ({
      onNavigateApplications: goApplicationsList,
      onNavigateDocumentTypes: goDocumentTypes,
      onNavigateUsers: goUsers,
      onNavigateAppeals: goAppeals,
      areaId,
      onSelectArea: setAreaId,
    }),
    [areaId, goAppeals, goApplicationsList, goDocumentTypes, goUsers],
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
          {detailAppeal ? (
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
              initialTab={view.tab || "general"}
              {...nav}
            />
          ) : detailUser ? (
            <UserDetailView key={detailUser.userId} user={detailUser} onBack={goUsers} {...nav} />
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
