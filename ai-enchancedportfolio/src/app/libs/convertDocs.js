// lib/convertDocs.js
export function convertDoc(doc) {
  return {
    ...doc,
    _id: doc._id.toString(),
    createdAt: doc.createdAt?.toISOString() || null,
    updatedAt: doc.updatedAt?.toISOString() || null,
  };
}