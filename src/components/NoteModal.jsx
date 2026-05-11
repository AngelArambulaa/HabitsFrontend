import { useState } from "react";

export default function NoteModal({ habit, onConfirm, onSkip, onClose }) {
  const [note, setNote] = useState("");

  return (
    <div style={{
      position:   "fixed", inset:0, zIndex:1000,
      background: "rgba(0,0,0,0.4)",
      display:    "flex", alignItems:"center", justifyContent:"center",
      padding:    "1rem",
    }}
      onClick={onClose}
    >
      <div style={{
        background:   "var(--surface)",
        borderRadius: "var(--radius)",
        padding:      "1.5rem",
        width:        "100%", maxWidth:400,
        boxShadow:    "0 8px 40px rgba(0,0,0,0.18)",
        border:       "1px solid var(--border)",
      }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"1rem" }}>
          <span style={{ fontSize:24 }}>{habit.icon}</span>
          <div>
            <div style={{ fontSize:15, fontWeight:600, color:"var(--text)" }}>{habit.name}</div>
            <div style={{ fontSize:11, color:"var(--text-hint)" }}>Add a note for today (optional)</div>
          </div>
        </div>

        {/* Note input */}
        <textarea
          autoFocus
          rows={3}
          placeholder="How did it go? (e.g. Ran 5km, felt great!)"
          value={note}
          onChange={e => setNote(e.target.value)}
          style={{
            width:        "100%",
            border:       "1.5px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            padding:      "10px 14px",
            fontFamily:   "'DM Sans', sans-serif",
            fontSize:     14,
            background:   "var(--bg)",
            color:        "var(--text)",
            outline:      "none",
            resize:       "none",
            marginBottom: 12,
            display:      "block",
          }}
          onFocus={e  => e.target.style.borderColor = "var(--green)"}
          onBlur={e   => e.target.style.borderColor = "var(--border)"}
        />

        {/* Buttons */}
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={onSkip} style={{
            flex:1, padding:"10px",
            border:       "1.5px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            background:   "none",
            color:        "var(--text-muted)",
            fontSize:     13, fontWeight:500,
            fontFamily:   "'DM Sans',sans-serif",
            cursor:       "pointer",
          }}>
            Skip note
          </button>
          <button onClick={() => onConfirm(note)} style={{
            flex:2, padding:"10px",
            border:       "none",
            borderRadius: "var(--radius-sm)",
            background:   "var(--green)",
            color:        "#fff",
            fontSize:     13, fontWeight:600,
            fontFamily:   "'DM Sans',sans-serif",
            cursor:       "pointer",
          }}>
            ✓ Mark done
          </button>
        </div>
      </div>
    </div>
  );
}