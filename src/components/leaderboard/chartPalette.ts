export const PALETTE = [
  "#6f93cf",
  "#e8924a",
  "#4cae86",
  "#c77dbb",
  "#e8c547",
  "#7eb8c9",
  "#d97a6c",
  "#8aa9df",
  "#a6d189",
  "#f5b078",
  "#9b8fd9",
];

export function colorFor(id: string, ids: string[]) {
  const i = ids.indexOf(id);
  return PALETTE[i >= 0 ? i % PALETTE.length : 0];
}
