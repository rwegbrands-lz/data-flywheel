export const CATEGORIES = [
  { id: "bso", name: "Business Structure & Ownership", color: "#7C3AED", light: "#F5F3FF" },
  { id: "bc",  name: "Business Compliance",            color: "#FF6B2C", light: "#FFF0E8" },
  { id: "bat", name: "Bookkeeping, Accounting & Tax",  color: "#047857", light: "#ECFDF5" },
  { id: "fcc", name: "Financing, Credit & Cashflow",   color: "#B45309", light: "#FFFBEB" },
  { id: "hr",  name: "Workforce & HR",                 color: "#BE123C", light: "#FFF1F2" },
  { id: "ip",  name: "IP & Brand Protection",          color: "#0E7490", light: "#ECFEFF" },
  { id: "ct",  name: "Contracts",                      color: "#6D28D9", light: "#F5F3FF" },
  { id: "ms",  name: "Multi-state Expansion",          color: "#92400E", light: "#FFFBEB" },
  { id: "ins", name: "Insurance",                      color: "#475569", light: "#F8FAFC" },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));
