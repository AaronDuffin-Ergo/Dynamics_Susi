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
import { DOCUMENT_TYPES } from "./mockDocumentTypes.js";
import DynamicsAppShell from "./shell/DynamicsAppShell.jsx";
import "./StudentsGrid.css";

const VIEWS = [{ id: "active", label: "Active Document Types", isDefault: true }];

const COLUMN_IDS = ["name", "description", "applicantInstructions", "predefinedFormLink", "filenamePrefix"];

function textCell(value) {
  const text = value || "—";
  return (
    <TableCellLayout truncate title={text}>
      {text}
    </TableCellLayout>
  );
}

const COLUMNS = [
  createTableColumn({
    columnId: "name",
    compare: (a, b) => a.name.localeCompare(b.name),
    renderHeaderCell: () => "Document Type Name",
    renderCell: (item) => (
      <TableCellLayout truncate title={item.name}>
        <button type="button" className="dynamics-grid-link">
          {item.name}
        </button>
      </TableCellLayout>
    ),
  }),
  createTableColumn({
    columnId: "description",
    compare: (a, b) => a.description.localeCompare(b.description),
    renderHeaderCell: () => "Description",
    renderCell: (item) => textCell(item.description),
  }),
  createTableColumn({
    columnId: "applicantInstructions",
    compare: (a, b) => a.applicantInstructions.localeCompare(b.applicantInstructions),
    renderHeaderCell: () => "Upload Instructions",
    renderCell: (item) => textCell(item.applicantInstructions),
  }),
  createTableColumn({
    columnId: "predefinedFormLink",
    compare: (a, b) => (a.predefinedFormLink || "").localeCompare(b.predefinedFormLink || ""),
    renderHeaderCell: () => "Predefined Form Link",
    renderCell: (item) =>
      item.predefinedFormLink ? (
        <TableCellLayout truncate title={item.predefinedFormLink}>
          <a className="dynamics-grid-link" href={item.predefinedFormLink} target="_blank" rel="noreferrer">
            {item.predefinedFormLink}
          </a>
        </TableCellLayout>
      ) : (
        textCell("")
      ),
  }),
  createTableColumn({
    columnId: "filenamePrefix",
    compare: (a, b) => a.filenamePrefix.localeCompare(b.filenamePrefix),
    renderHeaderCell: () => "Document Filename Prefix",
    renderCell: (item) => textCell(item.filenamePrefix),
  }),
];

export default function DocumentTypesGrid({ onNavigateHome, sitemapCollapsed = false, onToggleSitemap }) {
  const [filter, setFilter] = useState("");
  const [sortState, setSortState] = useState({ sortColumn: "name", sortDirection: "ascending" });
  const [selectedRows, setSelectedRows] = useState(() => new Set());
  const { scrollRef, columnSizingOptions, onColumnResize, resizableColumnsOptions } =
    useFillResizableColumnSizing(COLUMN_IDS);

  const items = useMemo(() => {
    const query = filter.trim().toLowerCase();
    if (!query) return DOCUMENT_TYPES;
    return DOCUMENT_TYPES.filter((type) =>
      [type.name, type.description, type.applicantInstructions, type.predefinedFormLink, type.filenamePrefix].some(
        (value) => String(value || "").toLowerCase().includes(query),
      ),
    );
  }, [filter]);

  const noop = () => {};

  return (
    <DynamicsAppShell
      activeNav="documentTypes"
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
            <section className="dynamics-view" aria-label="Document types view">
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
                      columns={COLUMNS}
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
                      getRowId={(item) => item.id}
                      focusMode="composite"
                      aria-label="Document types"
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
                      <p className="dynamics-grid-empty dynamics-grid-empty--block">
                        No document types match "{filter.trim()}".
                      </p>
                    ) : null}
                    <footer className="dynamics-grid-footer">
                      <span className="dynamics-grid-footer__count">Rows: {items.length}</span>
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
