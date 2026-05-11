export default function Spinner({ size = 16, color = "#fff" }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      style={{ animation:"spin 0.7s linear infinite", display:"block", flexShrink:0 }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="3" strokeOpacity="0.25"/>
      <path d="M12 2a10 10 0 0 1 10 10" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}