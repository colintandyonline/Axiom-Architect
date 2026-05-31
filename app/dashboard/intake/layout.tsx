import type { ReactNode } from "react";

const intakeFormCss = `
  main > section:first-child {
    padding-bottom: clamp(3rem, 6vw, 5.5rem) !important;
  }

  main > section:first-child > div > div {
    align-items: stretch !important;
  }

  main > section:first-child aside {
    display: grid !important;
    gap: 1.1rem !important;
    align-self: stretch !important;
    border-color: rgba(184, 239, 185, 0.64) !important;
    border-radius: 1.5rem !important;
    background:
      linear-gradient(180deg, rgba(184, 239, 185, 0.14), rgba(8, 25, 12, 0.95)) !important;
    padding: clamp(1.25rem, 2vw, 1.6rem) !important;
    box-shadow:
      0 24px 70px rgba(0, 0, 0, 0.28),
      inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
  }

  main > section:first-child aside > p,
  main > section:first-child aside > div {
    display: none !important;
  }

  main > section:first-child aside::before {
    content: "How to complete this intake";
    display: inline-flex;
    width: fit-content;
    border: 1px solid #9ed39f;
    background: #9ed39f;
    padding: 0.62rem 0.82rem;
    color: #061009;
    font-size: 0.66rem;
    font-weight: 900;
    letter-spacing: 0.2em;
    line-height: 1;
    text-transform: uppercase;
  }

  main > section:first-child aside::after {
    content: "Start with the workflow as it really happens today.\A\AInclude the people, tools, handoffs, approvals, delays, repeated checks, and places where work gets stuck.\A\AYou do not need perfect wording. Specific examples, rough timings, and messy details are more useful than polished summary copy.";
    white-space: pre-line;
    color: rgba(242, 255, 242, 0.88);
    font-size: clamp(1rem, 1.45vw, 1.18rem);
    line-height: 1.75;
  }

  main form[action="/api/intake"] {
    gap: 2.4rem !important;
  }

  main form[action="/api/intake"] > section {
    border-color: rgba(184, 239, 185, 0.58) !important;
    border-radius: 1.65rem !important;
    background:
      linear-gradient(180deg, rgba(12, 32, 16, 0.98), rgba(3, 12, 6, 0.99)) !important;
    box-shadow:
      0 24px 80px rgba(0, 0, 0, 0.34),
      inset 0 1px 0 rgba(184, 239, 185, 0.12) !important;
  }

  main form[action="/api/intake"] > section > div:first-child {
    border-radius: 1.2rem;
    border: 1px solid rgba(158, 211, 159, 0.22);
    background: rgba(158, 211, 159, 0.07);
    padding: clamp(1rem, 2vw, 1.35rem);
  }

  main form[action="/api/intake"] > section > div:first-child p:not(:first-child) {
    color: rgba(242, 255, 242, 0.86) !important;
    font-size: 0.98rem !important;
    line-height: 1.8 !important;
  }

  main form[action="/api/intake"] > section > div:last-child {
    gap: 1.2rem !important;
  }

  main form[action="/api/intake"] label {
    display: block;
    border: 1px solid rgba(158, 211, 159, 0.24);
    border-radius: 1.1rem;
    background: rgba(158, 211, 159, 0.075);
    padding: 1rem;
  }

  main form[action="/api/intake"] label > span {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    color: #b8efb9 !important;
    font-size: 0.78rem !important;
    line-height: 1.35 !important;
    letter-spacing: 0.13em !important;
  }

  main form[action="/api/intake"] input:not([type="hidden"]),
  main form[action="/api/intake"] textarea,
  main form[action="/api/intake"] select {
    min-height: 3.45rem;
    border: 2px solid rgba(184, 239, 185, 0.95) !important;
    border-radius: 0.85rem !important;
    background: #f2fff2 !important;
    color: #061009 !important;
    font-size: 1rem !important;
    line-height: 1.65 !important;
    caret-color: #061009;
    box-shadow:
      0 14px 36px rgba(0, 0, 0, 0.22),
      inset 0 0 0 1px rgba(6, 16, 9, 0.08) !important;
  }

  main form[action="/api/intake"] textarea {
    min-height: 13rem !important;
    padding-top: 1rem !important;
  }

  main form[action="/api/intake"] input:not([type="hidden"])::placeholder,
  main form[action="/api/intake"] textarea::placeholder {
    color: rgba(6, 16, 9, 0.56) !important;
    opacity: 1 !important;
  }

  main form[action="/api/intake"] input:not([type="hidden"]):focus,
  main form[action="/api/intake"] textarea:focus,
  main form[action="/api/intake"] select:focus {
    border-color: #ffffff !important;
    outline: 3px solid rgba(184, 239, 185, 0.5) !important;
    outline-offset: 2px !important;
    box-shadow:
      0 0 0 6px rgba(158, 211, 159, 0.16),
      0 18px 42px rgba(0, 0, 0, 0.28) !important;
  }

  main form[action="/api/intake"] input[readonly],
  main form[action="/api/intake"] textarea[readonly],
  main form[action="/api/intake"] select[readonly] {
    opacity: 0.78 !important;
    background: rgba(242, 255, 242, 0.72) !important;
  }

  main form[action="/api/intake"] button[type="submit"],
  main form[action="/api/intake"] a[href*="/dashboard/report"] {
    min-height: 3.8rem !important;
    border-radius: 999px !important;
    box-shadow: 0 18px 44px rgba(158, 211, 159, 0.18) !important;
  }

  @media (max-width: 720px) {
    main form[action="/api/intake"] {
      gap: 1.4rem !important;
    }

    main form[action="/api/intake"] > section {
      border-radius: 1.25rem !important;
    }

    main form[action="/api/intake"] label {
      padding: 0.85rem;
    }

    main form[action="/api/intake"] input:not([type="hidden"]),
    main form[action="/api/intake"] textarea,
    main form[action="/api/intake"] select {
      font-size: 1rem !important;
    }
  }
`;

export default function WorkflowIntakeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: intakeFormCss }} />
      {children}
    </>
  );
}
