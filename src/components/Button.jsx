import Spinner from "./Spinner";

export default function Button({
  onClick,
  loading   = false,
  disabled  = false,
  children,
  variant   = "primary",   // "primary" | "secondary" | "danger"
  fullWidth = false,
  style     = {},
}) {
  const base = {
    display:      "flex",
    alignItems:   "center",
    justifyContent:"center",
    gap:          8,
    width:        fullWidth ? "100%" : "auto",
    padding:      "11px 20px",
    border:       "none",
    borderRadius: "var(--radius-sm)",
    fontSize:     14,
    fontWeight:   600,
    fontFamily:   "'DM Sans', sans-serif",
    cursor:       loading || disabled ? "not-allowed" : "pointer",
    opacity:      loading || disabled ? 0.65 : 1,
    transition:   "opacity 0.2s, transform 0.1s",
    ...style,
  };

  const variants = {
    primary:   { background:"var(--green)",   color:"#fff"              },
    secondary: { background:"var(--surface2)", color:"var(--text-muted)", border:"1px solid var(--border)" },
    danger:    { background:"#FEE2E2",         color:"#B91C1C"           },
  };

  return (
    <button
      onClick={!loading && !disabled ? onClick : undefined}
      style={{ ...base, ...variants[variant] }}
      onMouseEnter={e => { if (!loading && !disabled) e.currentTarget.style.transform = "scale(1.01)"; }}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
    >
      {loading && <Spinner size={15} color={variant === "primary" ? "#fff" : "var(--text-muted)"} />}
      {loading ? "Loading..." : children}
    </button>
  );
}