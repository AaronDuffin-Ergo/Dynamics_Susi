import { useMemo, useState } from "react";
import { Button, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger } from "@fluentui/react-components";
import { AddRegular, ArrowClockwiseRegular, ChevronDownRegular, FlowRegular } from "@fluentui/react-icons";
import { approvalLogsFor } from "./mockApprovalLogs.js";

const dateFmt = new Intl.DateTimeFormat(undefined, {
  month: "numeric",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const COLUMNS = [
  { id: "name", label: "Name" },
  { id: "regarding", label: "Regarding" },
  { id: "requestedBy", label: "Requested By" },
  { id: "requestedOn", label: "Requested On" },
  { id: "approver", label: "Approver" },
  { id: "approvalStatus", label: "Approval Status" },
  { id: "approverComments", label: "Approver Comments" },
  { id: "responseDate", label: "Response Date" },
];

function cellValue(row, columnId) {
  if (columnId === "requestedOn" || columnId === "responseDate") {
    return row[columnId] ? row[columnId].getTime() : 0;
  }
  return row[columnId] ?? "";
}

function textOrDash(value) {
  return value ? value : "—";
}

function Lookup({ children }) {
  return (
    <button type="button" className="dynamics-grid-link" onClick={(event) => event.stopPropagation()}>
      {children}
    </button>
  );
}

export default function ApprovalLogSubgrid({ applicationNumber }) {
  const rows = useMemo(() => approvalLogsFor(applicationNumber), [applicationNumber]);
  const [sort, setSort] = useState({ column: "requestedOn", direction: "descending" });
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

  const refresh = () => {
    setSelected(new Set());
    setSort({ column: "requestedOn", direction: "descending" });
    setNotice("");
  };

  return (
    <section className="mda-record-card mda-related-subgrid" aria-label="Approval Log">
      <header className="mda-related-subgrid__header">
        <h3 className="mda-related-subgrid__title">Approval Log</h3>
        <div className="mda-related-subgrid__commands" role="toolbar" aria-label="Approval log commands">
          <Button appearance="subtle" type="button" onClick={() => setNotice("New approval log is not available in this mock.")}>
            <span className="dynamics-cmd-btn__inner">
              <AddRegular className="dynamics-cmd-btn__icon" />
              <span>New Approval Log</span>
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
                  onChange={() => setSelected(allSelected ? new Set() : new Set(rows.map((row) => row.id)))}
                  aria-label="Select all approval logs"
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
              const isSelected = selected.has(row.id);
              return (
                <tr
                  key={row.id}
                  className={isSelected ? "mda-related-subgrid__row--selected" : ""}
                  onClick={() => toggleRow(row.id)}
                >
                  <td className="mda-related-subgrid__check">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRow(row.id)}
                      onClick={(event) => event.stopPropagation()}
                      aria-label={`Select ${row.name}`}
                    />
                  </td>
                  <td>
                    <Lookup>{row.name}</Lookup>
                  </td>
                  <td>
                    <Lookup>{row.regarding}</Lookup>
                  </td>
                  <td>
                    <Lookup>{row.requestedBy}</Lookup>
                  </td>
                  <td className="mda-related-subgrid__date">{dateFmt.format(row.requestedOn)}</td>
                  <td>
                    <Lookup>{row.approver}</Lookup>
                  </td>
                  <td>{row.approvalStatus}</td>
                  <td className="mda-related-subgrid__reason" title={row.approverComments || undefined}>
                    {textOrDash(row.approverComments)}
                  </td>
                  <td className="mda-related-subgrid__date">{row.responseDate ? dateFmt.format(row.responseDate) : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 ? <p className="mda-related-subgrid__empty">No approval logs.</p> : null}
      </div>
      <footer className="mda-related-subgrid__footer">Rows: {rows.length}</footer>
    </section>
  );
}
