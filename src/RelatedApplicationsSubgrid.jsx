import { useMemo, useState } from "react";
import { Button, Input } from "@fluentui/react-components";
import {
  AddRegular,
  ArrowClockwiseRegular,
  DeleteRegular,
  SearchRegular,
} from "@fluentui/react-icons";
import { relatedApplicationsFor } from "./mockRelatedApplications.js";

const dateFmt = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

const COLUMNS = [
  { id: "relatedApplication", label: "Related Application" },
  { id: "relationshipType", label: "Relationship Type" },
  { id: "relatedPerson", label: "Related Person" },
  { id: "sharedEvidenceApplicable", label: "Shared Evidence Applicable" },
  { id: "sharedEvidenceStatus", label: "Shared Evidence Status" },
  { id: "linkReason", label: "Link Reason" },
  { id: "status", label: "Status" },
  { id: "createdOn", label: "Created Date" },
];

export default function RelatedApplicationsSubgrid({ applicationNumber, onOpenApplication }) {
  const [filter, setFilter] = useState("");
  const rows = useMemo(() => relatedApplicationsFor(applicationNumber), [applicationNumber]);
  const visibleRows = useMemo(() => {
    const query = filter.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      [
        row.relatedApplicationNumber,
        row.relatedApplicationContact,
        row.relationshipType,
        row.relatedPerson,
        row.sharedEvidenceApplicable,
        row.sharedEvidenceStatus,
        row.linkReason,
        row.status,
        row.createdBy,
        dateFmt.format(row.createdOn),
      ].some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [filter, rows]);

  return (
    <section className="mda-record-card mda-related-subgrid" aria-label="Related Applications">
      <header className="mda-related-subgrid__header">
        <div className="mda-related-subgrid__title-row">
          <h3 className="mda-related-subgrid__title">Related Applications</h3>
          <span className="mda-related-subgrid__count">{rows.length}</span>
        </div>
        <div className="mda-related-subgrid__commands" role="toolbar" aria-label="Related application commands">
          <Button appearance="subtle" type="button" disabled title="Preview only">
            <span className="dynamics-cmd-btn__inner">
              <AddRegular className="dynamics-cmd-btn__icon" />
              <span>New</span>
            </span>
          </Button>
          <Button appearance="subtle" type="button" disabled title="Preview only">
            <span className="dynamics-cmd-btn__inner">
              <ArrowClockwiseRegular className="dynamics-cmd-btn__icon" />
              <span>Refresh</span>
            </span>
          </Button>
          <Button appearance="subtle" type="button" disabled title="Preview only">
            <span className="dynamics-cmd-btn__inner">
              <DeleteRegular className="dynamics-cmd-btn__icon" />
              <span>Delete</span>
            </span>
          </Button>
          <Input
            className="mda-related-subgrid__search"
            placeholder="Filter by keyword"
            value={filter}
            onChange={(_, data) => setFilter(data.value)}
            contentBefore={<SearchRegular aria-hidden />}
            aria-label="Filter related applications"
          />
        </div>
      </header>

      <div className="mda-related-subgrid__scroll">
        <table className="mda-related-subgrid__table">
          <thead>
            <tr>
              {COLUMNS.map((column) => (
                <th key={column.id} scope="col">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.relatedApplicationId}>
                <td>
                  <button
                    type="button"
                    className="dynamics-grid-link"
                    onClick={() => onOpenApplication?.(row.relatedApplicationNumber)}
                  >
                    {row.relatedApplicationNumber} — {row.relatedApplicationContact}
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
                <td>{dateFmt.format(row.createdOn)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {visibleRows.length === 0 ? (
          <p className="mda-related-subgrid__empty">
            {filter.trim() ? `No related applications match "${filter.trim()}".` : "No related applications."}
          </p>
        ) : null}
      </div>
    </section>
  );
}
