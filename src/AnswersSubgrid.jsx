import { useMemo, useState } from "react";
import { Button, Input, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger } from "@fluentui/react-components";
import {
  AddRegular,
  ArrowClockwiseRegular,
  ChevronDownRegular,
  FlowRegular,
  SearchRegular,
} from "@fluentui/react-icons";
import { DynamicsViewTitlePicker } from "./dynamicsListViewHelpers.jsx";
import { ANSWER_SECTIONS, answersFor } from "./mockAnswers.js";

const EMPTY = "—";

const dateFmt = new Intl.DateTimeFormat(undefined, {
  month: "numeric",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const VIEWS = [
  { id: "all", label: "All Answers", isDefault: true, filter: () => true },
  ...ANSWER_SECTIONS.map((section) => ({
    id: section.id,
    label: `${section.label} Answers`,
    isDefault: false,
    filter: (row) => row.section === section.id,
  })),
  {
    id: "unanswered",
    label: "Unanswered Questions",
    isDefault: false,
    filter: (row) => !row.applicantAnswer && !row.assessorAnswer,
  },
];

const COLUMNS = [
  { id: "application", label: "Application", required: true },
  { id: "question", label: "Question", required: true },
  { id: "applicantAnswer", label: "Applicant Answer" },
  { id: "assessorAnswer", label: "Assessor Answer" },
  { id: "assessorAnswerReason", label: "Assessor Answer Reason" },
  { id: "lastUpdatedOn", label: "Last Updated On" },
  { id: "validationStatus", label: "Validation Status", required: true },
];

const DEFAULT_SORT = { column: "question", direction: "ascending" };

function cellValue(row, columnId) {
  if (columnId === "lastUpdatedOn") return row.lastUpdatedOn.getTime();
  if (columnId === "question") return row.order;
  if (columnId === "application") return row.applicationNumber;
  return row[columnId] ?? "";
}

export default function AnswersSubgrid({ application }) {
  const rows = useMemo(
    () =>
      answersFor(application).map((row) => ({
        ...row,
        applicationNumber: application.applicationNumber,
      })),
    [application],
  );
  const [viewId, setViewId] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [selected, setSelected] = useState(() => new Set());
  const [notice, setNotice] = useState("");

  const visibleRows = useMemo(() => {
    const view = VIEWS.find((v) => v.id === viewId) ?? VIEWS[0];
    const search = query.trim().toLowerCase();
    const filtered = rows.filter(view.filter).filter((row) => {
      if (!search) return true;
      return [row.question, row.applicantAnswer, row.assessorAnswer, row.validationStatus].some((value) =>
        String(value).toLowerCase().includes(search),
      );
    });
    return filtered.sort((a, b) => {
      const left = cellValue(a, sort.column);
      const right = cellValue(b, sort.column);
      const result =
        typeof left === "number" && typeof right === "number"
          ? left - right
          : String(left).localeCompare(String(right));
      return sort.direction === "ascending" ? result : -result;
    });
  }, [rows, viewId, query, sort]);

  const visibleIds = visibleRows.map((row) => row.answerId);
  const selectedVisible = visibleIds.filter((id) => selected.has(id)).length;
  const allSelected = visibleIds.length > 0 && selectedVisible === visibleIds.length;
  const someSelected = selectedVisible > 0 && !allSelected;

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
    setSelected((current) => {
      const next = new Set(current);
      if (allSelected) visibleIds.forEach((id) => next.delete(id));
      else visibleIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const refresh = () => {
    setSelected(new Set());
    setQuery("");
    setSort(DEFAULT_SORT);
    setNotice("");
  };

  return (
    <section className="mda-record-card mda-related-subgrid mda-answers-subgrid" aria-label="Answers">
      <header className="mda-related-subgrid__header">
        <DynamicsViewTitlePicker
          views={VIEWS}
          selectedViewId={viewId}
          onSelectViewId={(id) => {
            setViewId(id);
            setSelected(new Set());
          }}
          onManageViews={() => setNotice("Managing views is not available in this mock.")}
        />
        <div className="mda-related-subgrid__commands" role="toolbar" aria-label="Answer commands">
          <Button appearance="subtle" type="button" onClick={() => setNotice("New answer is not available in this mock.")}>
            <span className="dynamics-cmd-btn__inner">
              <AddRegular className="dynamics-cmd-btn__icon" />
              <span>New Answer</span>
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
          <Input
            className="mda-answers-subgrid__search"
            placeholder="Search questions and answers"
            value={query}
            onChange={(_, data) => setQuery(data.value)}
            contentBefore={<SearchRegular aria-hidden />}
            aria-label="Search questions and answers"
          />
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
                  aria-label="Select all answers"
                  disabled={visibleIds.length === 0}
                />
              </th>
              {COLUMNS.map((column) => {
                const active = sort.column === column.id;
                return (
                  <th
                    key={column.id}
                    scope="col"
                    aria-sort={active ? sort.direction : "none"}
                  >
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
            {visibleRows.map((row) => {
              const isSelected = selected.has(row.answerId);
              return (
                <tr
                  key={row.answerId}
                  className={isSelected ? "mda-related-subgrid__row--selected" : ""}
                  onClick={() => toggleRow(row.answerId)}
                >
                  <td className="mda-related-subgrid__check">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRow(row.answerId)}
                      onClick={(event) => event.stopPropagation()}
                      aria-label={`Select ${row.question}`}
                    />
                  </td>
                  <td>
                    <button type="button" className="dynamics-grid-link">
                      {row.applicationNumber}
                    </button>
                  </td>
                  <td>
                    <button type="button" className="dynamics-grid-link" title={row.sectionLabel}>
                      {row.question}
                    </button>
                  </td>
                  <td title={row.source === "feed" ? "From external feed" : undefined}>
                    {row.applicantAnswer || EMPTY}
                  </td>
                  <td>{row.assessorAnswer || EMPTY}</td>
                  <td className="mda-related-subgrid__reason" title={row.assessorAnswerReason}>
                    {row.assessorAnswerReason || EMPTY}
                  </td>
                  <td className="mda-related-subgrid__date">{dateFmt.format(row.lastUpdatedOn)}</td>
                  <td>{row.validationStatus}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {visibleRows.length === 0 ? (
          <p className="mda-related-subgrid__empty">
            {query.trim() ? `No answers match "${query.trim()}".` : "No answers in this view."}
          </p>
        ) : null}
      </div>
      <footer className="mda-related-subgrid__footer">Rows: {visibleRows.length}</footer>
    </section>
  );
}
