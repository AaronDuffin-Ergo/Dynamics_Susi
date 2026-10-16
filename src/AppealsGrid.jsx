import { useMemo, useState } from "react";
import {
  Button,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  Input,
  TableCellLayout,
  createTableColumn,
} from "@fluentui/react-components";
import {
  AddRegular,
  ArrowClockwiseRegular,
  ArrowLeftRegular,
  CheckmarkRegular,
  ChevronDownRegular,
  FilterRegular,
  SaveRegular,
  SearchRegular,
  ShareRegular,
} from "@fluentui/react-icons";
import { DynamicsViewTitlePicker, useFillResizableColumnSizing } from "./dynamicsListViewHelpers.jsx";
import DynamicsAppShell from "./shell/DynamicsAppShell.jsx";
import "./StudentsGrid.css";

const VIEWS = [{ id: "active", label: "Active Appeals", isDefault: true }];
const COLUMN_IDS = ["appealNumber", "contactName", "applicationNumber", "appealType", "status", "originalDecision", "submittedOn"];

const dateTime = new Intl.DateTimeFormat(undefined, {
  month: "numeric",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function textCell(value) {
  const text = value === undefined || value === null || value === "" ? "—" : String(value);
  return (
    <TableCellLayout truncate title={text}>
      {text}
    </TableCellLayout>
  );
}

export default function AppealsGrid({ appeals, onOpenAppeal, onNavigateHome, sitemapCollapsed = false, onToggleSitemap }) {
  const [filter, setFilter] = useState("");
  const [sortState, setSortState] = useState({ sortColumn: "appealNumber", sortDirection: "ascending" });
  const [selectedRows, setSelectedRows] = useState(() => new Set());
  const { scrollRef, columnSizingOptions, onColumnResize, resizableColumnsOptions } =
    useFillResizableColumnSizing(COLUMN_IDS);

  const items = useMemo(() => {
    const query = filter.trim().toLowerCase();
    if (!query) return appeals;
    return appeals.filter((appeal) =>
      [appeal.appealNumber, appeal.contactName, appeal.applicationNumber, appeal.appealType, appeal.status, appeal.originalDecision]
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [appeals, filter]);

  const columns = useMemo(
    () => [
      createTableColumn({
        columnId: "appealNumber",
        compare: (a, b) => a.appealNumber.localeCompare(b.appealNumber),
        renderHeaderCell: () => "Appeal Number",
        renderCell: (item) => (
          <button
            type="button"
            className="dynamics-grid-link"
            onClick={(event) => {
              event.stopPropagation();
              onOpenAppeal?.(item.appealNumber);
            }}
          >
            {item.appealNumber}
          </button>
        ),
      }),
      createTableColumn({
        columnId: "contactName",
        compare: (a, b) => a.contactName.localeCompare(b.contactName),
        renderHeaderCell: () => "Contact",
        renderCell: (item) => textCell(item.contactName),
      }),
      createTableColumn({
        columnId: "applicationNumber",
        compare: (a, b) => a.applicationNumber.localeCompare(b.applicationNumber),
        renderHeaderCell: () => "Application",
        renderCell: (item) => textCell(item.applicationNumber),
      }),
      createTableColumn({
        columnId: "appealType",
        compare: (a, b) => a.appealType.localeCompare(b.appealType),
        renderHeaderCell: () => "Appeal Type",
        renderCell: (item) => textCell(item.appealType),
      }),
      createTableColumn({
        columnId: "status",
        compare: (a, b) => a.status.localeCompare(b.status),
        renderHeaderCell: () => "Status",
        renderCell: (item) => textCell(item.status),
      }),
      createTableColumn({
        columnId: "originalDecision",
        compare: (a, b) => a.originalDecision.localeCompare(b.originalDecision),
        renderHeaderCell: () => "Original Decision",
        renderCell: (item) => textCell(item.originalDecision),
      }),
      createTableColumn({
        columnId: "submittedOn",
        compare: (a, b) => a.submittedOn - b.submittedOn,
        renderHeaderCell: () => "Submitted On",
        renderCell: (item) => textCell(item.submittedOn ? dateTime.format(item.submittedOn) : ""),
      }),
    ],
    [onOpenAppeal],
  );

  const noop = () => {};

  return (
    <DynamicsAppShell
      activeNav="appeals"
      onNavigateHome={onNavigateHome}
      sitemapCollapsed={sitemapCollapsed}
      onToggleSitemap={onToggleSitemap}
    >
      <main className="dynamics-main">
        <div className="dynamics-main-surface">
          <div className="dynamics-surface-card dynamics-surface-card--command">
            <div className="dynamics-commandbar" role="toolbar" aria-label="Commands">
              <div className="dynamics-commandbar__scroll">
                <Button appearance="subtle" type="button" icon={<ArrowLeftRegular />} aria-label="Back" onClick={noop} />
                <Button appearance="subtle" type="button" onClick={noop}>
                  <span className="dynamics-cmd-btn__inner">
                    <SaveRegular className="dynamics-cmd-btn__icon" />
                    <span>Save As</span>
                  </span>
                </Button>
                <Button appearance="subtle" type="button" onClick={noop}>
                  <span className="dynamics-cmd-btn__inner">
                    <AddRegular className="dynamics-cmd-btn__icon dynamics-cmd-btn__icon--add" />
                    <span>New</span>
                    <ChevronDownRegular className="dynamics-cmd-btn__chevron" aria-hidden="true" />
                  </span>
                </Button>
                <Button appearance="subtle" type="button" onClick={noop}>
                  <span className="dynamics-cmd-btn__inner">
                    <CheckmarkRegular className="dynamics-cmd-btn__icon" />
                    <span>Set As Default</span>
                  </span>
                </Button>
                <Button
                  appearance="subtle"
                  type="button"
                  onClick={() => {
                    setFilter("");
                    setSelectedRows(new Set());
                  }}
                >
                  <span className="dynamics-cmd-btn__inner">
                    <ArrowClockwiseRegular className="dynamics-cmd-btn__icon" />
                    <span>Refresh All</span>
                  </span>
                </Button>
              </div>
              <div className="dynamics-commandbar__right">
                <Button appearance="subtle" type="button" onClick={noop}>
                  <span className="dynamics-cmd-btn__inner">
                    <ShareRegular className="dynamics-cmd-btn__icon" />
                    <span>Share</span>
                    <ChevronDownRegular className="dynamics-cmd-btn__chevron" aria-hidden="true" />
                  </span>
                </Button>
              </div>
            </div>
          </div>

          <div className="dynamics-surface-card dynamics-surface-card--view">
            <section className="dynamics-view" aria-label="Appeals view">
              <div className="dynamics-view-toolbar">
                <div className="dynamics-view-toolbar__title-wrap">
                  <DynamicsViewTitlePicker views={VIEWS} selectedViewId="active" onSelectViewId={noop} onManageViews={noop} />
                </div>
                <div className="dynamics-view-toolbar__controls">
                  <button type="button" className="dynamics-view-toolbar__link dynamics-view-toolbar__link--icon">
                    <FilterRegular className="dynamics-view-toolbar__link-icon" aria-hidden="true" />
                    Edit filters
                  </button>
                  <Input
                    className="dynamics-keyword-search"
                    placeholder="Filter by keyword"
                    value={filter}
                    onChange={(_, data) => setFilter(data.value)}
                    contentBefore={<SearchRegular className="dynamics-keyword-search__icon" aria-hidden />}
                    aria-label="Filter by keyword"
                  />
                </div>
              </div>
              <div className="dynamics-grid-card">
                <div ref={scrollRef} className="dynamics-grid-scroll dynamics-grid-scroll--list">
                  <div className="dynamics-grid-scroll__inner">
                    <DataGrid
                      items={items}
                      columns={columns}
                      sortable
                      sortState={sortState}
                      onSortChange={(_, next) => setSortState(next)}
                      resizableColumns
                      columnSizingOptions={columnSizingOptions}
                      onColumnResize={onColumnResize}
                      resizableColumnsOptions={resizableColumnsOptions}
                      selectionMode="multiselect"
                      selectionAppearance="neutral"
                      subtleSelection
                      selectedItems={selectedRows}
                      onSelectionChange={(_, data) => setSelectedRows(data.selectedItems)}
                      size="small"
                      getRowId={(item) => item.appealNumber}
                      focusMode="composite"
                      aria-label="Appeals"
                    >
                      <DataGridHeader>
                        <DataGridRow selectionCell={{ "aria-label": "Select all rows" }}>
                          {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
                        </DataGridRow>
                      </DataGridHeader>
                      <DataGridBody>
                        {({ item, rowId }) => (
                          <DataGridRow key={rowId} selectionCell={{ "aria-label": "Select row" }}>
                            {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                          </DataGridRow>
                        )}
                      </DataGridBody>
                    </DataGrid>
                    {items.length === 0 ? (
                      <p className="dynamics-grid-empty dynamics-grid-empty--block">No appeals match "{filter.trim()}".</p>
                    ) : null}
                    <footer className="dynamics-grid-footer">
                      <span className="dynamics-grid-footer__count">Rows: {items.length}</span>
                    </footer>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </DynamicsAppShell>
  );
}
