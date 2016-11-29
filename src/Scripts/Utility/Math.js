define('Math', [], {
  isNumeric: variable => !isNaN(parseFloat(variable)) && isFinite(variable),
  toRadians: degrees => (degrees * Math.PI) / 180,
  toDegrees: radians => (radians * 180) / Math.PI,
  TAU: 2 * Math.PI,
});
