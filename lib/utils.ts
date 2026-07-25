export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} · ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
}

export function generateId(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function maskCardNumber(last4: string) {
  return `•••• •••• •••• ${last4}`;
}

export function generateCardNumber() {
  const last4 = Math.floor(1000 + Math.random() * 9000).toString();
  return last4;
}

export function generateAccountNumber() {
  return Math.floor(1000000000 + Math.random() * 8999999999).toString();
}

export function clsx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
