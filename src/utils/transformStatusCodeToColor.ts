export default function transformStatusCodeToColor(statusCode: string) {
  const statusCodeInt = Number.parseInt(statusCode);
  const statusColor =
    !isNaN(statusCodeInt) && statusCodeInt > 99 && statusCodeInt < 400
      ? 'rgb(0, 255, 0)'
      : 'rgb(255, 0, 0)';
  return statusColor;
}
