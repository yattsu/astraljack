export function FormatValue({ value, currency = false }) {
  function formatNumber(number) {
    return new Intl.NumberFormat("en-US", {}).format(number);
  }
  return <>{formatNumber(value)}</>;
}
