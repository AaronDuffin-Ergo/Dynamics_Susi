import { useMemo, useState } from "react";
import { Button } from "@fluentui/react-components";
import { AddRegular, ArrowClockwiseRegular, ChevronDownRegular } from "@fluentui/react-icons";

const money = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" });

const COLUMNS = [
  { id: "college", label: "College" },
  { id: "awardedApplicantCount", label: "Awarded applicant count", numeric: true },
  { id: "baseCalculatedAmount", label: "Base calculated Tranche", numeric: true, money: true },
  { id: "marginPercentage", label: "Margin Percentage", numeric: true },
  { id: "marginAmount", label: "Margin amount", numeric: true, money: true },
  { id: "calculatedTrancheAmount", label: "Calculated Tranche amount", numeric: true, money: true },
  { id: "finalTrancheAmount", label: "Final tranche amount", numeric: true, money: true },
];

function showCell(row, column) {
  if (column.id === "marginPercentage") return `${row.marginPercentage.toFixed(2)}%`;
  if (column.money) return money.format(row[column.id]);
  return String(row[column.id]);
}

export default function CollegeFeesSubgrid({ rows, onOpenCollege }) {
  const [sort, setSort] = useState({ column: "college", direction: "ascending" });
  const [selected, setSelected] = useState(() => new Set());
  const [notice, setNotice] = useState("");

  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const left = a[sort.column];
      const right = b[sort.column];
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
    <section className="mda-record-card mda-related-subgrid" aria-label="College Fees">
      <header className="mda-related-subgrid__header">
        <div>
          <p className="mda-fee-tranche__label">Tranche</p>
          <h3 className="mda-related-subgrid__title">College Fees</h3>
        </div>
        <div className="mda-related-subgrid__commands" role="toolbar" aria-label="College fee commands">
          <Button appearance="subtle" type="button" onClick={() => setNotice("New College Fee is not available in this mock.")}>
            <span className="dynamics-cmd-btn__inner">
              <AddRegular className="dynamics-cmd-btn__icon" />
              <span>New College Fee</span>
            </span>
          </Button>
          <Button
            appearance="subtle"
            type="button"
            onClick={() => {
              setSelected(new Set());
              setSort({ column: "college", direction: "ascending" });
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
                  onChange={() => setSelected(allSelected ? new Set() : new Set(rows.map((row) => row.college)))}
                  aria-label="Select all college fees"
                  disabled={rows.length === 0}
                />
              </th>
              {COLUMNS.map((column) => {
                const active = sort.column === column.id;
                return (
                  <th key={column.id} scope="col" aria-sort={active ? sort.direction : "none"} className={column.numeric ? "mda-fee-amount" : undefined}>
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
              const isSelected = selected.has(row.college);
              return (
                <tr
                  key={row.college}
                  className={isSelected ? "mda-related-subgrid__row--selected" : ""}
                  onClick={() => toggleRow(row.college)}
                >
                  <td className="mda-related-subgrid__check">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRow(row.college)}
                      onClick={(event) => event.stopPropagation()}
                      aria-label={`Select ${row.college}`}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="dynamics-grid-link"
                      onClick={(event) => {
                        event.stopPropagation();
                        onOpenCollege?.(row.college);
                      }}
                    >
                      {row.college}
                    </button>
                  </td>
                  {COLUMNS.slice(1).map((column) => (
                    <td key={column.id} className={column.numeric ? "mda-fee-amount" : undefined}>
                      {showCell(row, column)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <footer className="mda-related-subgrid__footer">Rows: {rows.length}</footer>
    </section>
  );
}
