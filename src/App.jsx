import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { useCallback, useMemo, useState } from "react";
import EditModeBanner from "./layoutCustomization/EditModeBanner.jsx";
import EditModeFab from "./layoutCustomization/EditModeFab.jsx";
import LayoutMasterReset from "./layoutCustomization/LayoutMasterReset.jsx";
import {
  DETAIL_VIEW_TYPES,
  LIST_VIEW_TYPES,
  LayoutCustomizationProvider,
} from "./layoutCustomization/LayoutCustomizationContext.jsx";
import "./layoutCustomization/LayoutEditMode.css";
import { ShellNavigationProvider } from "./shell/ShellNavigationContext.jsx";
import ApplicationDetailView from "./ApplicationDetailView.jsx";
import ApplicationsGrid from "./ApplicationsGrid.jsx";
import { mockApplications } from "./mockApplications.js";

export default function App() {
  const [applications] = useState(() => [...mockApplications]);
  const [view, setView] = useState({ type: "applications" });
  const [sitemapCollapsed, setSitemapCollapsed] = useState(false);
  const toggleSitemap = useCallback(() => {
    setSitemapCollapsed((prev) => !prev);
  }, []);

  const detailApplication = useMemo(() => {
    if (view.type !== "applicationDetail") return null;
    return applications.find((a) => a.applicationNumber === view.applicationNumber) ?? null;
  }, [view, applications]);

  const goApplicationsList = useCallback(() => setView({ type: "applications" }), []);
  const openApplication = useCallback((applicationNumber) => {
    setView({ type: "applicationDetail", applicationNumber });
  }, []);
  const shellNavigation = useMemo(
    () => ({ onNavigateApplications: goApplicationsList }),
    [goApplicationsList],
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
              onBack={goApplicationsList}
              onOpenApplication={openApplication}
              {...nav}
            />
          ) : (
            <ApplicationsGrid applications={applications} onOpenApplication={openApplication} {...nav} />
          )}
          <LayoutMasterReset />
          <EditModeBanner />
          <EditModeFab />
        </LayoutCustomizationProvider>
      </ShellNavigationProvider>
    </FluentProvider>
  );
}
