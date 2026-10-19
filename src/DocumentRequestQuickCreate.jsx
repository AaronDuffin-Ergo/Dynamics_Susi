import { useEffect, useId, useState } from "react";
import { Button, Input, Textarea } from "@fluentui/react-components";
import { DismissRegular } from "@fluentui/react-icons";
import {
  DOCUMENT_TYPES,
  RELATIONSHIPS,
  REQUEST_TYPES,
  emptyDocumentRequest,
} from "./mockDocumentTypes.js";

function Field({ label, required, children, error }) {
  return (
    <label className="mda-quick-create__field">
      <span className="mda-quick-create__label">
        {label}
        {required ? <span className="mda-related-subgrid__req"> *</span> : null}
      </span>
      {children}
      {error ? <span className="mda-quick-create__error">{error}</span> : null}
    </label>
  );
}

export default function DocumentRequestQuickCreate({ application, onSave, onClose }) {
  const titleId = useId();
  const [draft, setDraft] = useState(() => emptyDocumentRequest(application.applicationNumber));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setDraft(emptyDocumentRequest(application.applicationNumber));
    setErrors({});
  }, [application.applicationNumber]);

  const setField = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const selectType = (documentTypeId) => {
    const type = DOCUMENT_TYPES.find((item) => item.id === documentTypeId);
    setDraft((current) => ({
      ...current,
      documentTypeId,
      applicantInstructions: type?.applicantInstructions ?? "",
      predefinedFormLink: type?.predefinedFormLink ?? "",
      filenamePrefix: type?.filenamePrefix ?? "",
      expire: type?.expire ?? "Yes",
      requestType: type?.requestType ?? current.requestType,
    }));
    setErrors((current) => ({ ...current, documentTypeId: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!draft.documentTypeId) next.documentTypeId = "Document Type is required.";
    if (!draft.relationship) next.relationship = "Relationship is required.";
    if (!draft.requestType) next.requestType = "Request Type is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildRecord = () => {
    const type = DOCUMENT_TYPES.find((item) => item.id === draft.documentTypeId);
    return {
      ...draft,
      id: `DR-${Date.now()}`,
      documentTypeName: type?.name ?? "",
      regarding: application.applicationNumber,
      status: "Draft",
      requestedBy: "Aoife Brennan",
    };
  };

  const saveAndClose = () => {
    if (!validate()) return;
    onSave(buildRecord());
    onClose();
  };

  const saveAndNew = () => {
    if (!validate()) return;
    onSave(buildRecord());
    setDraft(emptyDocumentRequest(application.applicationNumber));
    setErrors({});
  };

  return (
    <aside className="mda-quick-create" role="dialog" aria-labelledby={titleId}>
      <header className="mda-quick-create__header">
        <div>
          <p className="mda-quick-create__kicker">Quick Create</p>
          <h2 id={titleId} className="mda-quick-create__title">
            Document Request
          </h2>
        </div>
        <button type="button" className="mda-quick-create__close" onClick={onClose} aria-label="Close quick create">
          <DismissRegular />
        </button>
      </header>

      <form
        className="mda-quick-create__body"
        onSubmit={(event) => {
          event.preventDefault();
          saveAndClose();
        }}
      >
        <Field label="Document Type" required error={errors.documentTypeId}>
          <select
            className="mda-quick-create__select"
            value={draft.documentTypeId}
            onChange={(event) => selectType(event.target.value)}
            aria-label="Document Type"
          >
            <option value="">Select a document type</option>
            {DOCUMENT_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Relationship" required error={errors.relationship}>
          <select
            className="mda-quick-create__select"
            value={draft.relationship}
            onChange={(event) => setField("relationship", event.target.value)}
            aria-label="Relationship"
          >
            {RELATIONSHIPS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Assessor Comment">
          <Textarea
            value={draft.assessorComment}
            onChange={(_, data) => setField("assessorComment", data.value)}
            placeholder="Explanation for this request"
            rows={3}
            aria-label="Assessor Comment"
          />
        </Field>
        <Field label="Applicant Instructions">
          <Textarea readOnly value={draft.applicantInstructions} rows={4} placeholder="Copied from the document type" aria-label="Applicant Instructions" />
        </Field>
        <Field label="Predefined Form Link">
          {draft.predefinedFormLink ? (
            <a className="mda-quick-create__link" href={draft.predefinedFormLink} target="_blank" rel="noreferrer">
              {draft.predefinedFormLink}
            </a>
          ) : (
            <Input readOnly value="" placeholder="Copied from the document type" aria-label="Predefined Form Link" />
          )}
        </Field>
        <Field label="Request Type" required error={errors.requestType}>
          <select
            className="mda-quick-create__select"
            value={draft.requestType}
            onChange={(event) => setField("requestType", event.target.value)}
            aria-label="Request Type"
          >
            {REQUEST_TYPES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
      </form>

      <footer className="mda-quick-create__footer">
        <Button appearance="primary" type="button" onClick={saveAndClose}>
          Save and Close
        </Button>
        <Button appearance="secondary" type="button" onClick={saveAndNew}>
          Save and New
        </Button>
      </footer>
    </aside>
  );
}
