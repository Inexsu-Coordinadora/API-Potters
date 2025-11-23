export function convertirFecha(date: string | Date | null): string {
  if (!date) return "";

  const fecha = date instanceof Date ? date : new Date(date);
  return fecha.toISOString().split("T")[0] || "";
}
