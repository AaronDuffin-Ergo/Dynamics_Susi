import { useEffect, useRef, useState } from "react";
import {
  AddSquareRegular,
  ArrowClockwiseRegular,
  CheckmarkRegular,
  ChevronDownRegular,
  ChevronUpDownRegular,
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
import { APPS, SITEMAP_AREAS, sitemapItem } from "./sitemapAreas.js";
import { useShellNavigation } from "./ShellNavigationContext.jsx";

function AreaTile({ area }) {
  return (
    <span className="dynamics-area-tile" style={{ background: area.color }} aria-hidden="true">
      {area.label.slice(0, 1)}
    </span>
  );
}

function AppLauncher({ appId, onSelectApp }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="dynamics-app-launcher" ref={rootRef}>
      <button
        type="button"
        className="dynamics-app-header__logo"
        aria-label="App launcher"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <PowerAppsAppLauncherIcon />
      </button>
      {open ? (
        <ul className="dynamics-app-launcher__menu" role="menu" aria-label="Apps">
          {APPS.map((app) => {
            const selected = app.id === appId;
            return (
              <li key={app.id}>
                <button
                  type="button"
                  role="menuitem"
                  className={`dynamics-app-launcher__option${selected ? " dynamics-app-launcher__option--selected" : ""}`}
                  aria-current={selected ? "true" : undefined}
                  onClick={() => {
                    onSelectApp?.(app.id);
                    setOpen(false);
                  }}
                >
                  <span>{app.label}</span>
                  {selected ? <CheckmarkRegular aria-hidden /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function AreaSwitcher({ areas, areaId, onSelectArea, collapsed }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const current = areas.find((area) => area.id === areaId) ?? areas[0];

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="dynamics-area-switcher" ref={rootRef}>
      {open ? (
        <ul className="dynamics-area-switcher__menu" role="listbox" aria-label="Change area">
          {areas.map((area) => {
            const selected = area.id === current.id;
            return (
              <li key={area.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`dynamics-area-switcher__option${selected ? " dynamics-area-switcher__option--selected" : ""}`}
                  onClick={() => {
                    onSelectArea?.(area.id);
                    setOpen(false);
                  }}
                >
                  <AreaTile area={area} />
                  <span className="dynamics-area-switcher__option-label">{area.label}</span>
                  {selected ? <CheckmarkRegular className="dynamics-area-switcher__check" aria-hidden /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
      <button
        type="button"
        className="dynamics-area-switcher__button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Change area. Current area: ${current.label}`}
        onClick={() => setOpen((value) => !value)}
      >
        <AreaTile area={current} />
        {collapsed ? null : (
          <>
            <span className="dynamics-area-switcher__label">{current.label}</span>
            <ChevronUpDownRegular className="dynamics-area-switcher__chevron" aria-hidden />
          </>
        )}
      </button>
    </div>
  );
}

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
  const { onNavigateAccounts, onNavigateApplications, onNavigateAppeals, onNavigateContacts, onNavigateDocumentTypes, onNavigateFees, onNavigateInformationRequests, onNavigateInvestigations, onNavigateSgabAppeals, onNavigateUsers, appId = "mySusi", appLabel = "My SUSI", areas = SITEMAP_AREAS, areaId = "applications", onSelectApp, onSelectArea } =
    useShellNavigation();
  const area = areas.find((item) => item.id === areaId) ?? areas[0];
  const appClass = ["dynamics-app", sitemapCollapsed ? "dynamics-app--sitemap-collapsed" : "", appClassName]
    .filter(Boolean)
    .join(" ");

  const navItemClass = (key) =>
    ["dynamics-sitemap__item", activeNav === key ? "dynamics-sitemap__item--active" : ""]
      .filter(Boolean)
      .join(" ");

  const isApplicationsEntry = (groupLabel, itemId) =>
    area.id === "applications" && groupLabel === "Assessments" && itemId === "applications";

  return (
    <div className={appClass}>
      <header className="dynamics-app-header" role="banner">
        <div className="dynamics-app-header__brand">
          <AppLauncher appId={appId} onSelectApp={onSelectApp} />
          <span className="dynamics-app-header__product">Power Apps</span>
          <span className="dynamics-app-header__pipe" aria-hidden="true">
            |
          </span>
          <span className="dynamics-app-header__app">{appLabel}</span>
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
          <div className="dynamics-sitemap__scroll">
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

            {area.groups.map((group) => (
              <section key={`${area.id}-${group.label}`} aria-label={group.label}>
                {group.label ? <p className="mda-sitemap__group-label">{group.label}</p> : null}
                <ul className="dynamics-sitemap__list dynamics-sitemap__list--section">
                  {group.items.map((itemId) => {
                    const item = sitemapItem(itemId);
                    const entry = isApplicationsEntry(group.label, itemId);
                    const documentTypesEntry =
                      area.id === "administration" && group.label === "Lookups" && itemId === "documentTypes";
                    const usersEntry = area.id === "administration" && group.label === "General" && itemId === "users";
                    const appealsEntry = group.label === "Assessments" && itemId === "appeals";
                    const sgabAppealsEntry = itemId === "sgabAppeals";
                    const accountsEntry = itemId === "accounts";
                    const contactsEntry = itemId === "contacts";
                    const informationRequestsEntry = itemId === "informationRequests";
                    const investigationsEntry = itemId === "complianceInvestigations";
                    const feesEntry = itemId === "fees";
                    const Icon = item.Icon;
                    const onClick = entry
                      ? () => onNavigateApplications?.()
                      : documentTypesEntry
                        ? () => onNavigateDocumentTypes?.()
                        : usersEntry
                          ? () => onNavigateUsers?.()
                          : appealsEntry
                            ? () => onNavigateAppeals?.()
                            : sgabAppealsEntry
                              ? () => onNavigateSgabAppeals?.()
                              : accountsEntry
                                ? () => onNavigateAccounts?.()
                                : contactsEntry
                                  ? () => onNavigateContacts?.()
                                  : informationRequestsEntry
                                    ? () => onNavigateInformationRequests?.()
                                    : investigationsEntry
                                      ? () => onNavigateInvestigations?.()
                                      : feesEntry
                                        ? () => onNavigateFees?.()
                                        : undefined;
                    const itemClass = entry
                      ? navItemClass("applications")
                      : documentTypesEntry
                        ? navItemClass("documentTypes")
                        : usersEntry
                          ? navItemClass("users")
                          : appealsEntry
                            ? navItemClass("appeals")
                            : sgabAppealsEntry
                              ? navItemClass("sgabAppeals")
                              : accountsEntry
                                ? navItemClass("accounts")
                                : contactsEntry
                                  ? navItemClass("contacts")
                                  : informationRequestsEntry
                                    ? navItemClass("informationRequests")
                                    : investigationsEntry
                                      ? navItemClass("complianceInvestigations")
                                      : feesEntry
                                        ? navItemClass("fees")
                                        : "dynamics-sitemap__item";
                    return (
                      <li key={itemId}>
                        <button
                          type="button"
                          className={itemClass}
                          onClick={onClick}
                          title={item.label}
                        >
                          <Icon className="dynamics-sitemap__icon" />
                          <span className="dynamics-sitemap__label">{item.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
          <AreaSwitcher areas={areas} areaId={area.id} onSelectArea={onSelectArea} collapsed={sitemapCollapsed} />
        </nav>

        {children}
      </div>
    </div>
  );
}
