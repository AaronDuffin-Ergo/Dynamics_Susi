import { useMemo, useState } from "react";
import { Avatar, Input as FluentInput } from "@fluentui/react-components";
import {
  AddRegular,
  ArrowClockwiseRegular,
  ArrowSortRegular,
  AttachRegular,
  BookmarkRegular,
  BotRegular,
  ChatRegular,
  ChevronDownRegular,
  ChevronRightRegular,
  ChevronUpRegular,
  FilterRegular,
  LinkRegular,
  MailRegular,
  MoreHorizontalRegular,
  PenRegular,
  SearchRegular,
  SparkleRegular,
  TaskListLtrRegular,
} from "@fluentui/react-icons";

const activityDateFmt = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
  timeStyle: "short",
});

const KIND_ICONS = {
  portal: ChatRegular,
  email: MailRegular,
  task: TaskListLtrRegular,
};

function AutoPostItem({ activity, regardingLabel, regardingName }) {
  return (
    <li className="mda-timeline-activity mda-timeline-activity--auto">
      <span className="mda-timeline-activity__auto-icon" aria-hidden="true">
        <BotRegular />
      </span>
      <div className="mda-timeline-activity__auto-body">
        <p className="mda-timeline-activity__auto-line">
          Auto-post on {regardingLabel}{" "}
          <span className="mda-timeline-activity__link">{regardingName}</span>: {activity.title}
          <span className="mda-timeline-activity__auto-date">{activityDateFmt.format(activity.at)}</span>
        </p>
        <p className="mda-timeline-activity__auto-text">{activity.body}</p>
      </div>
    </li>
  );
}

function ActivityCard({ activity, regardingLabel, regardingName, expanded, onToggle }) {
  const KindIcon = KIND_ICONS[activity.kind] ?? ChatRegular;
  const bodyId = `${activity.id}-body`;

  return (
    <li className="mda-timeline-activity">
      <Avatar name={activity.actor} size={28} color="colorful" className="mda-timeline-activity__avatar" />
      <article className="mda-timeline-activity__card" aria-label={`${activity.summary}, ${activity.actor}`}>
        <p className="mda-timeline-activity__meta">Modified on: {activityDateFmt.format(activity.at)}</p>
        <p className="mda-timeline-activity__heading">
          <KindIcon className="mda-timeline-activity__kind-icon" aria-hidden="true" />
          <span className="mda-timeline-activity__type">{activity.title}</span>
          <span className="mda-timeline-activity__link">{activity.actor}</span>
          {activity.state ? (
            <span
              className={`mda-timeline-activity__state mda-timeline-activity__state--${activity.state.toLowerCase()}`}
            >
              {activity.state}
            </span>
          ) : null}
        </p>
        <p className="mda-timeline-activity__summary">{activity.summary}</p>
        <p
          id={bodyId}
          className={`mda-timeline-activity__text${expanded ? " mda-timeline-activity__text--expanded" : ""}`}
        >
          {activity.body}
        </p>
        <button
          type="button"
          className="mda-timeline-activity__more"
          aria-expanded={expanded}
          aria-controls={bodyId}
          onClick={onToggle}
        >
          {expanded ? "View less" : "View more"}
          {expanded ? <ChevronUpRegular aria-hidden="true" /> : <ChevronDownRegular aria-hidden="true" />}
        </button>
        <p className="mda-timeline-activity__regarding">
          {regardingLabel}:
          <LinkRegular className="mda-timeline-activity__regarding-icon" aria-hidden="true" />
          <span className="mda-timeline-activity__link">{regardingName}</span>
        </p>
      </article>
    </li>
  );
}

function TimelineActivities({ activities, regardingLabel, regardingName, recordMetaLabel }) {
  const [highlightsOpen, setHighlightsOpen] = useState(false);
  const [recentOpen, setRecentOpen] = useState(true);
  const [expandedIds, setExpandedIds] = useState(() => new Set());

  const highlights = useMemo(() => {
    const openItems = activities.filter((a) => a.state === "Open");
    const latest = activities[0];
    return { openItems, latest };
  }, [activities]);

  const toggleExpanded = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="mda-timeline-activities">
      <button
        type="button"
        className="mda-timeline-activities__section-toggle mda-timeline-activities__section-toggle--highlights"
        aria-expanded={highlightsOpen}
        onClick={() => setHighlightsOpen((o) => !o)}
      >
        <SparkleRegular className="mda-timeline-activities__sparkle" aria-hidden="true" />
        <span>Highlights</span>
        {highlightsOpen ? <ChevronUpRegular aria-hidden="true" /> : <ChevronDownRegular aria-hidden="true" />}
      </button>
      {highlightsOpen ? (
        <div className="mda-timeline-activities__highlights">
          {highlights.openItems.length > 0 ? (
            <p>
              {highlights.openItems.length} open {highlights.openItems.length === 1 ? "activity" : "activities"}:{" "}
              {highlights.openItems.map((a) => a.summary).join("; ")}.
            </p>
          ) : (
            <p>No open activities on this record.</p>
          )}
          {highlights.latest ? (
            <p>
              Latest: {highlights.latest.summary ?? highlights.latest.title} on{" "}
              {activityDateFmt.format(highlights.latest.at)}.
            </p>
          ) : null}
        </div>
      ) : null}

      <button
        type="button"
        className="mda-timeline-activities__section-toggle mda-timeline-activities__section-toggle--recent"
        aria-expanded={recentOpen}
        onClick={() => setRecentOpen((o) => !o)}
      >
        {recentOpen ? <ChevronDownRegular aria-hidden="true" /> : <ChevronRightRegular aria-hidden="true" />}
        <span>Recent</span>
      </button>

      {recentOpen ? (
        <ul className="mda-timeline-activities__list">
          {activities.map((activity) =>
            activity.kind === "autoPost" ? (
              <AutoPostItem
                key={activity.id}
                activity={activity}
                regardingLabel={regardingLabel}
                regardingName={regardingName}
              />
            ) : (
              <ActivityCard
                key={activity.id}
                activity={activity}
                regardingLabel={regardingLabel}
                regardingName={regardingName}
                expanded={expandedIds.has(activity.id)}
                onToggle={() => toggleExpanded(activity.id)}
              />
            ),
          )}
        </ul>
      ) : null}
      {recordMetaLabel ? <p className="mda-timeline-activities__footer">{recordMetaLabel}</p> : null}
    </div>
  );
}

export default function RecordTimelineAside({
  activities,
  createdShort,
  emptyMeta,
  emptyText = "Capture and manage all records in your timeline.",
  recordMetaLabel,
  regardingLabel = "Record",
  regardingName = "",
}) {
  const metaLine =
    recordMetaLabel ??
    (createdShort ? `Record created on ${createdShort}` : null);
  const hasActivities = Array.isArray(activities) && activities.length > 0;

  return (
    <aside className="mda-record-card mda-record-card--timeline" aria-label="Timeline">
      <div className="mda-timeline-aside__shell">
        <div className="mda-timeline-aside__main">
          <div className="mda-timeline-aside__bar">
            <span className="mda-timeline-aside__title">Timeline</span>
            <div className="mda-timeline-aside__actions">
              <button type="button" className="mda-timeline-aside__icon-btn" aria-label="Add to timeline">
                <AddRegular />
              </button>
              <button type="button" className="mda-timeline-aside__icon-btn" aria-label="Show followed records">
                <BookmarkRegular />
              </button>
              <button type="button" className="mda-timeline-aside__icon-btn" aria-label="Filter timeline">
                <FilterRegular />
              </button>
              <button type="button" className="mda-timeline-aside__icon-btn" aria-label="Sort timeline">
                <ArrowSortRegular />
              </button>
              <button type="button" className="mda-timeline-aside__icon-btn" aria-label="Refresh timeline">
                <ArrowClockwiseRegular />
              </button>
              <button type="button" className="mda-timeline-aside__icon-btn" aria-label="More timeline options">
                <MoreHorizontalRegular />
              </button>
            </div>
          </div>
          <div className="mda-timeline-aside__body">
            <FluentInput
              placeholder="Search timeline"
              contentBefore={<SearchRegular className="mda-timeline-aside__field-icon" aria-hidden />}
              className="mda-timeline-aside__search"
              disabled
              appearance="outline"
              aria-label="Search timeline"
            />
            <FluentInput
              placeholder="Enter a note..."
              contentBefore={<PenRegular className="mda-timeline-aside__field-icon" aria-hidden />}
              contentAfter={<AttachRegular className="mda-timeline-aside__field-icon" aria-hidden />}
              className="mda-timeline-aside__note"
              disabled
              appearance="outline"
              aria-label="Enter a note"
            />
            {hasActivities ? (
              <TimelineActivities
                activities={activities}
                regardingLabel={regardingLabel}
                regardingName={regardingName}
                recordMetaLabel={metaLine}
              />
            ) : (
              <div className="mda-timeline-aside__empty">
                <h3 className="mda-timeline-aside__empty-title">Get started</h3>
                <p className="mda-timeline-aside__empty-text">{emptyText}</p>
                {emptyMeta ? <p className="mda-timeline-aside__empty-meta">{emptyMeta}</p> : null}
                {metaLine ? <p className="mda-timeline-aside__empty-meta">{metaLine}</p> : null}
              </div>
            )}
          </div>
        </div>
        <button
          type="button"
          className="mda-timeline-aside__collapse"
          aria-label="Collapse timeline panel"
          title="Collapse timeline"
        >
          <ChevronRightRegular aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
