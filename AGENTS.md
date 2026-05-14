# AGENTS.md instructions for Axiom Architect

You are working on Axiom Architect.

Always read and follow this file before editing.

Project:
Axiom Architect
Repo: colintandyonline/Axiom-Architect
Production domain: https://axiom-architect.co
Related brand/site reference: https://axiom-studio.co

Core rule:
Work one focused change at a time. Do not refactor, redesign, rename, or restructure unrelated code.

Before changing files:
1. Inspect the relevant files.
2. Confirm the smallest safe change.
3. Check git status and protect existing user changes.
4. Do not guess missing context.

For code changes:
1. Change only the required file(s).
2. Run `npm run build`.
3. If build fails, stop and explain the exact error.
4. Commit only after the requested change is complete and the build passes.
5. Use a clear commit message.

Do not expose secrets.
Use environment variable names only.
Never commit `.env` files, tokens, credentials, private exports, API keys, Supabase service keys, Stripe secrets, Resend keys, or database dumps.

Current stack:
- Next.js App Router
- Vercel deployment
- Supabase connected through Vercel
- Resend connected and configured
- Stripe connected through Vercel/Supabase

Important implementation rule:
Do not initialize Supabase, Stripe, Resend, OpenAI, database clients, or other service SDKs at module scope. Use lazy server-side getters or route-level initialization so `next build` does not fail when runtime environment variables are unavailable.

Brand:
Customer-facing name is Axiom Architect.
Tagline: The architecture behind intelligent work.

Axiom brand relationship:
- Axiom Studio is the digital product/resource store: protocols, agent kits, workbooks, operating packs.
- Axiom Architect is the service/platform layer: workflow diagnostics, automation suitability, AI system design, and implementation blueprints.
- The two brands should feel connected, but Axiom Architect must not look like a copied Fourthwall shop page.

Design reference:
Use https://axiom-studio.co as the primary visual reference for brand language, color, typography direction, and technical atmosphere.

Match these Axiom Studio design qualities:
- Black or near-black backgrounds.
- Mint primary color: `#9ed39f`.
- White text: `#ffffff`.
- Technical grid systems.
- Thin mint outlines.
- Structured panels.
- Blueprint, radar, node, workflow, and architecture motifs.
- Calm premium technical feel.
- Strong uppercase headings.
- Clear spacing and professional hierarchy.

Do not blindly copy Axiom Studio assets:
- Do not use the Axiom Studio storefront/header image as the Axiom Architect hero.
- Do not use shop/product imagery as the main service identity unless explicitly requested.
- Do not use Fourthwall-specific UI patterns, badges, or store copy.
- Do not make the site feel like merchandise, a course page, or a generic SaaS template.

Axiom Architect visual direction:
Use custom Architect-specific visuals:
- Workflow blueprint diagrams.
- System architecture maps.
- Process routing lines.
- Node networks.
- Implementation gates.
- Diagnostic panels.
- Operating-system dashboards.

Tone:
Precise, calm, premium, useful, systems-focused, and professional.

Avoid:
- Hype.
- "AI magic."
- Generic productivity claims.
- Generic AI-course copy.
- Get-rich-with-AI framing.
- Placeholder copy.
- Admin/build-status copy.
- Vague automation promises.

Preferred language:
- Workflow architecture.
- Operating systems.
- Diagnostics.
- Automation suitability.
- Implementation blueprint.
- Review gates.
- Human-in-the-loop controls.
- AI-supported execution.
- Structured operating model.

Primary service:
Axiom Workflow Audit.

The first product flow should stay simple:
1. User learns what the audit does.
2. User pays through Stripe.
3. User submits a structured workflow intake.
4. Submission is stored in Supabase.
5. AI generates a diagnostic/blueprint.
6. A branded report/PDF is produced.
7. Resend emails status and delivery links.

Pages planned:
- Home
- Workflow Audit
- How It Works
- Pricing
- Intake / Submit Workflow
- Success / Confirmation
- Report / Blueprint
- About
- Contact / Support
- Privacy Policy
- Terms of Service
- Refund / Service Delivery Policy

Navigation target:
- Home
- Workflow Audit
- How It Works
- Pricing
- About
- Start Audit

Primary CTA:
Start Workflow Audit

Secondary CTA options:
- Diagnose My Workflow
- View Deliverables
- Request Early Access

Design quality requirements:
- Every public page must be mobile optimized.
- Text must not overflow containers on mobile or desktop.
- Buttons must have stable dimensions and readable labels.
- Avoid nested cards.
- Avoid decorative gradient blobs/orbs.
- Do not rely on Tailwind utility classes unless Tailwind is actually configured in this repo.
- If using plain CSS, keep class names semantic and scoped to the app structure.
- Use real images/assets only when they support the service story.

Asset rules:
- Store brand assets in `public/brand/`.
- Use versioned filenames for new generated assets unless replacing was explicitly requested.
- Prefer Axiom Architect-specific header and blueprint imagery.
- The current recommended Architect header asset is:
  `public/brand/axiom-architect-header-1920x1080-final.png`

Git rules:
- You may be in a dirty worktree.
- Never revert user changes unless explicitly requested.
- Keep Stripe, Supabase, Resend, and package changes separate from design-only commits unless the user asks to combine them.
- Before committing, run `git status`, review the diff, and run `npm run build`.

Deployment:
- Production is deployed through Vercel.
- Pushes to `main` should trigger production deployment once GitHub/Vercel is connected.
- Do not deploy production manually unless the user asks.

