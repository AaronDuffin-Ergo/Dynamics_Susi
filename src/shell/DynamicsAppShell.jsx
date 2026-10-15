import {
  AddSquareRegular,
  ArrowClockwiseRegular,
  ChevronDownRegular,
  ClipboardTaskListLtrRegular,
  ClockRegular,
  FilterRegular,
  HomeRegular,
  QuestionCircleRegular,
  LineHorizontal3Regular,
  PinRegular,
  SearchRegular,
  SettingsRegular,
} from "@fluentui/react-icons";
import PowerAppsAppLauncherIcon from "../PowerAppsAppLauncherIcon.jsx";
import { useShellNavigation } from "./ShellNavigationContext.jsx";

/**
 * @param {object} props
 * @param {"home"|"applications"} props.activeNav
 * @param {string} [props.appClassName] — extra classes on .dynamics-app (e.g. mda-detail-record)
 * @param {"list"|"detail"|"form"} [props.headerVariant]
 * @param {React.ReactNode} props.children
 */
export default function DynamicsAppShell({
  activeNav = "applications",
  appClassName = "",
  headerVariant = "list",
  children,
  onNavigateHome,
  sitemapCollapsed = false,
  onToggleSitemap,
}) {
  const { onNavigateApplications } = useShellNavigation();
  const appClass = ["dynamics-app", sitemapCollapsed ? "dynamics-app--sitemap-collapsed" : "", appClassName]
    .filter(Boolean)
    .join(" ");

  const navItemClass = (key) =>
    ["dynamics-sitemap__item", activeNav === key ? "dynamics-sitemap__item--active" : ""]
      .filter(Boolean)
      .join(" ");

  return (
    <div className={appClass}>
      <header className="dynamics-app-header" role="banner">
        <div className="dynamics-app-header__brand">
          <button type="button" className="dynamics-app-header__logo" aria-label="App launcher">
            <PowerAppsAppLauncherIcon />
          </button>
          <span className="dynamics-app-header__product">Power Apps</span>
          <span className="dynamics-app-header__pipe" aria-hidden="true">
            |
          </span>
          <span className="dynamics-app-header__app">SUSI Portal</span>
          <span className="dynamics-app-header__divider" aria-hidden="true" />
          <span className="dynamics-app-header__env">SANDBOX</span>
        </div>
        <div className="dynamics-app-header__actions">
          <button type="button" className="dynamics-app-header__icon-btn" aria-label="Search">
            <SearchRegular />
          </button>
          {headerVariant === "detail" ? (
            <>
              <button type="button" className="dynamics-app-header__icon-btn" aria-label="Quick create">
                <AddSquareRegular />
              </button>
              <button type="button" className="dynamics-app-header__icon-btn" aria-label="Filter">
                <FilterRegular />
              </button>
              <button type="button" className="dynamics-app-header__icon-btn" aria-label="Settings">
                <SettingsRegular />
              </button>
              <button type="button" className="dynamics-app-header__icon-btn" aria-label="Help">
                <QuestionCircleRegular />
              </button>
            </>
          ) : headerVariant === "form" ? (
            <>
              <button type="button" className="dynamics-app-header__icon-btn" aria-label="Help">
                <QuestionCircleRegular />
              </button>
              <button type="button" className="dynamics-app-header__icon-btn" aria-label="Settings">
                <SettingsRegular />
              </button>
            </>
          ) : (
            <>
              <button type="button" className="dynamics-app-header__icon-btn" aria-label="Refresh">
                <ArrowClockwiseRegular />
              </button>
              <button type="button" className="dynamics-app-header__icon-btn" aria-label="Settings">
                <SettingsRegular />
              </button>
            </>
          )}
          <button type="button" className="dynamics-app-header__user" aria-label="Account">
            AD
          </button>
        </div>
      </header>

      <div className="dynamics-app-body">
        <nav
          className={`dynamics-sitemap mda-sitemap ${sitemapCollapsed ? "dynamics-sitemap--collapsed" : ""}`}
          aria-label="Site map"
        >
          <button
            type="button"
            className="dynamics-sitemap__toggle"
            onClick={onToggleSitemap}
            aria-label={sitemapCollapsed ? "Expand site map" : "Collapse site map"}
            aria-expanded={!sitemapCollapsed}
          >
            <LineHorizontal3Regular className="dynamics-sitemap__toggle-icon" />
          </button>
          <ul className="dynamics-sitemap__list dynamics-sitemap__list--pinned">
            <li>
              <button type="button" className={navItemClass("home")} onClick={() => onNavigateHome?.()}>
                <HomeRegular className="dynamics-sitemap__icon" />
                <span className="dynamics-sitemap__label">Home</span>
              </button>
            </li>
            <li>
              <button type="button" className="dynamics-sitemap__item">
                <ClockRegular className="dynamics-sitemap__icon" />
                <span className="dynamics-sitemap__label">Recent</span>
                <ChevronDownRegular className="dynamics-sitemap__chevron" />
              </button>
            </li>
            <li>
              <button type="button" className="dynamics-sitemap__item">
                <PinRegular className="dynamics-sitemap__icon" />
                <span className="dynamics-sitemap__label">Pinned</span>
                <ChevronDownRegular className="dynamics-sitemap__chevron" />
              </button>
            </li>
          </ul>
          <p className="mda-sitemap__group-label">Student Grants</p>
          <ul className="dynamics-sitemap__list dynamics-sitemap__list--section">
            <li>
              <button
                type="button"
                className={navItemClass("applications")}
                onClick={() => onNavigateApplications?.()}
              >
                <ClipboardTaskListLtrRegular className="dynamics-sitemap__icon" />
                <span className="dynamics-sitemap__label">Applications</span>
              </button>
            </li>
            <li>
              <button type="button" className="dynamics-sitemap__item">
                <SettingsRegular className="dynamics-sitemap__icon" />
                <span className="dynamics-sitemap__label">Settings</span>
              </button>
            </li>
          </ul>
        </nav>

        {children}
      </div>
    </div>
  );
}
