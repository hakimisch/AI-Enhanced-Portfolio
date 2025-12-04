export default function convertToPlainObject(doc) {
  return JSON.parse(JSON.stringify(doc));
}