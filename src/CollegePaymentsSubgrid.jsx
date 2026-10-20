import { useMemo, useState } from "react";
import { Button } from "@fluentui/react-components";
import { AddRegular, ArrowClockwiseRegular, ChevronDownRegular } from "@fluentui/react-icons";

const money = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" });

const COLUMNS = [
  { id: "paymentType", label: "Payment Type" },
  { id: "paymentCode", label: "Payment Code" },
  { id: "status", label: "Status" },
  { id: "amount", label: "Amount", money: true },
  { id: "overrideAmount", label: "Override Amount", money: true },
];

const TYPE_ORDER = { Tranche: 0, Reconciliation: 1, "Post-Reconciliation": 2 };

function showCell(row, column) {
  const value = row[column.id];
  if (column.money) return value === null || value === undefined ? "---" : money.format(value);
  return value || "---";
}

export default function CollegePaymentsSubgrid({ rows }) {
  const [sort, setSort] = useState({ column: "paymentType", direction: "ascending" });
  const [selected, setSelected] = useState(() => new Set());
  const [notice, setNotice] = useState("");

  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      let result;
      if (sort.column === "paymentType") result = TYPE_ORDER[a.paymentType] - TYPE_ORDER[b.paymentType];
      else {
        const left = a[sort.column] ?? -Infinity;
        const right = b[sort.column] ?? -Infinity;
        result = typeof left === "number" && typeof right === "number" ? left - right : String(left).localeCompare(String(right));
      }
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
    <section className="mda-record-card mda-related-subgrid" aria-label="College Payments">
      <header className="mda-related-subgrid__header">
        <h3 className="mda-related-subgrid__title">College Payments</h3>
        <div className="mda-related-subgrid__commands" role="toolbar" aria-label="College payment commands">
          <Button appearance="subtle" type="button" onClick={() => setNotice("New College Payment is not available in this mock.")}>
            <span className="dynamics-cmd-btn__inner">
              <AddRegular className="dynamics-cmd-btn__icon" />
              <span>New College Payment</span>
            </span>
          </Button>
          <Button
            appearance="subtle"
            type="button"
            onClick={() => {
              setSelected(new Set());
              setSort({ column: "paymentType", direction: "ascending" });
              setNotice("");
            }}
          >
            <span className="dynamics-cmd-btn__inner">
              <ArrowClockwiseRegular className="dynamics-cmd-btn__icon" />
              <span>Refresh</span>
            </span>
          </Button>
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
                  onChange={() => setSelected(allSelected ? new Set() : new Set(rows.map((row) => row.collegePaymentNumber)))}
                  aria-label="Select all college payments"
                  disabled={rows.length === 0}
                />
              </th>
              {COLUMNS.map((column) => {
                const active = sort.column === column.id;
                return (
                  <th key={column.id} scope="col" aria-sort={active ? sort.direction : "none"} className={column.money ? "mda-fee-amount" : undefined}>
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
              const isSelected = selected.has(row.collegePaymentNumber);
              return (
                <tr
                  key={row.collegePaymentNumber}
                  className={isSelected ? "mda-related-subgrid__row--selected" : ""}
                  onClick={() => toggleRow(row.collegePaymentNumber)}
                >
                  <td className="mda-related-subgrid__check">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRow(row.collegePaymentNumber)}
                      onClick={(event) => event.stopPropagation()}
                      aria-label={`Select ${row.collegePaymentNumber}`}
                    />
                  </td>
                  <td>
                    <button type="button" className="dynamics-grid-link" onClick={(event) => event.stopPropagation()}>
                      {row.paymentType}
                    </button>
                  </td>
                  {COLUMNS.slice(1).map((column) => (
                    <td key={column.id} className={column.money ? "mda-fee-amount" : undefined}>
                      {showCell(row, column)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 ? <p className="mda-related-subgrid__empty">No college payments.</p> : null}
      </div>
      <footer className="mda-related-subgrid__footer">Rows: {rows.length}</footer>
    </section>
  );
}
