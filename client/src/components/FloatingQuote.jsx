import { useMemo, useState } from "react";

const quotes = [
  "A calm mind is part of good medicine.",
  "Small healthy choices add up quietly.",
  "Rest is care, not a reward.",
  "Drink water, breathe slowly, keep going.",
  "Your body keeps score of kindness too.",
  "A short walk can reset a long day.",
  "Prevention is the gentlest form of care.",
  "Good health grows from steady habits.",
  "Listen to your body before it has to shout.",
  "Healing begins with attention.",
  "Sleep is your daily repair system.",
  "Take care of today; tomorrow will borrow strength from it.",
];

function pickQuote(previousQuote) {
  if (quotes.length === 1) return quotes[0];

  let nextQuote = quotes[Math.floor(Math.random() * quotes.length)];

  while (nextQuote === previousQuote) {
    nextQuote = quotes[Math.floor(Math.random() * quotes.length)];
  }

  return nextQuote;
}

function FloatingQuote() {
  const initialQuote = useMemo(() => pickQuote(), []);
  const [quote, setQuote] = useState(initialQuote);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <aside className="floating-quote" aria-label="Healthy quote">
      <div>
        <span className="floating-quote__label">Healthy thought</span>
        <p>{quote}</p>
      </div>
      <div className="floating-quote__actions">
        <button
          type="button"
          onClick={() => setQuote((current) => pickQuote(current))}
          aria-label="Show another healthy quote"
        >
          New
        </button>
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Hide healthy quote"
        >
          x
        </button>
      </div>
    </aside>
  );
}

export default FloatingQuote;
