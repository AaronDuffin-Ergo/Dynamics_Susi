import { useEffect, useId, useState } from "react";
import { Textarea } from "@fluentui/react-components";
import { ChevronDownRegular, DismissRegular } from "@fluentui/react-icons";
import {
  DOCUMENT_TYPES,
  RELATIONSHIPS,
  REQUEST_TYPES,
  emptyDocumentRequest,
} from "./mockDocumentTypes.js";

function Field({ label, required, children, error }) {
  return (
    <div className="mda-quick-create__field">
      <span className="mda-quick-create__label">{label}</span>
      <span className="mda-quick-create__req" aria-hidden="true">
        {required ? "*" : ""}
      </span>
      <div className="mda-quick-create__control">
        {children}
        {error ? <span className="mda-quick-create__error">{error}</span> : null}
      </div>
    </div>
  );
}

export default function DocumentRequestQuickCreate({ application, onSave, onClose }) {
  const titleId = useId();
  const [draft, setDraft] = useState(() => emptyDocumentRequest(application.applicationNumber));
  const [errors, setErrors] = useState({});
  const [saveMenuOpen, setSaveMenuOpen] = useState(false);

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
      filenamePrefix: type?.filenamePrefix ?? "",
      expire: type?.expire ?? "Yes",
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
    setSaveMenuOpen(false);
  };

  return (
    <div className="mda-quick-create-layer">
      <div className="mda-quick-create-scrim" />
      <aside className="mda-quick-create" role="dialog" aria-labelledby={titleId}>
        <header className="mda-quick-create__header">
          <h2 id={titleId} className="mda-quick-create__title">
            Quick Create: Document Request
          </h2>
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
          <p className="mda-quick-create__section">Details</p>
          <Field label="Document Type" required error={errors.documentTypeId}>
            <select
              className="mda-quick-create__select"
              value={draft.documentTypeId}
              onChange={(event) => selectType(event.target.value)}
              aria-label="Document Type"
            >
              <option value="">---</option>
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
              <option value="">---</option>
              {RELATIONSHIPS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Assessor Comment">
            <Textarea
              className="mda-quick-create__textarea mda-quick-create__textarea--large"
              value={draft.assessorComment}
              onChange={(_, data) => setField("assessorComment", data.value)}
              placeholder="---"
              rows={8}
              aria-label="Assessor Comment"
            />
          </Field>
          <Field label="Request Type" required error={errors.requestType}>
            <select
              className="mda-quick-create__select"
              value={draft.requestType}
              onChange={(event) => setField("requestType", event.target.value)}
              aria-label="Request Type"
            >
              <option value="">---</option>
              {REQUEST_TYPES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
        </form>

        <footer className="mda-quick-create__footer">
          <div className="mda-quick-create__split">
            <button type="button" className="mda-quick-create__save" onClick={saveAndClose}>
              Save and Close
            </button>
            <button
              type="button"
              className="mda-quick-create__save-more"
              aria-label="More save options"
              aria-expanded={saveMenuOpen}
              onClick={() => setSaveMenuOpen((open) => !open)}
            >
              <ChevronDownRegular />
            </button>
            {saveMenuOpen ? (
              <div className="mda-quick-create__menu" role="menu">
                <button type="button" role="menuitem" onClick={saveAndNew}>
                  Save and New
                </button>
              </div>
            ) : null}
          </div>
          <button type="button" className="mda-quick-create__cancel" onClick={onClose}>
            Cancel
          </button>
        </footer>
      </aside>
    </div>
  );
}
