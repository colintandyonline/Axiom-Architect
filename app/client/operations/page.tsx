import type { Metadata } from "next";
import Link from "next/link";
import { loadClientPortalData } from "../../../lib/axiom-client-portal-data";

export const metadata: Metadata = {
  title: "Operations | Axiom Architect Client Portal",
  description: "Client operations dashboard for current status, actions, approvals, and messages.",
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{
    message?: string | string[];
  }>;
};

type IconName = "activity" | "status" | "phase" | "next" | "latest" | "message" | "documents" | "deliverables";

function label(value: string | null | undefined) {
  return value ? value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : "Not set";
}

function date(value: string | null | undefined) {
  if (!value) return "No update yet";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function messageNotice(status?: string) {
  switch (status) {
    case "read":
      return {
        title: "Message marked as read.",
        text: "This update is now marked as read in your workspace.",
      };
    case "missing":
      return {
        title: "Message not found.",
        text: "The selected update could not be identified.",
      };
    case "failed":
      return {
        title: "Could not update message.",
        text: "The read status could not be saved. Please try again.",
      };
    case "customer":
      return {
        title: "Account not linked.",
        text: "This message could not be matched to your client account.",
      };
    default:
      return null;
  }
}

function Icon({ type, className = "" }: { type: IconName; className?: string }) {
  const shared = {
    className,
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (type === "activity") {
    return (
      <svg {...shared}>
        <path d="M4 12h4l2.2-6 3.6 12L16 12h4" />
      </svg>
    );
  }

  if (type === "status") {
    return (
      <svg {...shared}>
        <path d="M20 7 9.5 17.5 4 12" />
        <path d="M4 5h16v14H4z" />
      </svg>
    );
  }

  if (type === "phase") {
    return (
      <svg {...shared}>
        <path d="M4 6h7v7H4z" />
        <path d="M13 11h7v7h-7z" />
        <path d="M11 9h2" />
      </svg>
    );
  }

  if (type === "next") {
    return (
      <svg {...shared}>
        <path d="M5 12h13" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    );
  }

  if (type === "latest") {
    return (
      <svg {...shared}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v5l3 2" />
      </svg>
    );
  }

  if (type === "message") {
    return (
      <svg {...shared}>
        <path d="M5 6h14v10H8l-3 3z" />
        <path d="M8 9h8" />
        <path d="M8 12h5" />
      </svg>
    );
  }

  if (type === "documents") {
    return (
      <svg {...shared}>
        <path d="M7 3h7l4 4v14H7z" />
        <path d="M14 3v5h5" />
        <path d="M10 12h6" />
        <path d="M10 16h4" />
      </svg>
    );
  }

  return (
    <svg {...shared}>
      <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5z" />
      <path d="M4 7.5 12 12l8-4.5" />
      <path d="M12 12v9" />
    </svg>
  );
}

function StatusPill({ value }: { value: string | null | undefined }) {
  return (
    <span className="inline-flex border border-[#9ed39f]/40 px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.16em] text-[#9ed39f]">
      {label(value)}
    </span>
  );
}

function MarkReadForm({ messageId }: { messageId: string }) {
  return (
    <form action="/api/client/messages/mark-read" method="post">
      <input type="hidden" name="message_id" value={messageId} />
      <input type="hidden" name="return_to" value="/client/operations" />
      <button
        type="submit"
        className="inline-flex min-h-11 items-center justify-center border border-[#9ed39f] bg-[#9ed39f] px-4 text-[0.68rem] font-black uppercase tracking-[0.16em] text-black transition hover:bg-black hover:text-[#9ed39f]"
      >
        Mark as read
      </button>
    </form>
  );
}

export default async function ClientPortalOperationsPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  const notice = messageNotice(firstParam(params.message));
  const data = await loadClientPortalData("/client/operations");
  const workspace = data.workspace;
  const latest = data.latestActivity;
  const messages = data.messages.slice(0, 4);

  const stats: Array<{ name: string; value: string; text: string; icon: IconName }> = [
    {
      name: "Status",
      value: workspace ? label(workspace.status) : "Not started",
      text: workspace?.current_priority || "Current priority will appear here.",
      icon: "status",
    },
    {
      name: "Phase",
      value: workspace ? label(workspace.current_phase) : "Not started",
      text: workspace?.current_priority || "Current focus will appear here.",
      icon: "phase",
    },
    {
      name: "Next action",
      value: workspace?.next_client_action ? "Assigned" : "None",
      text: workspace?.next_client_action || "No action is needed from you right now.",
      icon: "next",
    },
    {
      name: "Latest",
      value: latest ? label(latest.activity_type) : "Waiting",
      text: latest?.title || "No update yet.",
      icon: "latest",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      {notice ? (
        <section className="bg-[#9ed39f] px-4 py-5 text-black sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[0.66rem] font-black uppercase tracking-[0.2em]">Message status</p>
              <h2 className="mt-1 text-2xl font-black uppercase tracking-[-0.04em]">{notice.title}</h2>
              <p className="mt-1 text-sm font-semibold leading-6 text-black/72">{notice.text}</p>
            </div>
            <Link
              href="/client/operations"
              className="inline-flex min-h-11 items-center justify-center border border-black px-4 text-[0.7rem] font-black uppercase tracking-[0.16em] text-black hover:bg-black hover:text-[#9ed39f]"
            >
              Clear
            </Link>
          </div>
        </section>
      ) : null}

      <section className="relative overflow-hidden border-b border-[#9ed39f]/20 bg-[radial-gradient(circle_at_top_right,rgba(158,211,159,0.16),#031007_34%,#000_78%)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(158,211,159,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(158,211,159,0.1)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="relative mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.9fr_0.48fr] lg:items-end">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              Operations
            </p>
            <h1 className="mt-6 text-[clamp(2.8rem,5.6vw,5.8rem)] font-black uppercase leading-[0.88] tracking-[-0.08em] text-white">
              Current work.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#e6f6e7]/74 sm:text-lg">
              Status, actions, approvals, and messages for this workspace.
            </p>
          </div>
          <aside className="border border-[#9ed39f]/35 bg-[#9ed39f]/10 p-5">
            <div className="mb-5 flex h-11 w-11 items-center justify-center border border-[#9ed39f] text-[#9ed39f]">
              <Icon type="activity" />
            </div>
            <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Current phase</p>
            <p className="mt-3 text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
              {workspace ? label(workspace.current_phase) : "Not started"}
            </p>
            <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72">
              {workspace?.next_client_action || "No action is needed from you right now."}
            </p>
          </aside>
        </div>
      </section>

      <section className="bg-[#9ed39f] px-4 py-10 text-black sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-6 lg:grid-cols-[0.42fr_1fr] lg:items-center">
          <div>
            <p className="inline-flex border border-black bg-black px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#9ed39f]">
              Client action
            </p>
            <h2 className="mt-5 text-[clamp(2rem,4vw,4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-black">
              {workspace?.next_client_action ? "Action assigned." : "No action needed."}
            </h2>
          </div>
          <p className="max-w-4xl text-base leading-8 text-black/76 sm:text-lg">
            {workspace?.next_client_action || "Axiom has not assigned a client action right now. Check back here when the workspace state changes."}
          </p>
        </div>
      </section>

      <section className="bg-[#020904] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <article key={stat.name} className="border border-[#9ed39f]/30 bg-black p-5">
              <span className="mb-5 flex h-11 w-11 items-center justify-center border border-[#9ed39f]/60 text-[#9ed39f]">
                <Icon type={stat.icon} />
              </span>
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{stat.name}</p>
              <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.05em] text-white">{stat.value}</h2>
              <p className="mt-4 text-sm leading-6 text-[#e6f6e7]/72">{stat.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-black px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.42fr_1fr]">
          <div>
            <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
              Status
            </p>
            <h2 className="mt-5 text-[clamp(2rem,4vw,4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
              At a glance.
            </h2>
          </div>
          <div className="grid gap-3">
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.28fr_1fr] md:items-center">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Workspace</p>
              <p className="text-sm font-semibold leading-7 text-white md:text-base">{workspace?.workspace_name || "No workspace yet"}</p>
            </div>
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.28fr_1fr] md:items-center">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Status</p>
              <p className="text-sm font-semibold leading-7 text-white md:text-base">{workspace ? label(workspace.status) : "Not started"}</p>
            </div>
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.28fr_1fr] md:items-center">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Phase</p>
              <p className="text-sm font-semibold leading-7 text-white md:text-base">{workspace ? label(workspace.current_phase) : "Not started"}</p>
            </div>
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.28fr_1fr] md:items-center">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Priority</p>
              <p className="text-sm font-semibold leading-7 text-white md:text-base">{workspace?.current_priority || "No current priority set."}</p>
            </div>
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.28fr_1fr] md:items-start">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Next action</p>
              <p className="text-sm font-semibold leading-7 text-white md:text-base">{workspace?.next_client_action || "No action is needed from you right now."}</p>
            </div>
            <div className="grid gap-2 border border-[#9ed39f]/20 bg-[#030804] p-4 md:grid-cols-[0.28fr_1fr] md:items-center">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">Updated</p>
              <p className="text-sm font-semibold leading-7 text-white md:text-base">{date(latest?.created_at || workspace?.updated_at)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#020904] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-5 border-b border-[#9ed39f]/20 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="inline-flex border border-[#9ed39f] bg-[#9ed39f] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.22em] text-black">
                Messages
              </p>
              <h2 className="mt-5 text-[clamp(2rem,4vw,4rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
                {messages.length ? "Recent notes." : "No messages yet."}
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/client/documents" className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#9ed39f]/56 px-5 text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] hover:bg-[#9ed39f] hover:text-black">
                <Icon type="documents" className="h-4 w-4" />
                Documents
              </Link>
              <Link href="/client/deliverables" className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#9ed39f]/56 px-5 text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#9ed39f] hover:bg-[#9ed39f] hover:text-black">
                <Icon type="deliverables" className="h-4 w-4" />
                Deliverables
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-4">
            {messages.length ? (
              messages.map((message) => (
                <article key={message.id} className="grid gap-4 border border-[#9ed39f]/24 bg-black p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <StatusPill value={message.status} />
                      <StatusPill value={message.author_type} />
                    </div>
                    <p className="mt-4 text-[0.66rem] font-black uppercase tracking-[0.18em] text-[#9ed39f]">{date(message.created_at)}</p>
                    <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.05em] text-white">{message.subject || "Workspace note"}</h3>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[#e6f6e7]/72">{message.body}</p>
                  </div>
                  {message.status === "sent" ? <MarkReadForm messageId={message.id} /> : null}
                </article>
              ))
            ) : (
              <article className="border border-[#9ed39f]/24 bg-black p-6">
                <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white">No messages.</h3>
                <p className="mt-3 text-sm leading-7 text-[#e6f6e7]/72">Nothing has been added here yet.</p>
              </article>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
