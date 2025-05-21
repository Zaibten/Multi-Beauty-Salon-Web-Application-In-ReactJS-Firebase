import React, { useState } from "react";

const faqs = [
  {
    question: "What causes acne?",
    answer:
      "Acne is typically caused by clogged pores due to excess oil, dead skin cells, bacteria, or hormonal changes. Diet, stress, and improper skincare can also contribute.",
  },
  {
    question: "How do I know my skin type?",
    answer:
      "Oily: Shiny, greasy appearance\nDry: Flaky, tight skin\nCombination: Oily T-zone, dry cheeks\nSensitive: Easily irritated or red\nNormal: Balanced oil and hydration",
  },
  {
    question: "Why do I keep getting pimples?",
    answer:
      "Pimples can be caused by clogged pores, excess oil production, bacteria, hormonal changes, or stress. Using the wrong skincare products can also worsen breakouts.",
  },
  {
    question: "What is the solution for oily skin?",
    answer:
      "Use a gel-based cleanser, oil-free moisturizer, and products with salicylic acid. Wash your face twice a day — but avoid overwashing, which can increase oil production.",
  },
  {
    question: "How can I reduce dark spots?",
    answer:
      "Use products with Vitamin C, niacinamide, and sunscreen daily. For faster results, gentle exfoliation with AHA/BHA serums at night can help.",
  },
  {
    question: "What’s the best moisturizer for dry skin?",
    answer:
      "Look for moisturizers with hyaluronic acid, ceramides, or glycerin. Avoid products with alcohol or fragrance if your skin is sensitive.",
  },
  {
    question: "What should a basic skincare routine look like?",
    answer:
      "🌞 Morning: Cleanser → Moisturizer → Sunscreen\n🌙 Night: Cleanser → Treatment (e.g., retinol, acne serum) → Moisturizer",
  },
  {
    question: "Is sunscreen really necessary?",
    answer:
      "Yes! Daily sunscreen (SPF 30 or higher) protects your skin from sun damage, premature aging, and dark spots — even indoors or on cloudy days.",
  },
  {
    question: "How can I treat acne scars?",
    answer:
      "Ingredients like retinol, niacinamide, AHAs (like glycolic acid), and BHA (like salicylic acid) help fade scars over time. Consistency is key.",
  },
  {
    question: "What ingredients should I look for in skincare?",
    answer:
      "Acne: Salicylic acid, benzoyl peroxide\nDryness: Hyaluronic acid, ceramides\nAging: Retinol, peptides, vitamin C\nDark spots: Niacinamide, kojic acid, arbutin",
  },
];

const Suggestion = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{ margin: 0, padding: 0, backgroundColor: "#fff", fontFamily: "Segoe UI, sans-serif" }}>
      <style>{`
        .faq-container {
          max-width: 800px;
          margin: 3rem auto;
          padding: 2rem;
          background-color: #fff;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(255, 105, 180, 0.2);
        }

        .faq-title {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 2rem;
          color: #e91e63;
        }

        .faq-item {
          border-bottom: 1px solid #f8bbd0;
          padding: 1rem 0;
          cursor: pointer;
          transition: background 0.3s;
        }

        .faq-item:hover {
          background-color: #fff0f5;
        }

        .faq-question {
          font-weight: 600;
          font-size: 1.1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #444;
        }

        .faq-answer {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: all 0.5s ease;
          color: #666;
          white-space: pre-wrap;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .faq-answer.open {
          max-height: 500px;
          opacity: 1;
          margin-top: 0.5rem;
        }

        .arrow {
          transition: transform 0.3s ease;
          color: #e91e63;
        }

        .arrow.open {
          transform: rotate(180deg);
        }

        .webview-wrapper {
          height: 100vh;
        }

        iframe {
          height: 100%;
          width: 100%;
          border: none;
        }
      `}</style>

      {/* WebView Section */}
      <div className="webview-wrapper">
        <iframe
          src="https://glamthegirlai.vercel.app/"
          title="WebView"
        />
      </div>

      {/* FAQ Section */}
      <div className="faq-container">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item" onClick={() => toggleFAQ(index)}>
            <div className="faq-question">
              {faq.question}
              <span className={`arrow ${openIndex === index ? "open" : ""}`}>▼</span>
            </div>
            <div className={`faq-answer ${openIndex === index ? "open" : ""}`}>{faq.answer}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suggestion;
