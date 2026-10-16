import { useMemo, useState } from "react";
import { Button, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger } from "@fluentui/react-components";
import { AddRegular, ArrowClockwiseRegular, ChevronDownRegular, FlowRegular } from "@fluentui/react-icons";
import { sgabAppealsFor } from "./mockSgabAppeals.js";

const dateOnly = new Intl.DateTimeFormat(undefined, {
  month: "numeric",
  day: "numeric",
  year: "numeric",
});

const COLUMNS = [
  { id: "sgabAppealNumber", label: "SGAB Appeal Number" },
  { id: "sgabReference", label: "SGAB Reference" },
  { id: "receivedDate", label: "Received Date" },
  { id: "appealStatus", label: "Appeal Status" },
  { id: "previousSusiAppealExists", label: "Previous SUSI Appeal Exists" },
  { id: "determinationReceived", label: "Determination Received" },
  { id: "determinationOutcome", label: "Determination Outcome" },
];

export default function SgabAppealsSubgrid({ applicationNumber, onOpenSgabAppeal }) {
  const rows = useMemo(() => sgabAppealsFor(applicationNumber), [applicationNumber]);
  const [sort, setSort] = useState({ column: "sgabAppealNumber", direction: "ascending" });
  const [selected, setSelected] = useState(() => new Set());
  const [notice, setNotice] = useState("");

  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const left = sort.column === "receivedDate" ? a.receivedDate?.getTime() ?? 0 : a[sort.column] ?? "";
      const right = sort.column === "receivedDate" ? b.receivedDate?.getTime() ?? 0 : b[sort.column] ?? "";
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
    <section className="mda-record-card mda-related-subgrid" aria-label="SGAB Appeals">
      <header className="mda-related-subgrid__header">
        <h3 className="mda-related-subgrid__title">SGAB Appeals</h3>
        <div className="mda-related-subgrid__commands" role="toolbar" aria-label="SGAB appeal commands">
          <Button appearance="subtle" type="button" onClick={() => setNotice("New SGAB appeal is not available in this mock.")}>
            <span className="dynamics-cmd-btn__inner">
              <AddRegular className="dynamics-cmd-btn__icon" />
              <span>New SGAB Appeal</span>
            </span>
          </Button>
          <Button
            appearance="subtle"
            type="button"
            onClick={() => {
              setSelected(new Set());
              setSort({ column: "sgabAppealNumber", direction: "ascending" });
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
                  onChange={() => setSelected(allSelected ? new Set() : new Set(rows.map((row) => row.sgabAppealNumber)))}
                  aria-label="Select all SGAB appeals"
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
              const isSelected = selected.has(row.sgabAppealNumber);
              return (
                <tr
                  key={row.sgabAppealNumber}
                  className={isSelected ? "mda-related-subgrid__row--selected" : ""}
                  onClick={() => toggleRow(row.sgabAppealNumber)}
                >
                  <td className="mda-related-subgrid__check">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRow(row.sgabAppealNumber)}
                      onClick={(event) => event.stopPropagation()}
                      aria-label={`Select ${row.sgabAppealNumber}`}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="dynamics-grid-link"
                      onClick={(event) => {
                        event.stopPropagation();
                        onOpenSgabAppeal?.(row.sgabAppealNumber);
                      }}
                    >
                      {row.sgabAppealNumber}
                    </button>
                  </td>
                  <td>{row.sgabReference}</td>
                  <td className="mda-related-subgrid__date">{dateOnly.format(row.receivedDate)}</td>
                  <td>{row.appealStatus}</td>
                  <td>{row.previousSusiAppealExists}</td>
                  <td>{row.determinationReceived}</td>
                  <td>{row.determinationOutcome || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 ? <p className="mda-related-subgrid__empty">No SGAB appeals.</p> : null}
      </div>
      <footer className="mda-related-subgrid__footer">Rows: {rows.length}</footer>
    </section>
  );
}
