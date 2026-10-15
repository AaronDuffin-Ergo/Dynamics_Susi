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
import DocumentTypesGrid from "./DocumentTypesGrid.jsx";
import UsersGrid from "./UsersGrid.jsx";
import UserDetailView from "./UserDetailView.jsx";
import { mockUsers } from "./mockUsers.js";
import { mockApplications } from "./mockApplications.js";
import { mockDocumentRequests } from "./mockDocumentTypes.js";

export default function App() {
  const [applications] = useState(() => [...mockApplications]);
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
  const openUser = useCallback((userId) => setView({ type: "userDetail", userId }), []);
  const openApplication = useCallback((applicationNumber) => {
    setView({ type: "applicationDetail", applicationNumber });
  }, []);
  const shellNavigation = useMemo(
    () => ({
      onNavigateApplications: goApplicationsList,
      onNavigateDocumentTypes: goDocumentTypes,
      onNavigateUsers: goUsers,
      areaId,
      onSelectArea: setAreaId,
    }),
    [goApplicationsList, goDocumentTypes, goUsers, areaId],
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
          {detailApplication ? (
            <ApplicationDetailView
              key={detailApplication.applicationNumber}
              application={detailApplication}
              applications={applications}
              documentRequests={documentRequests}
              onCreateDocumentRequest={addDocumentRequest}
              onBack={goApplicationsList}
              onOpenApplication={openApplication}
              {...nav}
            />
          ) : detailUser ? (
            <UserDetailView key={detailUser.userId} user={detailUser} onBack={goUsers} {...nav} />
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
