import { Input as FluentInput } from "@fluentui/react-components";
import { MoreHorizontalRegular, SearchRegular } from "@fluentui/react-icons";

function caseNumberFor(applicationNumber) {
  const digits = applicationNumber.replace(/\D/g, "").slice(-5).padStart(5, "0");
  return `CAS-${digits}-A${digits.slice(0, 4)}`;
}

export default function ApplicationRecordRail({ application }) {
  const firstName = application.contactName.split(" ")[0];
  const relatedCase = {
    title: application.missingDocument ? "Missing document" : "Application query",
    number: caseNumberFor(application.applicationNumber),
  };

  return (
    <div className="mda-record-rail" aria-label="Related">
      <section className="mda-record-card mda-rail-card">
        <h3 className="mda-rail-card__title">Who Knows Whom</h3>
        <p className="mda-rail-card__empty-title">No connections found</p>
        <p className="mda-rail-card__empty-text">
          Start by creating a manual activity with {application.contactName}.{" "}
          <button type="button" className="mda-rail-card__link">
            Learn More
          </button>
        </p>
      </section>

      <section className="mda-record-card mda-rail-card">
        <h3 className="mda-rail-card__title">Assistant</h3>
      </section>

      <section className="mda-record-card mda-rail-card">
        <h3 className="mda-rail-card__title">Notifications</h3>
        <p className="mda-rail-card__empty-title">No notifications or suggestions</p>
        <p className="mda-rail-card__empty-text">Check back later to see what&apos;s new and stay up to date.</p>
      </section>

      <section className="mda-record-card mda-rail-card">
        <h3 className="mda-rail-card__title">Account</h3>
        <FluentInput
          className="mda-rail-card__lookup"
          placeholder="---"
          readOnly
          contentAfter={<SearchRegular aria-hidden />}
          aria-label="Account"
        />
      </section>

      <section className="mda-record-card mda-rail-card mda-rail-card--cases" aria-label="Recent cases">
        <header className="mda-rail-cases__header">
          <h3 className="mda-rail-cases__title">Recent cases</h3>
          <span className="mda-rail-cases__count" aria-label="1 recent case">
            1
          </span>
          <button type="button" className="mda-rail-cases__more" aria-label="More case options">
            <MoreHorizontalRegular />
          </button>
        </header>
        <p className="mda-rail-cases__select">Select all</p>
        <article className="mda-rail-case">
          <span className="mda-rail-case__icon" aria-hidden="true">
            {firstName.slice(0, 1)}
          </span>
          <div>
            <p className="mda-rail-case__title">{relatedCase.title}</p>
            <p className="mda-rail-case__number">{relatedCase.number}</p>
          </div>
        </article>
        <footer className="mda-rail-cases__pager">1 - 1 of 1</footer>
      </section>
    </div>
  );
}
