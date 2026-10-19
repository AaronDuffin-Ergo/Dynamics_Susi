/**
 * Sample Contact records. Applicants carry language and banking details.
 * College and third-party contacts are linked to an Account.
 * Banking values are stored in full and shown masked on the form.
 */

export function fullName(contact) {
  return `${contact.firstName} ${contact.lastName}`;
}

export function maskIban(iban) {
  const compact = String(iban || "").replace(/\s/g, "");
  if (compact.length < 8) return "";
  return `${compact.slice(0, 4)} •••• •••• •••• ${compact.slice(-4)}`;
}

export function maskBic(bic) {
  const compact = String(bic || "").replace(/\s/g, "");
  if (compact.length < 4) return "";
  return `${compact.slice(0, 4)}••••`;
}

const applicants = [
  ["Kelly", "Steer", "English", "kelly.steer@mail.ie", "kelly.steer.study@mail.ie", "021 439 2201", "087 241 1180", "14 Sunday's Well Road, Cork", "T23 A4K2", "IE29AIBK93115212345678", "AIBKIE2D"],
  ["Cian", "O'Sullivan", "English", "cian.osullivan@mail.ie", "", "01 700 4410", "086 552 0194", "8 Griffith Avenue, Dublin 9", "D09 P2X8", "IE64BOFI90001799887766", "BOFIIE2D"],
  ["Saoirse", "Kavanagh", "Irish", "saoirse.kavanagh@mail.ie", "", "01 628 3302", "087 910 4421", "Main Street, Maynooth, Co. Kildare", "W23 YK18", "IE47ULSB98654322110098", "ULSBIE2D"],
  ["Oisín", "Doyle", "Irish", "oisin.doyle@mail.ie", "", "061 202 114", "085 334 7781", "22 Castletroy View, Limerick", "V94 C3N7", "IE12AIBK93115200998877", "AIBKIE2D"],
  ["Aisling", "Murphy", "English", "aisling.murphy@mail.ie", "a.murphy.home@mail.ie", "01 716 2200", "083 441 2290", "41 Rathmines Road, Dublin 6", "D06 F4H2", "IE88BOFI90001711223344", "BOFIIE2D"],
  ["Conor", "Walsh", "English", "conor.walsh@mail.ie", "", "021 432 7705", "087 665 3012", "9 Bishopstown Road, Cork", "T12 E8P4", "IE33AIBK93115255667788", "AIBKIE2D"],
  ["Róisín", "Byrne", "English", "roisin.byrne@mail.ie", "", "01 896 1104", "086 220 9183", "15 Ranelagh, Dublin 6", "D06 X9T1", "IE55PTSB99061233445566", "PTSBIE2D"],
  ["Eoin", "Fitzgerald", "English", "eoin.fitzgerald@mail.ie", "", "091 524 411", "087 778 6502", "6 Newcastle Road, Galway", "H91 Y2C8", "IE21BOFI90001766778899", "BOFIIE2D"],
  ["Ciara", "Nolan", "English", "ciara.nolan@mail.ie", "", "051 302 000", "085 119 4430", "18 Cork Road, Waterford", "X91 K2M6", "IE90AIBK93115277889900", "AIBKIE2D"],
  ["Darragh", "Kelly", "English", "darragh.kelly@mail.ie", "", "01 220 5000", "086 441 7785", "27 Manor Street, Dublin 7", "D07 W3H9", "IE44BOFI90001744556677", "BOFIIE2D"],
  ["Méabh", "Quinn", "English", "meabh.quinn@mail.ie", "", "091 742 000", "087 330 2219", "11 Dublin Road, Galway", "H91 T4N2", "IE17AIBK93115233445566", "AIBKIE2D"],
  ["Patrick", "Healy", "English", "patrick.healy@mail.ie", "", "01 220 7780", "086 909 1142", "4 Grangegorman Lower, Dublin 7", "D07 R1K5", "IE73PTSB99061288990011", "PTSBIE2D"],
];

const collegeContacts = [
  ["Siobhán", "Keane", "University College Cork", "siobhan.keane@ucc.ie", "021 490 3000", "087 100 2201"],
  ["Mark", "Doyle", "Technological University Dublin", "mark.doyle@tudublin.ie", "01 220 5000", "086 200 3310"],
  ["Nuala", "Brennan", "Dublin City University", "nuala.brennan@dcu.ie", "01 700 5000", "087 300 4412"],
  ["Aoife", "Collins", "Maynooth University", "aoife.collins@mu.ie", "01 708 3887", "086 400 5521"],
  ["Ciarán", "Walsh", "University of Limerick", "ciaran.walsh@ul.ie", "061 202 700", "087 500 6630"],
  ["Deirdre", "Hogan", "Munster Technological University", "deirdre.hogan@mtu.ie", "021 432 6100", "086 600 7741"],
  ["Emma", "Farrell", "Trinity College Dublin", "emma.farrell@tcd.ie", "01 896 1000", "087 700 8852"],
  ["Pádraig", "Lyons", "University of Galway", "padraig.lyons@universityofgalway.ie", "091 524 411", "086 800 9963"],
  ["Ruth", "Power", "South East Technological University", "ruth.power@setu.ie", "051 302 000", "087 110 1074"],
  ["Liam", "Burke", "Atlantic Technological University", "liam.burke@atu.ie", "091 742 000", "086 120 2185"],
  ["Helen", "Murphy", "Cork College of Commerce", "helen.murphy@corkcollegeofcommerce.ie", "021 422 2100", "087 130 3296"],
  ["Claire", "Donnelly", "St Mary's University College", "claire.donnelly@smucb.ac.uk", "028 9032 7678", "077 0091 4402"],
];

function applicant(index, row) {
  const [firstName, lastName, language, email, alternativeEmail, telephone, mobile, address, eircode, iban, bic] = row;
  return {
    contactId: `CON-${String(1001 + index).padStart(4, "0")}`,
    firstName,
    lastName,
    contactType: "Applicant",
    parentAccountName: "",
    email,
    alternativeEmail,
    telephone,
    mobile,
    address,
    eircode,
    language,
    iban,
    bic,
    status: "Active",
  };
}

function collegeContact(index, row) {
  const [firstName, lastName, parentAccountName, email, telephone, mobile] = row;
  return {
    contactId: `CON-${String(2001 + index).padStart(4, "0")}`,
    firstName,
    lastName,
    contactType: "College Contact",
    parentAccountName,
    email,
    alternativeEmail: "",
    telephone,
    mobile,
    address: "",
    eircode: "",
    language: "",
    iban: "",
    bic: "",
    status: "Active",
  };
}

export const mockContacts = [
  ...applicants.map((row, index) => applicant(index, row)),
  ...collegeContacts.map((row, index) => collegeContact(index, row)),
  {
    contactId: "CON-3001",
    firstName: "Owen",
    lastName: "Clarke",
    contactType: "Third-Party Contact",
    parentAccountName: "Irish Universities Association",
    email: "owen.clarke@iua.ie",
    alternativeEmail: "",
    telephone: "01 676 4948",
    mobile: "087 220 4408",
    address: "48 Merrion Square, Dublin 2",
    eircode: "D02 PK02",
    language: "",
    iban: "",
    bic: "",
    status: "Active",
  },
];

export function contactByName(name) {
  return mockContacts.find((contact) => fullName(contact) === name) ?? null;
}
