import { useMemo, useState } from "react";
import { Button, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger } from "@fluentui/react-components";
import { AddRegular, ArrowClockwiseRegular, ChevronDownRegular, FlowRegular } from "@fluentui/react-icons";
import { money, paymentScheduleFor } from "./mockPayments.js";

const dateOnly = new Intl.DateTimeFormat(undefined, {
  month: "numeric",
  day: "numeric",
  year: "numeric",
});

const COLUMNS = [
  { id: "applicationNumber", label: "Application" },
  { id: "sequence", label: "Payment Sequence" },
  { id: "paymentCode", label: "Payment Code" },
  { id: "scheduledDate", label: "Scheduled Date" },
  { id: "amount", label: "Amount" },
  { id: "status", label: "Status" },
  { id: "releasedDate", label: "Released Date" },
  { id: "externalReference", label: "External Payment Reference" },
  { id: "notes", label: "Notes" },
  { id: "registrationVerified", label: "Registration/Attendance Verified" },
  { id: "attendanceOutcome", label: "Attendance Outcome" },
  { id: "collegeFile", label: "College File" },
];

const HEADER_FIELDS = [
  ["award", "Award"],
  ["awardBand", "Award band"],
  ["maintenanceRate", "Maintenance rate"],
  ["feeEntitlement", "Fee entitlement"],
  ["restrictions", "Payment restrictions"],
  ["instalments", "Instalments"],
  ["totalScheduled", "Total scheduled"],
  ["courseDates", "Course dates"],
  ["scheduleBasis", "Schedule basis"],
];

function show(value) {
  return value ? String(value) : "—";
}

function showDate(value) {
  return value ? dateOnly.format(value) : "—";
}

function cellValue(row, columnId) {
  if (columnId === "scheduledDate" || columnId === "releasedDate") return row[columnId] ? row[columnId].getTime() : 0;
  if (columnId === "amount" || columnId === "sequence") return row[columnId];
  return row[columnId] ?? "";
}

export default function PaymentsPanel({ applicationNumber }) {
  const schedule = useMemo(() => paymentScheduleFor(applicationNumber), [applicationNumber]);
  const rows = schedule?.payments ?? [];
  const [sort, setSort] = useState({ column: "sequence", direction: "ascending" });
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

  if (!schedule) {
    return (
      <section className="mda-record-card mda-payment-empty" aria-label="Payments">
        <h3 className="mda-related-subgrid__title">Payments</h3>
        <p>No payment schedule. A schedule is created when an approved award includes a payment.</p>
      </section>
    );
  }

  return (
    <div className="mda-related-stack">
      <section className="mda-record-card mda-payment-header" aria-label="Payment details">
        <h3 className="mda-related-subgrid__title">Payment details</h3>
        <dl className="mda-payment-header__grid">
          {HEADER_FIELDS.map(([key, label]) => (
            <div key={key}>
              <dt>{label}</dt>
              <dd>{schedule.header[key]}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mda-record-card mda-related-subgrid" aria-label="Payments">
        <header className="mda-related-subgrid__header">
          <h3 className="mda-related-subgrid__title">Payments</h3>
          <div className="mda-related-subgrid__commands" role="toolbar" aria-label="Payment commands">
            <Button appearance="subtle" type="button" onClick={() => setNotice("New payment is not available in this mock.")}>
              <span className="dynamics-cmd-btn__inner">
                <AddRegular className="dynamics-cmd-btn__icon" />
                <span>New Payment</span>
              </span>
            </Button>
            <Button
              appearance="subtle"
              type="button"
              onClick={() => {
                setSelected(new Set());
                setSort({ column: "sequence", direction: "ascending" });
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
                    onChange={() => setSelected(allSelected ? new Set() : new Set(rows.map((row) => row.id)))}
                    aria-label="Select all payments"
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
                  <tr key={row.id} className={isSelected ? "mda-related-subgrid__row--selected" : ""} onClick={() => toggleRow(row.id)}>
                    <td className="mda-related-subgrid__check">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(row.id)}
                        onClick={(event) => event.stopPropagation()}
                        aria-label={`Select payment ${row.sequence}`}
                      />
                    </td>
                    <td>
                      <button type="button" className="dynamics-grid-link" onClick={(event) => event.stopPropagation()}>
                        {row.applicationNumber}
                      </button>
                    </td>
                    <td>{row.sequence}</td>
                    <td>{row.paymentCode}</td>
                    <td className="mda-related-subgrid__date">{showDate(row.scheduledDate)}</td>
                    <td>{money.format(row.amount)}</td>
                    <td>{row.status}</td>
                    <td className="mda-related-subgrid__date">{showDate(row.releasedDate)}</td>
                    <td>{show(row.externalReference)}</td>
                    <td className="mda-related-subgrid__reason" title={row.notes || undefined}>
                      {show(row.notes)}
                    </td>
                    <td>{show(row.registrationVerified)}</td>
                    <td>{show(row.attendanceOutcome)}</td>
                    <td>{show(row.collegeFile)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <footer className="mda-related-subgrid__footer">Rows: {rows.length}</footer>
      </section>
    </div>
  );
}
