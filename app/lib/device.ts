export function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return (
    /Android|iPhone|iPad|iPod|webOS|BlackBerry|Opera Mini|IEMobile/i.test(
      navigator.userAgent,
    ) || window.innerWidth < 768
  );
}
