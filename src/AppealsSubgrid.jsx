import { useMemo, useState } from "react";
import { Button, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger } from "@fluentui/react-components";
import { AddRegular, ArrowClockwiseRegular, ChevronDownRegular, FlowRegular } from "@fluentui/react-icons";
import { appealsFor } from "./mockAppeals.js";

const dateTime = new Intl.DateTimeFormat(undefined, {
  month: "numeric",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const COLUMNS = [
  { id: "appealNumber", label: "Appeal Number" },
  { id: "appealType", label: "Appeal Type" },
  { id: "status", label: "Status" },
  { id: "originalDecision", label: "Original Decision" },
  { id: "submittedOn", label: "Submitted On" },
  { id: "appealOutcome", label: "Appeal Outcome" },
];

function cellValue(row, columnId) {
  if (columnId === "submittedOn") return row.submittedOn ? row.submittedOn.getTime() : 0;
  return row[columnId] ?? "";
}

export default function AppealsSubgrid({ applicationNumber, onOpenAppeal }) {
  const rows = useMemo(() => appealsFor(applicationNumber), [applicationNumber]);
  const [sort, setSort] = useState({ column: "submittedOn", direction: "descending" });
  const [selected, setSelected] = useState(() => new Set());
  const [notice, setNotice] = useState("");

  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const left = cellValue(a, sort.column);
      const right = cellValue(b, sort.column);
      const result = typeof left === "number" && typeof right === "number" ? left - right : String(left).localeCompare(String(right));
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

  return (
    <section className="mda-record-card mda-related-subgrid" aria-label="Appeals">
      <header className="mda-related-subgrid__header">
        <h3 className="mda-related-subgrid__title">Appeals</h3>
        <div className="mda-related-subgrid__commands" role="toolbar" aria-label="Appeal commands">
          <Button appearance="subtle" type="button" onClick={() => setNotice("New appeal is not available in this mock.")}>
            <span className="dynamics-cmd-btn__inner">
              <AddRegular className="dynamics-cmd-btn__icon" />
              <span>New Appeal</span>
            </span>
          </Button>
          <Button
            appearance="subtle"
            type="button"
            onClick={() => {
              setSelected(new Set());
              setSort({ column: "submittedOn", direction: "descending" });
              setNotice("");
            }}
          >
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
                  onChange={() => setSelected(allSelected ? new Set() : new Set(rows.map((row) => row.appealNumber)))}
                  aria-label="Select all appeals"
                  disabled={rows.length === 0}
                />
              </th>
              {COLUMNS.map((column) => {
                const active = sort.column === column.id;
                return (
                  <th key={column.id} scope="col" aria-sort={active ? sort.direction : "none"}>
                    <button type="button" className="mda-related-subgrid__sort" onClick={() => toggleSort(column.id)}>
                      <span>{column.label}</span>
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
              const isSelected = selected.has(row.appealNumber);
              return (
                <tr
                  key={row.appealNumber}
                  className={isSelected ? "mda-related-subgrid__row--selected" : ""}
                  onClick={() => toggleRow(row.appealNumber)}
                >
                  <td className="mda-related-subgrid__check">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRow(row.appealNumber)}
                      onClick={(event) => event.stopPropagation()}
                      aria-label={`Select ${row.appealNumber}`}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="dynamics-grid-link"
                      onClick={(event) => {
                        event.stopPropagation();
                        onOpenAppeal?.(row.appealNumber);
                      }}
                    >
                      {row.appealNumber}
                    </button>
                  </td>
                  <td>{row.appealType}</td>
                  <td>{row.status}</td>
                  <td>{row.originalDecision}</td>
                  <td className="mda-related-subgrid__date">{dateTime.format(row.submittedOn)}</td>
                  <td>{row.appealOutcome || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 ? <p className="mda-related-subgrid__empty">No appeals.</p> : null}
      </div>
      <footer className="mda-related-subgrid__footer">Rows: {rows.length}</footer>
    </section>
  );
}
