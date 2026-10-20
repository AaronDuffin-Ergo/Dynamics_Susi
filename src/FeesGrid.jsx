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
  ArrowClockwiseRegular,
  ArrowLeftRegular,
  FilterRegular,
  SearchRegular,
} from "@fluentui/react-icons";
import { DynamicsViewTitlePicker, useFillResizableColumnSizing } from "./dynamicsListViewHelpers.jsx";
import DynamicsAppShell from "./shell/DynamicsAppShell.jsx";
import "./StudentsGrid.css";

const VIEWS = [{ id: "active", label: "Active Fees", isDefault: true }];
const COLUMN_IDS = ["feeNumber", "academicYear", "schemeName", "status"];

function textCell(value) {
  const text = value || "—";
  return (
    <TableCellLayout truncate title={text}>
      {text}
    </TableCellLayout>
  );
}

export default function FeesGrid({ fees, onOpenFee, onNavigateHome, sitemapCollapsed = false, onToggleSitemap }) {
  const [filter, setFilter] = useState("");
  const [sortState, setSortState] = useState({ sortColumn: "feeNumber", sortDirection: "ascending" });
  const [selectedRows, setSelectedRows] = useState(() => new Set());
  const { scrollRef, columnSizingOptions, onColumnResize, resizableColumnsOptions } = useFillResizableColumnSizing(COLUMN_IDS);

  const items = useMemo(() => {
    const query = filter.trim().toLowerCase();
    if (!query) return fees;
    return fees.filter((fee) =>
      [fee.feeNumber, fee.academicYear, fee.schemeName, fee.status].some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [fees, filter]);

  const columns = useMemo(
    () => [
      createTableColumn({
        columnId: "feeNumber",
        compare: (a, b) => a.feeNumber.localeCompare(b.feeNumber),
        renderHeaderCell: () => "Fee Number",
        renderCell: (item) => (
          <TableCellLayout truncate title={item.feeNumber}>
            <button type="button" className="dynamics-grid-link" onClick={() => onOpenFee?.(item.feeNumber)}>
              {item.feeNumber}
            </button>
          </TableCellLayout>
        ),
      }),
      createTableColumn({
        columnId: "academicYear",
        compare: (a, b) => a.academicYear.localeCompare(b.academicYear),
        renderHeaderCell: () => "Academic Year",
        renderCell: (item) => textCell(item.academicYear),
      }),
      createTableColumn({
        columnId: "schemeName",
        compare: (a, b) => a.schemeName.localeCompare(b.schemeName),
        renderHeaderCell: () => "Scheme",
        renderCell: (item) => textCell(item.schemeName),
      }),
      createTableColumn({
        columnId: "status",
        compare: (a, b) => a.status.localeCompare(b.status),
        renderHeaderCell: () => "Status",
        renderCell: (item) => textCell(item.status),
      }),
    ],
    [onOpenFee],
  );

  return (
    <DynamicsAppShell activeNav="fees" onNavigateHome={onNavigateHome} sitemapCollapsed={sitemapCollapsed} onToggleSitemap={onToggleSitemap}>
      <main className="dynamics-main">
        <div className="dynamics-main-surface">
          <div className="dynamics-surface-card dynamics-surface-card--command">
            <div className="dynamics-commandbar" role="toolbar" aria-label="Commands">
              <div className="dynamics-commandbar__scroll">
                <Button appearance="subtle" type="button" icon={<ArrowLeftRegular />} aria-label="Back" disabled />
                <Button appearance="subtle" type="button" disabled>
                  <span className="dynamics-cmd-btn__inner">
                    <ArrowClockwiseRegular className="dynamics-cmd-btn__icon" />
                    <span>Refresh All</span>
                  </span>
                </Button>
              </div>
            </div>
          </div>
          <div className="dynamics-surface-card dynamics-surface-card--view">
            <section className="dynamics-view" aria-label="Fees view">
              <div className="dynamics-view-toolbar">
                <div className="dynamics-view-toolbar__title-wrap">
                  <DynamicsViewTitlePicker views={VIEWS} selectedViewId="active" onSelectViewId={() => {}} onManageViews={() => {}} />
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
                      getRowId={(item) => item.feeNumber}
                      focusMode="composite"
                      aria-label="Fees"
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
