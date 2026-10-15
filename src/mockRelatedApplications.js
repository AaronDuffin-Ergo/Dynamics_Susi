/**
 * Related Applications relationship records.
 * Each link is stored once and shown from either application.
 */

const INVERSE_RELATIONSHIP = {
  "Parent Application": "Dependant Application",
  "Dependant Application": "Parent Application",
};

function at(month, day, hour, minute = 0) {
  return new Date(Date.UTC(2026, month - 1, day, hour, minute));
}

const LINKS = [
  {
    relatedApplicationId: "REL-00021",
    applicationNumber: "SGS26-001377",
    applicationContact: "Kelly Steer",
    relatedApplicationNumber: "SGS26-003065",
    relatedApplicationContact: "Ciara Nolan",
    relationshipType: "Sibling Application",
    relatedPerson: "Ciara Nolan",
    sharedEvidenceApplicable: "Yes",
    sharedEvidenceStatus: "Applicable",
    linkReason: "Same household. Parental income evidence applies to both applications.",
    createdOn: at(5, 18, 11, 20),
    createdBy: "Aoife Brennan",
    status: "Active",
  },
  {
    relatedApplicationId: "REL-00022",
    applicationNumber: "SGS26-001377",
    applicationContact: "Kelly Steer",
    relatedApplicationNumber: "BTE26-003698",
    relatedApplicationContact: "Patrick Healy",
    relationshipType: "Parent Application",
    relatedPerson: "Patrick Healy",
    sharedEvidenceApplicable: "Yes",
    sharedEvidenceStatus: "Satisfied",
    linkReason: "Parent's application already holds the household income evidence.",
    createdOn: at(5, 19, 9, 5),
    createdBy: "Aoife Brennan",
    status: "Active",
  },
  {
    relatedApplicationId: "REL-00023",
    applicationNumber: "SGS26-001377",
    applicationContact: "Kelly Steer",
    relatedApplicationNumber: "SGS26-002010",
    relatedApplicationContact: "Oisín Doyle",
    relationshipType: "Other",
    relatedPerson: "Oisín Doyle",
    sharedEvidenceApplicable: "No",
    sharedEvidenceStatus: "Not Applicable",
    linkReason: "Link created in error.",
    createdOn: at(6, 2, 15, 40),
    createdBy: "Declan Moran",
    status: "Inactive",
  },
];

function viewFrom(link, side) {
  const fromRelatedSide = side === "related";
  return {
    relatedApplicationId: link.relatedApplicationId,
    relatedApplicationNumber: fromRelatedSide ? link.applicationNumber : link.relatedApplicationNumber,
    relatedApplicationContact: fromRelatedSide ? link.applicationContact : link.relatedApplicationContact,
    relationshipType: fromRelatedSide
      ? INVERSE_RELATIONSHIP[link.relationshipType] ?? link.relationshipType
      : link.relationshipType,
    relatedPerson: link.relatedPerson,
    sharedEvidenceApplicable: link.sharedEvidenceApplicable,
    sharedEvidenceStatus: link.sharedEvidenceStatus,
    linkReason: link.linkReason,
    createdOn: link.createdOn,
    createdBy: link.createdBy,
    status: link.status,
  };
}

export function relatedApplicationsFor(applicationNumber) {
  return LINKS.flatMap((link) => {
    if (link.applicationNumber === applicationNumber) return [viewFrom(link, "primary")];
    if (link.relatedApplicationNumber === applicationNumber) return [viewFrom(link, "related")];
    return [];
  });
}
