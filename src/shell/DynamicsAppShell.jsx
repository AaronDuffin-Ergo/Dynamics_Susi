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
import { SITEMAP_AREAS, sitemapItem } from "./sitemapAreas.js";
import { useShellNavigation } from "./ShellNavigationContext.jsx";

function AreaTile({ area }) {
  return (
    <span className="dynamics-area-tile" style={{ background: area.color }} aria-hidden="true">
      {area.label.slice(0, 1)}
    </span>
  );
}

function AreaSwitcher({ areaId, onSelectArea, collapsed }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const current = SITEMAP_AREAS.find((area) => area.id === areaId) ?? SITEMAP_AREAS[0];

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
          {SITEMAP_AREAS.map((area) => {
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
  const { onNavigateApplications, onNavigateDocumentTypes, onNavigateUsers, areaId = "applications", onSelectArea } =
    useShellNavigation();
  const area = SITEMAP_AREAS.find((item) => item.id === areaId) ?? SITEMAP_AREAS[0];
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
          <button type="button" className="dynamics-app-header__logo" aria-label="App launcher">
            <PowerAppsAppLauncherIcon />
          </button>
          <span className="dynamics-app-header__product">Power Apps</span>
          <span className="dynamics-app-header__pipe" aria-hidden="true">
            |
          </span>
          <span className="dynamics-app-header__app">My SUSI</span>
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
                <p className="mda-sitemap__group-label">{group.label}</p>
                <ul className="dynamics-sitemap__list dynamics-sitemap__list--section">
                  {group.items.map((itemId) => {
                    const item = sitemapItem(itemId);
                    const entry = isApplicationsEntry(group.label, itemId);
                    const documentTypesEntry =
                      area.id === "administration" && group.label === "Lookups" && itemId === "documentTypes";
                    const usersEntry = area.id === "administration" && group.label === "General" && itemId === "users";
                    const Icon = item.Icon;
                    const onClick = entry
                      ? () => onNavigateApplications?.()
                      : documentTypesEntry
                        ? () => onNavigateDocumentTypes?.()
                        : usersEntry
                          ? () => onNavigateUsers?.()
                          : undefined;
                    const itemClass = entry
                      ? navItemClass("applications")
                      : documentTypesEntry
                        ? navItemClass("documentTypes")
                        : usersEntry
                          ? navItemClass("users")
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
          <AreaSwitcher areaId={area.id} onSelectArea={onSelectArea} collapsed={sitemapCollapsed} />
        </nav>

        {children}
      </div>
    </div>
  );
}
