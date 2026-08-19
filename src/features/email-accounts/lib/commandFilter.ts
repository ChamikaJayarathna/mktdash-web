export const substringFilter = (itemValue: string, search: string): number =>
  itemValue.includes(search.trim().toLowerCase()) ? 1 : 0;

export const memberSearchValue = (
  name: string,
  email: string,
  role: string,
): string => `${name} ${email} ${role}`.toLowerCase();
