import { useMemo, useState } from "react";
import { Button, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger } from "@fluentui/react-components";
import {
  AddRegular,
  ArrowClockwiseRegular,
  ChevronDownRegular,
  FlowRegular,
  PersonAddRegular,
} from "@fluentui/react-icons";
import { relatedApplicationsFor } from "./mockRelatedApplications.js";

const dateFmt = new Intl.DateTimeFormat(undefined, {
  month: "numeric",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const COLUMNS = [
  { id: "relatedApplication", label: "Related Application", required: true },
  { id: "relationshipType", label: "Relationship Type", required: true },
  { id: "relatedPerson", label: "Related Person", required: true },
  { id: "sharedEvidenceApplicable", label: "Shared Evidence Applicable" },
  { id: "sharedEvidenceStatus", label: "Shared Evidence Status", required: true },
  { id: "linkReason", label: "Link Reason" },
  { id: "status", label: "Status", required: true },
  { id: "createdOn", label: "Created On" },
];

function cellValue(row, columnId) {
  if (columnId === "relatedApplication") {
    return `${row.relatedApplicationNumber} ${row.relatedApplicationContact}`;
  }
  if (columnId === "createdOn") return row.createdOn.getTime();
  return row[columnId] ?? "";
}

export default function RelatedApplicationsSubgrid({ applicationNumber, onOpenApplication }) {
  const rows = useMemo(() => relatedApplicationsFor(applicationNumber), [applicationNumber]);
  const [sort, setSort] = useState({ column: "createdOn", direction: "descending" });
  const [selected, setSelected] = useState(() => new Set());
  const [notice, setNotice] = useState("");

  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const left = cellValue(a, sort.column);
      const right = cellValue(b, sort.column);
      const result =
        typeof left === "number" && typeof right === "number"
          ? left - right
          : String(left).localeCompare(String(right));
      return sort.direction === "ascending" ? result : -result;
    });
    return copy;
  }, [rows, sort]);

  const allSelected = rows.length > 0 && selected.size === rows.length;
  const someSelected = selected.size > 0 && !allSelected;

  const toggleSort = (columnId) => {
    setSort((current) =>
      current.column === columnId
        ? { column: columnId, direction: current.direction === "ascending" ? "descending" : "ascending" }
        : { column: columnId, direction: "ascending" },
    );
  };

  const toggleRow = (id) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(rows.map((row) => row.relatedApplicationId)));
  };

  const refresh = () => {
    setSelected(new Set());
    setSort({ column: "createdOn", direction: "descending" });
    setNotice("");
  };

  return (
    <section className="mda-record-card mda-related-subgrid" aria-label="Related Applications">
      <header className="mda-related-subgrid__header">
        <h3 className="mda-related-subgrid__title">Related Applications</h3>
        <div className="mda-related-subgrid__commands" role="toolbar" aria-label="Related application commands">
          <Button appearance="subtle" type="button" onClick={() => setNotice("New related application is not available in this mock.")}>
            <span className="dynamics-cmd-btn__inner">
              <AddRegular className="dynamics-cmd-btn__icon" />
              <span>New Related Application</span>
            </span>
          </Button>
          <Button appearance="subtle" type="button" onClick={() => setNotice("Add existing application is not available in this mock.")}>
            <span className="dynamics-cmd-btn__inner">
              <PersonAddRegular className="dynamics-cmd-btn__icon" />
              <span>Add Existing Application</span>
            </span>
          </Button>
          <Button appearance="subtle" type="button" onClick={refresh}>
            <span className="dynamics-cmd-btn__inner">
              <ArrowClockwiseRegular className="dynamics-cmd-btn__icon" />
              <span>Refresh</span>
            </span>
          </Button>
          <Menu>
            <MenuTrigger disableButtonEnhancement>
              <Button appearance="subtle" type="button">
                <span className="dynamics-cmd-btn__inner">
                  <FlowRegular className="dynamics-cmd-btn__icon" />
                  <span>Flow</span>
                  <ChevronDownRegular className="dynamics-cmd-btn__chevron" aria-hidden />
                </span>
              </Button>
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem disabled>No flows are available</MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </div>
      </header>
      {notice ? <p className="mda-related-subgrid__notice">{notice}</p> : null}

      <div className="mda-related-subgrid__scroll">
        <table className="mda-related-subgrid__table">
          <thead>
            <tr>
              <th className="mda-related-subgrid__check" scope="col">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(element) => {
                    if (element) element.indeterminate = someSelected;
                  }}
                  onChange={toggleAll}
                  aria-label="Select all related applications"
                  disabled={rows.length === 0}
                />
              </th>
              {COLUMNS.map((column) => {
                const active = sort.column === column.id;
                return (
                  <th key={column.id} scope="col" aria-sort={active ? (sort.direction === "ascending" ? "ascending" : "descending") : "none"}>
                    <button type="button" className="mda-related-subgrid__sort" onClick={() => toggleSort(column.id)}>
                      <span>
                        {column.label}
                        {column.required ? <span className="mda-related-subgrid__req"> *</span> : null}
                      </span>
                      <ChevronDownRegular
                        className={`mda-related-subgrid__chevron${active && sort.direction === "ascending" ? " mda-related-subgrid__chevron--up" : ""}`}
                        aria-hidden
                      />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => {
              const isSelected = selected.has(row.relatedApplicationId);
              return (
                <tr
                  key={row.relatedApplicationId}
                  className={isSelected ? "mda-related-subgrid__row--selected" : ""}
                  onClick={() => toggleRow(row.relatedApplicationId)}
                >
                  <td className="mda-related-subgrid__check">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRow(row.relatedApplicationId)}
                      onClick={(event) => event.stopPropagation()}
                      aria-label={`Select ${row.relatedApplicationNumber}`}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="dynamics-grid-link"
                      onClick={(event) => {
                        event.stopPropagation();
                        onOpenApplication?.(row.relatedApplicationNumber);
                      }}
                    >
                      {row.relatedApplicationNumber}
                    </button>
                  </td>
                  <td>{row.relationshipType}</td>
                  <td>{row.relatedPerson}</td>
                  <td>{row.sharedEvidenceApplicable}</td>
                  <td>{row.sharedEvidenceStatus}</td>
                  <td className="mda-related-subgrid__reason" title={row.linkReason}>
                    {row.linkReason}
                  </td>
                  <td>{row.status}</td>
                  <td className="mda-related-subgrid__date">{dateFmt.format(row.createdOn)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 ? <p className="mda-related-subgrid__empty">No related applications.</p> : null}
      </div>
      <footer className="mda-related-subgrid__footer">Rows: {rows.length}</footer>
    </section>
  );
}
