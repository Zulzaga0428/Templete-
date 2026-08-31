import type { StackFact, TemplateDetails as Details } from "@/lib/details";
import { format, type Dictionary } from "@/lib/i18n";

/**
 * The half of a template page that makes it worth reading: what the project
 * actually ships, and what its authors say it is for.
 *
 * Without this a page carries its title and a one-line description — around
 * seventeen words — which tells a reader nothing and gives a search engine
 * nothing to index.
 */
/**
 * A major version is only worth printing when it distinguishes anything.
 * "Next.js 16" says something; "Playwright 1" and "Lucide icons 0" say only
 * that those projects have never left 1.x and 0.x.
 */
function displayName(fact: StackFact): string {
  const major = Number(fact.version);
  return fact.version && major >= 2 ? `${fact.name} ${fact.version}` : fact.name;
}

function roleLabel(role: StackFact["role"], t: Dictionary["detail"]): string {
  const labels: Record<StackFact["role"], string> = {
    framework: t.roleFramework,
    styling: t.roleStyling,
    ui: t.roleUi,
    database: t.roleDatabase,
    auth: t.roleAuth,
    payments: t.rolePayments,
    testing: t.roleTesting,
    content: t.roleContent,
  };
  return labels[role];
}

export function TemplateDetails({
  details,
  sourceUrl,
  t,
}: {
  details: Details;
  sourceUrl: string;
  t: Dictionary["detail"];
}) {
  const hasStack = details.stack.length > 0;
  const hasProse = Boolean(details.summary) || details.features.length > 0;
  if (!hasStack && !hasProse) return null;

  // Group the stack by role so the page reads as a spec sheet rather than a
  // pile of package names.
  const byRole = new Map<StackFact["role"], StackFact[]>();
  for (const fact of details.stack) {
    const list = byRole.get(fact.role) ?? [];
    list.push(fact);
    byRole.set(fact.role, list);
  }

  return (
    <>
      {hasStack ? (
        <section className="mt-10 rounded-xl border border-line bg-raised p-5">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <h2 className="text-sm font-semibold">{t.whatsInside}</h2>
            {details.dependencyCount !== null ? (
              <span className="text-[12px] text-subtle">
                {format(t.dependencies, { count: details.dependencyCount })}
              </span>
            ) : null}
          </div>

          <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {[...byRole.entries()].map(([role, facts]) => (
              <div key={role} className="flex gap-3 text-[13px]">
                <dt className="w-24 shrink-0 text-subtle">{roleLabel(role, t)}</dt>
                <dd className="text-fg">
                  {facts.map(displayName).join(", ")}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {hasProse ? (
        <section className="mt-4 rounded-xl border border-line bg-raised p-5">
          <h2 className="text-sm font-semibold">{t.aboutTemplate}</h2>

          {details.summary ? (
            <p className="mt-3 text-[14px] leading-relaxed text-muted">{details.summary}</p>
          ) : null}

          {details.features.length > 0 ? (
            <>
              <h3 className="mt-5 text-[13px] font-medium text-fg">{t.features}</h3>
              <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                {details.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-[13px] leading-relaxed text-muted">
                    <span aria-hidden className="mt-[3px] text-accent">
                      ·
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {/* The words are the authors'. Say so, and link back. */}
          <p className="mt-5 border-t border-line pt-4 text-[11px] text-subtle">
            {t.summaryCredit}{" "}
            <a
              href={sourceUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="text-muted underline-offset-4 hover:underline"
            >
              {t.viewOnGitHub} →
            </a>
          </p>
        </section>
      ) : null}
    </>
  );
}
