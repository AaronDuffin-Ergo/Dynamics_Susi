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

const VIEWS = [{ id: "active", label: "Active Compliance Investigations", isDefault: true }];
const COLUMN_IDS = ["investigationNumber", "investigationType", "requestingOrganisation", "relatedApplicant", "status", "dueDate", "approvalStatus"];

const dateOnly = new Intl.DateTimeFormat(undefined, {
  month: "numeric",
  day: "numeric",
  year: "numeric",
});

function textCell(value) {
  const text = value === undefined || value === null || value === "" ? "—" : String(value);
  return (
    <TableCellLayout truncate title={text}>
      {text}
    </TableCellLayout>
  );
}

export default function InvestigationsGrid({
  investigations,
  onOpenInvestigation,
  onNavigateHome,
  sitemapCollapsed = false,
  onToggleSitemap,
}) {
  const [filter, setFilter] = useState("");
  const [sortState, setSortState] = useState({ sortColumn: "investigationNumber", sortDirection: "ascending" });
  const [selectedRows, setSelectedRows] = useState(() => new Set());
  const { scrollRef, columnSizingOptions, onColumnResize, resizableColumnsOptions } =
    useFillResizableColumnSizing(COLUMN_IDS);

  const items = useMemo(() => {
    const query = filter.trim().toLowerCase();
    if (!query) return investigations;
    return investigations.filter((item) =>
      [item.investigationNumber, item.investigationType, item.requestingOrganisation, item.relatedApplicant, item.status, item.approvalStatus]
        .some((value) => String(value ?? "").toLowerCase().includes(query)),
    );
  }, [filter, investigations]);

  const columns = useMemo(
    () => [
      createTableColumn({
        columnId: "investigationNumber",
        compare: (a, b) => a.investigationNumber.localeCompare(b.investigationNumber),
        renderHeaderCell: () => "Investigation Number",
        renderCell: (item) => (
          <button
            type="button"
            className="dynamics-grid-link"
            onClick={(event) => {
              event.stopPropagation();
              onOpenInvestigation?.(item.investigationNumber);
            }}
          >
            {item.investigationNumber}
          </button>
        ),
      }),
      createTableColumn({
        columnId: "investigationType",
        compare: (a, b) => a.investigationType.localeCompare(b.investigationType),
        renderHeaderCell: () => "Investigation Type",
        renderCell: (item) => textCell(item.investigationType),
      }),
      createTableColumn({
        columnId: "requestingOrganisation",
        compare: (a, b) => a.requestingOrganisation.localeCompare(b.requestingOrganisation),
        renderHeaderCell: () => "Requesting Organisation",
        renderCell: (item) => textCell(item.requestingOrganisation),
      }),
      createTableColumn({
        columnId: "relatedApplicant",
        compare: (a, b) => a.relatedApplicant.localeCompare(b.relatedApplicant),
        renderHeaderCell: () => "Related Applicant",
        renderCell: (item) => textCell(item.relatedApplicant),
      }),
      createTableColumn({
        columnId: "status",
        compare: (a, b) => a.status.localeCompare(b.status),
        renderHeaderCell: () => "Status",
        renderCell: (item) => textCell(item.status),
      }),
      createTableColumn({
        columnId: "dueDate",
        compare: (a, b) => a.dueDate - b.dueDate,
        renderHeaderCell: () => "Due Date",
        renderCell: (item) => textCell(dateOnly.format(item.dueDate)),
      }),
      createTableColumn({
        columnId: "approvalStatus",
        compare: (a, b) => a.approvalStatus.localeCompare(b.approvalStatus),
        renderHeaderCell: () => "Approval Status",
        renderCell: (item) => textCell(item.approvalStatus),
      }),
    ],
    [onOpenInvestigation],
  );

  const noop = () => {};

  return (
    <DynamicsAppShell
      activeNav="complianceInvestigations"
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
            <section className="dynamics-view" aria-label="Compliance investigations view">
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
                      getRowId={(item) => item.investigationNumber}
                      focusMode="composite"
                      aria-label="Compliance Investigations"
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
                      <p className="dynamics-grid-empty dynamics-grid-empty--block">No investigations match "{filter.trim()}".</p>
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
