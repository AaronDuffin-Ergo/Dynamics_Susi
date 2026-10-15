import { useCallback, useMemo, useState } from "react";
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
} from "@fluentui/react-components";
import {
  AddRegular,
  ArrowClockwiseRegular,
  ArrowExportRegular,
  ChevronDownRegular,
  ColumnTripleEditRegular,
  DataBarVerticalRegular,
  DocumentBulletListRegular,
  FilterRegular,
  FlowRegular,
  LinkRegular,
  PersonAddRegular,
  SearchRegular,
  ShareRegular,
} from "@fluentui/react-icons";
import {
  DynamicsViewTitlePicker,
  dynamicsListDateFmt as dateFmt,
  useFillResizableColumnSizing,
} from "./dynamicsListViewHelpers.jsx";
import GridColumnEditToolbar from "./layoutCustomization/GridColumnEditToolbar.jsx";
import GridHeaderDnD from "./layoutCustomization/GridHeaderDnD.jsx";
import { useLayoutCustomization } from "./layoutCustomization/LayoutCustomizationContext.jsx";
import { APPLICATION_DETAIL_FIELDS } from "./layoutCustomization/detailFieldConfigs.jsx";
import useCustomizableGridColumns from "./layoutCustomization/useCustomizableGridColumns.jsx";
import DynamicsAppShell from "./shell/DynamicsAppShell.jsx";
import "./StudentsGrid.css";

const APPLICATION_DETAIL_FIELD_IDS = APPLICATION_DETAIL_FIELDS.map((f) => f.id);

const APPLICATION_COLUMN_IDS = [
  "applicationNumber",
  "contactName",
  "schemeName",
  "applicationType",
  "status",
  "externalStatus",
  "submittedOn",
];

const APPLICATION_VIEWS = [
  { id: "active", label: "Active Applications", isDefault: true, filter: () => true },
  { id: "draft", label: "Draft Applications", isDefault: false, filter: (a) => a.status === "Draft" },
  {
    id: "awaiting",
    label: "Awaiting Documents",
    isDefault: false,
    filter: (a) => a.status === "Awaiting Documents",
  },
  { id: "review", label: "In Review", isDefault: false, filter: (a) => a.status === "In Review" },
  {
    id: "decided",
    label: "Decisions Issued",
    isDefault: false,
    filter: (a) => a.status === "Decision Issued",
  },
];

function textCell(value) {
  const text = value || "—";
  return (
    <TableCellLayout truncate title={text}>
      {text}
    </TableCellLayout>
  );
}

export default function ApplicationsGrid({
  applications,
  onOpenApplication,
  onNavigateHome,
  sitemapCollapsed = false,
  onToggleSitemap,
}) {
  const [filter, setFilter] = useState("");
  const [sortState, setSortState] = useState({
    sortColumn: "submittedOn",
    sortDirection: "descending",
  });
  const [selectedRows, setSelectedRows] = useState(() => new Set());
  const [selectedViewId, setSelectedViewId] = useState(APPLICATION_VIEWS[0].id);

  const onMockCommand = useCallback(() => {
    /* No-op until wired to create/delete/refresh APIs */
  }, []);

  const handleColumnSort = useCallback((columnId, direction) => {
    setSortState({ sortColumn: columnId, sortDirection: direction });
  }, []);

  const filteredItems = useMemo(() => {
    const view = APPLICATION_VIEWS.find((v) => v.id === selectedViewId) ?? APPLICATION_VIEWS[0];
    const q = filter.trim().toLowerCase();
    return applications.filter(view.filter).filter((row) => {
      if (!q) return true;
      return [
        row.applicationNumber,
        row.contactName,
        row.schemeName,
        row.applicationType,
        row.status,
        row.externalStatus,
        row.course,
        row.institution,
        row.submittedOn ? dateFmt.format(row.submittedOn) : "",
      ].some((v) => String(v).toLowerCase().includes(q));
    });
  }, [filter, applications, selectedViewId]);

  const { toggleEditMode, gridEditMode } = useLayoutCustomization();

  const columnDefs = useMemo(
    () => ({
      applicationNumber: {
        label: "Application Number",
        compare: (a, b) => a.applicationNumber.localeCompare(b.applicationNumber),
        renderCell: (item) => (
          <button
            type="button"
            className="dynamics-grid-link"
            onClick={(e) => {
              e.stopPropagation();
              onOpenApplication?.(item.applicationNumber);
            }}
            aria-label={`Open application ${item.applicationNumber}`}
          >
            {item.applicationNumber}
          </button>
        ),
      },
      contactName: {
        label: "Contact",
        compare: (a, b) => a.contactName.localeCompare(b.contactName),
        renderCell: (item) => textCell(item.contactName),
      },
      schemeName: {
        label: "Scheme",
        compare: (a, b) => a.schemeName.localeCompare(b.schemeName),
        renderCell: (item) => textCell(item.schemeName),
      },
      applicationType: {
        label: "Application Type",
        compare: (a, b) => a.applicationType.localeCompare(b.applicationType),
        renderCell: (item) => textCell(item.applicationType),
      },
      status: {
        label: "Application Status",
        compare: (a, b) => a.status.localeCompare(b.status),
        renderCell: (item) => textCell(item.status),
      },
      externalStatus: {
        label: "External Status",
        compare: (a, b) => a.externalStatus.localeCompare(b.externalStatus),
        renderCell: (item) => textCell(item.externalStatus),
      },
      submittedOn: {
        label: "Submitted On",
        compare: (a, b) => (a.submittedOn?.getTime() ?? 0) - (b.submittedOn?.getTime() ?? 0),
        renderCell: (item) => (item.submittedOn ? dateFmt.format(item.submittedOn) : "—"),
      },
    }),
    [onOpenApplication],
  );

  const {
    columns,
    visibleColumnIds,
    addableColumns,
    handleColumnDragEnd,
    handleAddColumn,
    handleResetGridLayout,
  } = useCustomizableGridColumns({
    entityKey: "application",
    defaultColumnIds: APPLICATION_COLUMN_IDS,
    detailFieldIds: APPLICATION_DETAIL_FIELD_IDS,
    columnDefs,
    sortState,
    onSort: handleColumnSort,
    onMockCommand,
  });

  const { scrollRef, columnSizingOptions, onColumnResize, resizableColumnsOptions } =
    useFillResizableColumnSizing(visibleColumnIds);

  return (
    <DynamicsAppShell
      activeNav="applications"
      onNavigateHome={onNavigateHome}
      sitemapCollapsed={sitemapCollapsed}
      onToggleSitemap={onToggleSitemap}
    >
      <main className="dynamics-main">
        <div className="dynamics-main-surface">
          <div className="dynamics-surface-card dynamics-surface-card--command">
            <div className="dynamics-commandbar" role="toolbar" aria-label="Commands">
              <div className="dynamics-commandbar__scroll">
                <Button appearance="subtle" type="button" onClick={onMockCommand} title="Preview only — chart view">
                  <span className="dynamics-cmd-btn__inner">
                    <DataBarVerticalRegular className="dynamics-cmd-btn__icon" />
                    <span>Show Chart</span>
                  </span>
                </Button>
                <Button
                  appearance="subtle"
                  type="button"
                  disabled
                  title="Applications are created when an applicant first saves the portal form"
                >
                  <span className="dynamics-cmd-btn__inner">
                    <AddRegular className="dynamics-cmd-btn__icon" />
                    <span>New</span>
                  </span>
                </Button>
                <Button appearance="subtle" type="button" onClick={onMockCommand} title="Preview only — refresh list">
                  <span className="dynamics-cmd-btn__inner">
                    <ArrowClockwiseRegular className="dynamics-cmd-btn__icon" />
                    <span>Refresh</span>
                  </span>
                </Button>
                <Button appearance="subtle" type="button" onClick={onMockCommand} title="Preview only — assign">
                  <span className="dynamics-cmd-btn__inner">
                    <PersonAddRegular className="dynamics-cmd-btn__icon" />
                    <span>Assign</span>
                  </span>
                </Button>
                <Button appearance="subtle" type="button" onClick={onMockCommand} title="Preview only — email link">
                  <span className="dynamics-cmd-btn__inner">
                    <LinkRegular className="dynamics-cmd-btn__icon" />
                    <span>Email a Link</span>
                  </span>
                </Button>
                <Button appearance="subtle" type="button" onClick={onMockCommand} title="Preview only — Power Automate">
                  <span className="dynamics-cmd-btn__inner">
                    <FlowRegular className="dynamics-cmd-btn__icon" />
                    <span>Flow</span>
                    <ChevronDownRegular className="dynamics-cmd-btn__chevron" aria-hidden="true" />
                  </span>
                </Button>
                <Button appearance="subtle" type="button" onClick={onMockCommand} title="Preview only — reporting">
                  <span className="dynamics-cmd-btn__inner">
                    <DocumentBulletListRegular className="dynamics-cmd-btn__icon" />
                    <span>Run Report</span>
                    <ChevronDownRegular className="dynamics-cmd-btn__chevron" aria-hidden="true" />
                  </span>
                </Button>
                <Button appearance="subtle" type="button" onClick={onMockCommand} title="Preview only — export">
                  <span className="dynamics-cmd-btn__inner">
                    <ArrowExportRegular className="dynamics-cmd-btn__icon" />
                    <span>Export to Excel</span>
                    <ChevronDownRegular className="dynamics-cmd-btn__chevron" aria-hidden="true" />
                  </span>
                </Button>
              </div>
              <div className="dynamics-commandbar__right">
                <Button appearance="subtle" type="button" onClick={onMockCommand} title="Preview only — sharing">
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
            <section className="dynamics-view" aria-label="Applications view">
              <div className="dynamics-view-toolbar">
                <div className="dynamics-view-toolbar__title-wrap">
                  <DynamicsViewTitlePicker
                    views={APPLICATION_VIEWS}
                    selectedViewId={selectedViewId}
                    onSelectViewId={(id) => {
                      setSelectedViewId(id);
                      setSelectedRows(new Set());
                    }}
                    onManageViews={onMockCommand}
                  />
                </div>
                <div className="dynamics-view-toolbar__controls">
                  <button
                    type="button"
                    className={`dynamics-view-toolbar__link dynamics-view-toolbar__link--icon${gridEditMode ? " dynamics-view-toolbar__link--active" : ""}`}
                    onClick={toggleEditMode}
                    aria-pressed={gridEditMode}
                  >
                    <ColumnTripleEditRegular className="dynamics-view-toolbar__link-icon" aria-hidden="true" />
                    {gridEditMode ? "Done editing columns" : "Edit columns"}
                  </button>
                  <button type="button" className="dynamics-view-toolbar__link dynamics-view-toolbar__link--icon">
                    <FilterRegular className="dynamics-view-toolbar__link-icon" aria-hidden="true" />
                    Edit filters
                  </button>
                  <Input
                    className="dynamics-keyword-search"
                    placeholder="Filter by keyword"
                    value={filter}
                    onChange={(_, d) => setFilter(d.value)}
                    contentBefore={<SearchRegular className="dynamics-keyword-search__icon" aria-hidden />}
                    aria-label="Filter by keyword"
                  />
                </div>
              </div>

              <div className="dynamics-grid-card">
                {gridEditMode ? (
                  <GridColumnEditToolbar
                    addableColumns={addableColumns}
                    onAddColumn={handleAddColumn}
                    onReset={handleResetGridLayout}
                  />
                ) : null}
                <div ref={scrollRef} className="dynamics-grid-scroll dynamics-grid-scroll--list">
                  <div className="dynamics-grid-scroll__inner">
                    <DataGrid
                      items={filteredItems}
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
                      getRowId={(item) => item.applicationNumber}
                      focusMode="composite"
                      aria-label="Applications — sortable, resizable columns"
                    >
                      <DataGridHeader>
                        <GridHeaderDnD
                          gridEditMode={gridEditMode}
                          sortableIds={visibleColumnIds}
                          onDragEnd={handleColumnDragEnd}
                        >
                          <DataGridRow selectionCell={{ "aria-label": "Select all rows" }}>
                            {({ renderHeaderCell }) => (
                              <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                            )}
                          </DataGridRow>
                        </GridHeaderDnD>
                      </DataGridHeader>
                      <DataGridBody>
                        {({ item, rowId }) => (
                          <DataGridRow
                            key={rowId}
                            selectionCell={{ "aria-label": "Select row" }}
                            onDoubleClick={(e) => {
                              e.preventDefault();
                              onOpenApplication?.(item.applicationNumber);
                            }}
                          >
                            {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                          </DataGridRow>
                        )}
                      </DataGridBody>
                    </DataGrid>
                    {filteredItems.length === 0 ? (
                      <p className="dynamics-grid-empty dynamics-grid-empty--block">
                        {filter.trim()
                          ? `No applications match "${filter.trim()}".`
                          : "No applications in this view."}
                      </p>
                    ) : null}
                    <footer className="dynamics-grid-footer">
                      <span className="dynamics-grid-footer__count">Rows: {filteredItems.length}</span>
                      {selectedRows.size > 0 ? (
                        <>
                          <span className="dynamics-grid-footer__divider" aria-hidden="true">
                            |
                          </span>
                          <span className="dynamics-grid-footer__count">{selectedRows.size} selected</span>
                        </>
                      ) : null}
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
