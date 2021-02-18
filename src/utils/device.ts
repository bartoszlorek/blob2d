export function isTouchDevice() {
  return Boolean('ontouchstart' in window || navigator.maxTouchPoints);
}
