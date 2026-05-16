type ProductVisualKind =
  | "workflow-audit"
  | "workflow-blueprint"
  | "custom-operating-pack"
  | "workflow-stewardship"
  | "departmental-ecosystem"
  | "architect-residency";

export function ProductSystemVisual({ kind }: { kind: ProductVisualKind }) {
  return (
    <div className="relative flex min-h-[210px] items-center justify-center overflow-hidden rounded-[1.5rem] border border-[#9ed39f]/48 bg-[#061008]/78 p-5 text-[#9ed39f] shadow-[inset_0_0_80px_rgba(158,211,159,0.05)] transition duration-200 group-hover:border-black/45 group-hover:bg-black/8 group-hover:text-black">
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] [background-size:34px_34px]" />
      <svg
        viewBox="0 0 420 260"
        className="relative h-full min-h-[178px] w-full max-w-[420px]"
        fill="none"
        aria-hidden="true"
      >
        {kind === "workflow-audit" ? <WorkflowAuditVisual /> : null}
        {kind === "workflow-blueprint" ? <WorkflowBlueprintVisual /> : null}
        {kind === "custom-operating-pack" ? <CustomOperatingPackVisual /> : null}
        {kind === "workflow-stewardship" ? <WorkflowStewardshipVisual /> : null}
        {kind === "departmental-ecosystem" ? <DepartmentalEcosystemVisual /> : null}
        {kind === "architect-residency" ? <ArchitectResidencyVisual /> : null}
      </svg>
    </div>
  );
}

function Frame() {
  return <rect x="44" y="28" width="332" height="204" rx="18" stroke="currentColor" strokeWidth="2" opacity="0.75" />;
}

function WorkflowAuditVisual() {
  return (
    <>
      <Frame />
      <rect x="108" y="48" width="204" height="164" rx="12" stroke="currentColor" strokeWidth="2.4" />
      {[82, 125, 168].map((y, index) => (
        <g key={y}>
          <rect x="132" y={y - 13} width="26" height="26" rx="4" stroke="currentColor" strokeWidth="2.4" />
          {index !== 1 ? <path d={`M138 ${y}l7 7 16-18`} stroke="currentColor" strokeWidth="2.6" /> : null}
          <path d={`M178 ${y - 5}h104M178 ${y + 13}h72`} stroke="currentColor" strokeWidth="2" opacity="0.8" />
        </g>
      ))}
    </>
  );
}

function WorkflowBlueprintVisual() {
  return (
    <>
      <Frame />
      <rect x="122" y="74" width="92" height="116" rx="8" stroke="currentColor" strokeWidth="2.2" opacity="0.66" />
      <rect x="158" y="96" width="92" height="116" rx="8" stroke="currentColor" strokeWidth="2.4" opacity="0.82" />
      <rect x="194" y="118" width="92" height="116" rx="8" stroke="currentColor" strokeWidth="2.8" />
      <path d="M88 116h34M88 146h34M88 176h34M286 154h52" stroke="currentColor" strokeWidth="2" opacity="0.75" />
      <circle cx="352" cy="154" r="12" stroke="currentColor" strokeWidth="3" />
      <path d="M211 152h52M211 176h40M211 200h70" stroke="currentColor" strokeWidth="2.1" opacity="0.85" />
    </>
  );
}

function CustomOperatingPackVisual() {
  return (
    <>
      <Frame />
      <circle cx="210" cy="130" r="78" stroke="currentColor" strokeWidth="2" />
      <circle cx="210" cy="130" r="48" stroke="currentColor" strokeWidth="2" opacity="0.75" />
      <circle cx="210" cy="130" r="18" stroke="currentColor" strokeWidth="3" />
      <path d="M210 52v156M132 130h156M155 75l110 110M265 75 155 185" stroke="currentColor" strokeWidth="1.6" opacity="0.72" />
      {["210,52", "288,130", "210,208", "132,130", "265,75", "155,75", "265,185", "155,185"].map((point) => {
        const [cx, cy] = point.split(",");
        return <circle key={point} cx={cx} cy={cy} r="7" fill="currentColor" />;
      })}
    </>
  );
}

function WorkflowStewardshipVisual() {
  return (
    <>
      <Frame />
      <rect x="104" y="62" width="212" height="136" rx="12" stroke="currentColor" strokeWidth="2.4" />
      <path d="M138 160c22 34 78 42 112 10 31-30 25-80-8-102M282 96c-18-30-67-42-103-20-38 24-45 76-16 111" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M252 62l-9 27 29-5M164 199l9-27-29 5" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M138 92h68M138 118h104M138 144h55M230 144h52" stroke="currentColor" strokeWidth="2" opacity="0.75" />
      <circle cx="282" cy="144" r="8" fill="currentColor" />
    </>
  );
}

function DepartmentalEcosystemVisual() {
  return (
    <>
      <Frame />
      <circle cx="210" cy="130" r="30" stroke="currentColor" strokeWidth="3" />
      <circle cx="210" cy="130" r="8" fill="currentColor" />
      {[
        [118, 76],
        [302, 76],
        [112, 184],
        [308, 184],
        [210, 52],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x - 34} y={y - 22} width="68" height="44" rx="8" stroke="currentColor" strokeWidth="2.4" />
          <path d={`M${x - 18} ${y - 4}h36M${x - 18} ${y + 10}h24`} stroke="currentColor" strokeWidth="1.8" opacity="0.7" />
          <path d={`M${x} ${y}L210 130`} stroke="currentColor" strokeWidth="2" opacity="0.62" />
        </g>
      ))}
      <path d="M118 76c44 0 48-24 92-24M302 76c-46 0-46-24-92-24M112 184c45 0 53 24 98 24M308 184c-48 0-50 24-98 24" stroke="currentColor" strokeWidth="1.8" opacity="0.58" />
    </>
  );
}

function ArchitectResidencyVisual() {
  return (
    <>
      <Frame />
      <rect x="160" y="72" width="100" height="116" rx="14" stroke="currentColor" strokeWidth="2.8" />
      <path d="M180 104h60M180 128h38M180 152h60" stroke="currentColor" strokeWidth="2" opacity="0.75" />
      {[
        [96, 76, "M130 92l30 24"],
        [324, 76, "M290 92l-30 24"],
        [96, 184, "M130 168l30-24"],
        [324, 184, "M290 168l-30-24"],
      ].map(([x, y, line]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x as number} cy={y as number} r="24" stroke="currentColor" strokeWidth="2.4" />
          <circle cx={x as number} cy={y as number} r="7" fill="currentColor" />
          <path d={line as string} stroke="currentColor" strokeWidth="2" opacity="0.68" />
        </g>
      ))}
      <path d="M210 54v18M210 188v24" stroke="currentColor" strokeWidth="2.4" opacity="0.72" />
      <circle cx="210" cy="42" r="12" stroke="currentColor" strokeWidth="2.6" />
      <circle cx="210" cy="224" r="12" stroke="currentColor" strokeWidth="2.6" />
    </>
  );
}
