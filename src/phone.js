// Records may list several numbers separated by ';' or '/'; dial only the first.
export function telHref(phone) {
  const digits = phone.split(/[;/]/)[0].replace(/[^0-9+]/g, '');
  return digits ? `tel:${digits}` : '#';
}
