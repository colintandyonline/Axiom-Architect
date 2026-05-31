import type { ReactNode } from "react";

const proposalFormCss = `
  main form[action="/api/client/proposal"] {
    gap: 2.4rem !important;
  }

  main form[action="/api/client/proposal"] > section {
    border-color: rgba(184, 239, 185, 0.58) !important;
    border-radius: 1.65rem !important;
    background:
      linear-gradient(180deg, rgba(12, 32, 16, 0.98), rgba(3, 12, 6, 0.99)) !important;
    box-shadow:
      0 24px 80px rgba(0, 0, 0, 0.34),
      inset 0 1px 0 rgba(184, 239, 185, 0.12) !important;
  }

  main form[action="/api/client/proposal"] > section > div:first-child {
    border-radius: 1.2rem !important;
    border: 1px solid rgba(158, 211, 159, 0.22) !important;
    background: rgba(158, 211, 159, 0.07) !important;
    padding: clamp(1rem, 2vw, 1.35rem) !important;
  }

  main form[action="/api/client/proposal"] > section > div:first-child p:not(:first-child) {
    color: rgba(242, 255, 242, 0.86) !important;
    font-size: 0.98rem !important;
    line-height: 1.8 !important;
  }

  main form[action="/api/client/proposal"] > section > div:last-child {
    gap: 1.2rem !important;
  }

  main form[action="/api/client/proposal"] label:not(:has(input[type="checkbox"])) {
    display: block;
    border: 1px solid rgba(158, 211, 159, 0.24);
    border-radius: 1.1rem;
    background: rgba(158, 211, 159, 0.075);
    padding: 1rem;
  }

  main form[action="/api/client/proposal"] label > span:first-child {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    color: #b8efb9 !important;
    font-size: 0.78rem !important;
    line-height: 1.35 !important;
    letter-spacing: 0.13em !important;
  }

  main form[action="/api/client/proposal"] label > span:nth-child(2) {
    color: rgba(242, 255, 242, 0.76) !important;
    font-size: 0.82rem !important;
    line-height: 1.7 !important;
  }

  main form[action="/api/client/proposal"] input:not([type="hidden"]):not([type="checkbox"]),
  main form[action="/api/client/proposal"] textarea,
  main form[action="/api/client/proposal"] select {
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

  main form[action="/api/client/proposal"] textarea {
    min-height: 13rem !important;
    padding-top: 1rem !important;
  }

  main form[action="/api/client/proposal"] select option {
    background: #f2fff2;
    color: #061009;
  }

  main form[action="/api/client/proposal"] input:not([type="hidden"])::placeholder,
  main form[action="/api/client/proposal"] textarea::placeholder {
    color: rgba(6, 16, 9, 0.56) !important;
    opacity: 1 !important;
  }

  main form[action="/api/client/proposal"] input:not([type="hidden"]):not([type="checkbox"]):focus,
  main form[action="/api/client/proposal"] textarea:focus,
  main form[action="/api/client/proposal"] select:focus {
    border-color: #ffffff !important;
    outline: 3px solid rgba(184, 239, 185, 0.5) !important;
    outline-offset: 2px !important;
    box-shadow:
      0 0 0 6px rgba(158, 211, 159, 0.16),
      0 18px 42px rgba(0, 0, 0, 0.28) !important;
  }

  main form[action="/api/client/proposal"] input[type="checkbox"] {
    border: 2px solid #9ed39f !important;
    background: #f2fff2 !important;
  }

  main form[action="/api/client/proposal"] button[type="submit"] {
    min-height: 3.8rem !important;
    border-radius: 999px !important;
    box-shadow: 0 18px 44px rgba(158, 211, 159, 0.18) !important;
  }

  @media (max-width: 720px) {
    main form[action="/api/client/proposal"] {
      gap: 1.4rem !important;
    }

    main form[action="/api/client/proposal"] > section {
      border-radius: 1.25rem !important;
    }

    main form[action="/api/client/proposal"] label:not(:has(input[type="checkbox"])) {
      padding: 0.85rem;
    }

    main form[action="/api/client/proposal"] input:not([type="hidden"]):not([type="checkbox"]),
    main form[action="/api/client/proposal"] textarea,
    main form[action="/api/client/proposal"] select {
      font-size: 1rem !important;
    }
  }
`;

export default function ClientProposalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: proposalFormCss }} />
      {children}
    </>
  );
}
