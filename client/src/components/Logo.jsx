function Logo({ className = "" }) {
  return (
    <span className={`logo-lockup ${className}`} aria-label="ArogyaMitra">
      <svg
        className="logo-mark"
        viewBox="0 0 80 80"
        role="img"
        aria-hidden="true"
      >
        <circle cx="40" cy="40" r="36" fill="#ecfdf5" />
        <path
          d="M22 46c6 10 15 16 18 16s12-6 18-16c4-7 4-17-2-23-5-5-13-5-16 1-3-6-11-6-16-1-6 6-6 16-2 23Z"
          fill="#0f766e"
        />
        <path
          d="M25 42h9l4 4h6l4-4h7"
          fill="none"
          stroke="#ffffff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
        <path
          d="M21 48l10-8 9 7-7 8c-2 2-5 2-7 0l-5-5c-.6-.6-.6-1.5 0-2Z"
          fill="#f3c7a6"
          stroke="#9a5b3f"
          strokeWidth="1.5"
        />
        <path
          d="M59 48l-10-8-9 7 7 8c2 2 5 2 7 0l5-5c.6-.6.6-1.5 0-2Z"
          fill="#f0b88f"
          stroke="#8a4d34"
          strokeWidth="1.5"
        />
        <rect
          x="27"
          y="28"
          width="26"
          height="17"
          rx="6"
          fill="#ffffff"
          stroke="#2563eb"
          strokeWidth="2"
        />
        <path
          d="M31 34h18M31 39h18"
          stroke="#93c5fd"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          d="M27 35c-5 0-7-3-8-6M53 35c5 0 7-3 8-6"
          fill="none"
          stroke="#2563eb"
          strokeLinecap="round"
          strokeWidth="2"
        />
      </svg>
      <span className="logo-text">ArogyaMitra</span>
    </span>
  );
}

export default Logo;
