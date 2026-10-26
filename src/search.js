// Former official names and common spellings, keyed by record id.
export const ALIASES = {
  OR: ['Orissa'],
  PY: ['Pondicherry'],
  UK: ['Uttaranchal'],
  JK: ['J&K'],
  AN: ['A&N'],
  DN: ['DNH'],
  DL: ['NCT', 'New Delhi'],
  CG: ['Chattisgarh'],
};

// Lower case, "&" read as "and", punctuation dropped, spaces collapsed
function normalise(text) {
  return text.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim();
}

// Filters items by query. Names and aliases match at the start of a word and come
// first; longer queries also match authority, phone, complaint types and notes.
// Queries of 3 characters or fewer match only an id, or the start of a name or alias.
export function searchAgencies(items, query) {
  const q = normalise(query);
  if (!q) return items;
  const named = [];
  const other = [];
  for (const item of items) {
    const names = [item.name, ...(ALIASES[item.id] || [])].map(normalise);
    if (q.length <= 3) {
      if (normalise(item.id) === q || names.some((name) => name.startsWith(q))) named.push(item);
    } else if (names.some((name) => ` ${name}`.includes(` ${q}`))) {
      named.push(item);
    } else if ([item.authority, item.phone, ...item.complaintTypes, item.notes || ''].some((field) => normalise(field).includes(q))) {
      other.push(item);
    }
  }
  return [...named, ...other];
}
