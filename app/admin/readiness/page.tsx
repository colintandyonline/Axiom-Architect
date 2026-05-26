import type { Metadata } from "next";
import type { ReactNode } from "react";
import { requireAxiomAdmin } from "../../../lib/axiom-admin";
import { supabaseAdminFetch } from "../../../lib/axiom-admin-dashboard";
import { AdminSection, AdminShell } from "../../../components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Launch Readiness | Axiom Architect Admin",
  description:
    "Internal launch-readiness checks for Axiom Architect products, intake schemas, checkout, report generation, and delivery dependencies.",
};

export const dynamic = "force-dynamic";

type ProductRow = {
  id: string;
  slug: string | null;
  active: boolean | null;
};

type IntakeSchemaRow = {
  id: string;
  product_id: string | null;
  version: string | number | null;
  active: boolean | null;
  schema_json: unknown;
};

type ReadinessLevel = "ready" | "attention" | "critical";

type RequiredProduct = {
  label: string;
  slug: string;
  priceEnv: string;
  mode: "payment" | "subscription";
};

type EnvCheck = {
  label: string;
  names: string[];
  required: boolean;
  helper: string;
};

const requiredProducts: RequiredProduct[] = [
  {
    label: "Workflow Audit",
    slug: "workflow-audit",
    priceEnv: "STRIPE_PRICE_WORKFLOW_AUDIT",
    mode: "payment",
  },
  {
    label: "Workflow Blueprint",
    slug: "workflow-blueprint",
    priceEnv: "STRIPE_PRICE_WORKFLOW_BLUEPRINT",
    mode: "payment",
  },
  {
    label: "Custom Operating Pack",
    slug: "custom-operating-pack",
    priceEnv: "STRIPE_PRICE_CUSTOM_OPERATING_PACK",
    mode: "payment",
  },
  {
    label: "Workflow Stewardship",
    slug: "workflow-stewardship",
    priceEnv: "STRIPE_PRICE_WORKFLOW_STEWARDSHIP",
    mode: "subscription",
  },
  {
    label: "Departmental Ecosystem",
    slug: "departmental-ecosystem",
    priceEnv: "STRIPE_PRICE_DEPARTMENTAL_ECOSYSTEM",
    mode: "payment",
  },
  {
    label: "Enterprise Architecture System",
    slug: "architect-residency",
    priceEnv: "STRIPE_PRICE_ENTERPRISE_ARCHITECTURE_SYSTEM",
    mode: "payment",
  },
];

const envGroups: { title: string; checks: EnvCheck[] }[] = [
  {
    title: "Supabase",
    checks: [
      {
        label: "Supabase project URL",
        names: ["NEXT_PUBLIC_SUPABASE_URL"],
        required: true,
        helper: "Required for auth, REST reads, dashboard, admin, webhook setup, and report operations.",
      },
      {
        label: "Supabase public key",
        names: ["NEXT_PUBLIC_SUPABASE_ANON_KEY", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"],
        required: true,
        helper: "Either public key name can satisfy client and auth flows.",
      },
      {
        label: "Supabase service role",
        names: ["SUPABASE_SERVICE_ROLE_KEY"],
        required: true,
        helper: "Required for server-side admin, webhook, intake, and report writes.",
      },
    ],
  },
  {
    title: "Stripe",
    checks: [
      {
        label: "Stripe secret key",
        names: ["STRIPE_SECRET_KEY"],
        required: true,
        helper: "Required to create Checkout sessions.",
      },
      {
        label: "Stripe webhook secret",
        names: ["STRIPE_WEBHOOK_SECRET"],
        required: true,
        helper: "Required to verify checkout completion events.",
      },
      ...requiredProducts.map((product) => ({
        label: `${product.label} price`,
        names: [product.priceEnv],
        required: true,
        helper: `Required for ${product.slug} checkout in ${product.mode} mode.`,
      })),
    ],
  },
  {
    title: "Resend",
    checks: [
      {
        label: "Resend API key",
        names: ["RESEND_API_KEY"],
        required: true,
        helper: "Required for contact responses and report delivery emails.",
      },
      {
        label: "Resend from email",
        names: ["RESEND_FROM_EMAIL"],
        required: true,
        helper: "Required sender identity for operational delivery emails.",
      },
    ],
  },
  {
    title: "OpenAI and report generation",
    checks: [
      {
        label: "OpenAI API key",
        names: ["OPENAI_API_KEY"],
        required: true,
        helper: "Required for admin-triggered report generation.",
      },
      {
        label: "OpenAI report model",
        names: ["OPENAI_REPORT_MODEL"],
        required: false,
        helper: "Optional override for the report generation model.",
      },
      {
        label: "Report generation token",
        names: ["AXIOM_REPORT_GENERATION_TOKEN"],
        required: true,
        helper: "Required for protected report-generation calls.",
      },
    ],
  },
  {
    title: "App URL and admin",
    checks: [
      {
        label: "App URL",
        names: ["APP_URL"],
        required: true,
        helper: "Used for redirects, dashboard links, and delivery URLs.",
      },
      {
        label: "Public app URL",
        names: ["NEXT_PUBLIC_APP_URL"],
        required: false,
        helper: "Helpful fallback for public URLs and client-facing links.",
      },
      {
        label: "Admin emails",
        names: ["AXIOM_ADMIN_EMAILS"],
        required: false,
        helper: "Recommended for explicit production admin access control.",
      },
    ],
  },
];

function isEnvPresent(names: string[]) {
  return names.some((name) => Boolean(process.env[name]));
}

function getEnvState(check: EnvCheck) {
  const present = isEnvPresent(check.names);
  const level: ReadinessLevel = present ? "ready" : check.required ? "critical" : "attention";

  return {
    ...check,
    present,
    level,
  };
}

function getSchemaStages(schemaJson: unknown) {
  if (!schemaJson || typeof schemaJson !== "object" || Array.isArray(schemaJson)) {
    return null;
  }

  const maybeSchema = schemaJson as { stages?: unknown };
  return Array.isArray(maybeSchema.stages) ? maybeSchema.stages : null;
}

function getBadgeClasses(level: ReadinessLevel) {
  if (level === "ready") {
    return "border-[#9ed39f] bg-[#9ed39f] text-black";
  }

  if (level === "attention") {
    return "border-yellow-300/60 bg-yellow-300/12 text-yellow-100";
  }

  return "border-red-300/70 bg-red-400/12 text-red-100";
}

function StatusBadge({ level, children }: { level: ReadinessLevel; children: ReactNode }) {
  return (
    <span
      className={`inline-flex w-fit items-center justify-center border px-2.5 py-1 text-[0.58rem] font-black uppercase tracking-[0.16em] ${getBadgeClasses(
        level,
      )}`}
    >
      {children}
    </span>
  );
}

function ReadinessCard({
  title,
  value,
  helper,
  level,
}: {
  title: string;
  value: string;
  helper: string;
  level: ReadinessLevel;
}) {
  return (
    <article className="rounded-[1.25rem] border border-[#9ed39f]/24 bg-[#030804] p-5">
      <StatusBadge level={level}>{level === "ready" ? "Ready" : level === "attention" ? "Needs attention" : "Critical"}</StatusBadge>
      <h2 className="mt-5 text-xl font-black uppercase leading-tight tracking-[-0.04em] text-white">{title}</h2>
      <p className="mt-3 text-3xl font-black uppercase tracking-[-0.06em] text-[#9ed39f]">{value}</p>
      <p className="mt-3 text-sm leading-6 text-white/64">{helper}</p>
    </article>
  );
}

function EnvGroupTable({ title, checks }: { title: string; checks: ReturnType<typeof getEnvState>[] }) {
  return (
    <div className="overflow-hidden border border-[#9ed39f]/20 bg-black/30">
      <div className="border-b border-[#9ed39f]/20 bg-[#9ed39f]/10 px-4 py-3">
        <h3 className="text-lg font-black uppercase tracking-[-0.03em] text-white">{title}</h3>
      </div>
      <div className="divide-y divide-[#9ed39f]/12">
        {checks.map((check) => (
          <div key={`${title}-${check.label}`} className="grid gap-3 px-4 py-4 lg:grid-cols-[0.65fr_0.8fr_0.35fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.08em] text-white">{check.label}</p>
              <p className="mt-1 text-xs leading-5 text-white/56">{check.helper}</p>
            </div>
            <code className="break-words border border-[#9ed39f]/16 bg-black px-3 py-2 text-xs leading-5 text-[#9ed39f]">
              {check.names.join(" or ")}
            </code>
            <StatusBadge level={check.level}>{check.present ? "Present" : "Missing"}</StatusBadge>
          </div>
        ))}
      </div>
    </div>
  );
}

async function getReadinessData() {
  const productSlugs = requiredProducts.map((product) => product.slug).join(",");
  const products =
    (await supabaseAdminFetch<ProductRow[]>(
      `axiom_products?select=id,slug,active&slug=in.(${productSlugs})&limit=20`,
    )) || [];

  const productIds = products.map((product) => product.id).filter(Boolean);
  const schemas =
    productIds.length > 0
      ? (await supabaseAdminFetch<IntakeSchemaRow[]>(
          `axiom_product_intake_schemas?select=id,product_id,version,active,schema_json&product_id=in.(${productIds.join(
            ",",
          )})&limit=50`,
        )) || []
      : [];

  const productChecks = requiredProducts.map((requiredProduct) => {
    const product = products.find((item) => item.slug === requiredProduct.slug);
    const found = Boolean(product);
    const active = product?.active === true;
    const level: ReadinessLevel = found && active ? "ready" : "critical";

    return {
      ...requiredProduct,
      product,
      found,
      active,
      level,
    };
  });

  const schemaChecks = productChecks.map((productCheck) => {
    const productSchemas = productCheck.product
      ? schemas.filter((schema) => schema.product_id === productCheck.product?.id)
      : [];
    const schema = productSchemas.find((item) => item.active === true) || productSchemas[0] || null;
    const found = Boolean(schema);
    const active = schema?.active === true;
    const stages = schema ? getSchemaStages(schema.schema_json) : null;
    const hasSchemaJson = Boolean(schema?.schema_json);
    const hasStages = Boolean(stages && stages.length > 0);
    const level: ReadinessLevel = found && active && hasSchemaJson && hasStages ? "ready" : "critical";

    return {
      productLabel: productCheck.label,
      productSlug: productCheck.slug,
      productId: productCheck.product?.id || null,
      schema,
      found,
      active,
      hasSchemaJson,
      hasStages,
      stageCount: stages?.length || 0,
      level,
    };
  });

  const envChecks = envGroups.map((group) => ({
    ...group,
    checks: group.checks.map(getEnvState),
  }));

  const missingCriticalEnv = envChecks.some((group) =>
    group.checks.some((check) => check.required && !check.present),
  );
  const missingSupportingEnv = envChecks.some((group) =>
    group.checks.some((check) => !check.required && !check.present),
  );
  const hasProductBlockers = productChecks.some((check) => check.level === "critical");
  const hasSchemaBlockers = schemaChecks.some((check) => check.level === "critical");

  const overallLevel: ReadinessLevel =
    hasProductBlockers || hasSchemaBlockers || missingCriticalEnv
      ? "critical"
      : missingSupportingEnv
        ? "attention"
        : "ready";

  return {
    productChecks,
    schemaChecks,
    envChecks,
    overallLevel,
    missingCriticalEnv,
    missingSupportingEnv,
    hasProductBlockers,
    hasSchemaBlockers,
  };
}

export default async function AdminReadinessPage() {
  const { adminEmail } = await requireAxiomAdmin();
  const readiness = await getReadinessData();

  const productReadyCount = readiness.productChecks.filter((check) => check.level === "ready").length;
  const schemaReadyCount = readiness.schemaChecks.filter((check) => check.level === "ready").length;
  const allEnvChecks = readiness.envChecks.flatMap((group) => group.checks);
  const envReadyCount = allEnvChecks.filter((check) => check.present).length;
  const envTotalCount = allEnvChecks.length;

  return (
    <AdminShell
      adminEmail={adminEmail}
      eyebrow="Launch control"
      title="Launch readiness checks."
      intro="This internal page checks the live dependencies that must be in place before paid customers move through checkout, intake, report generation, and delivery."
      activePath="/admin/readiness"
    >
      <section className="bg-[#9ed39f] px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-5 lg:grid-cols-4">
          <ReadinessCard
            title="Overall launch state"
            value={
              readiness.overallLevel === "ready"
                ? "Ready"
                : readiness.overallLevel === "attention"
                  ? "Check"
                  : "Blocked"
            }
            helper="Uses product rows, intake schemas, and required environment names. Values are never displayed."
            level={readiness.overallLevel}
          />
          <ReadinessCard
            title="Products"
            value={`${productReadyCount}/${readiness.productChecks.length}`}
            helper="Required active product rows in axiom_products."
            level={productReadyCount === readiness.productChecks.length ? "ready" : "critical"}
          />
          <ReadinessCard
            title="Schemas"
            value={`${schemaReadyCount}/${readiness.schemaChecks.length}`}
            helper="Required active intake schemas with usable stages."
            level={schemaReadyCount === readiness.schemaChecks.length ? "ready" : "critical"}
          />
          <ReadinessCard
            title="Environment"
            value={`${envReadyCount}/${envTotalCount}`}
            helper="Required and supporting env names only. Secret values stay hidden."
            level={readiness.missingCriticalEnv ? "critical" : readiness.missingSupportingEnv ? "attention" : "ready"}
          />
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-8">
          <AdminSection eyebrow="Supabase products" title="Required product rows">
            <div className="overflow-x-auto border border-[#9ed39f]/20">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead className="bg-[#9ed39f]/12 text-[0.64rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
                  <tr>
                    <th className="px-4 py-3">Package</th>
                    <th className="px-4 py-3">Slug</th>
                    <th className="px-4 py-3">Mode</th>
                    <th className="px-4 py-3">Product ID</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#9ed39f]/12">
                  {readiness.productChecks.map((check) => (
                    <tr key={check.slug} className="align-top">
                      <td className="px-4 py-4 font-black uppercase text-white">{check.label}</td>
                      <td className="px-4 py-4 text-[#9ed39f]">{check.slug}</td>
                      <td className="px-4 py-4 text-white/70">{check.mode}</td>
                      <td className="px-4 py-4 text-white/60">{check.product?.id || "—"}</td>
                      <td className="px-4 py-4">
                        <StatusBadge level={check.level}>
                          {check.found && check.active ? "Found active" : check.found ? "Inactive" : "Missing"}
                        </StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AdminSection>

          <AdminSection eyebrow="Supabase schemas" title="Required intake schema rows">
            <div className="overflow-x-auto border border-[#9ed39f]/20">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead className="bg-[#9ed39f]/12 text-[0.64rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
                  <tr>
                    <th className="px-4 py-3">Package</th>
                    <th className="px-4 py-3">Product ID</th>
                    <th className="px-4 py-3">Version</th>
                    <th className="px-4 py-3">Schema JSON</th>
                    <th className="px-4 py-3">Stages</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#9ed39f]/12">
                  {readiness.schemaChecks.map((check) => (
                    <tr key={check.productSlug} className="align-top">
                      <td className="px-4 py-4">
                        <p className="font-black uppercase text-white">{check.productLabel}</p>
                        <p className="mt-1 text-xs text-[#9ed39f]">{check.productSlug}</p>
                      </td>
                      <td className="px-4 py-4 text-white/60">{check.productId || "—"}</td>
                      <td className="px-4 py-4 text-white/70">{check.schema?.version ?? "—"}</td>
                      <td className="px-4 py-4 text-white/70">{check.hasSchemaJson ? "Present" : "Missing"}</td>
                      <td className="px-4 py-4 text-white/70">{check.hasStages ? `${check.stageCount} stages` : "Missing"}</td>
                      <td className="px-4 py-4">
                        <StatusBadge level={check.level}>
                          {check.found && check.active && check.hasSchemaJson && check.hasStages
                            ? "Ready"
                            : check.found
                              ? "Needs schema"
                              : "Missing"}
                        </StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AdminSection>

          <AdminSection eyebrow="Environment" title="Required runtime configuration">
            <div className="grid gap-5">
              {readiness.envChecks.map((group) => (
                <EnvGroupTable key={group.title} title={group.title} checks={group.checks} />
              ))}
            </div>
          </AdminSection>

          <AdminSection eyebrow="Operator note" title="What this page does not do">
            <div className="grid gap-5 lg:grid-cols-3">
              {[
                [
                  "No secret exposure",
                  "The page only checks whether env names are present. It never renders API keys, tokens, URLs with credentials, or secret values.",
                ],
                [
                  "No seed creation",
                  "This is a read-only launch check. It does not insert products, schemas, customers, orders, reports, files, or deliverables.",
                ],
                [
                  "No checkout simulation",
                  "Stripe webhook delivery, Supabase writes, OpenAI generation, and Resend delivery still need one live test-mode journey.",
                ],
              ].map(([title, text]) => (
                <article key={title} className="border border-[#9ed39f]/20 bg-black/36 p-5">
                  <h3 className="text-xl font-black uppercase tracking-[-0.04em] text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/66">{text}</p>
                </article>
              ))}
            </div>
          </AdminSection>
        </div>
      </section>
    </AdminShell>
  );
}
