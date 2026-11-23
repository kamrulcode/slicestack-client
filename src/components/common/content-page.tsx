import type { ReactNode } from "react";

export function ContentPage({
  title,
  intro,
  sections,
  children,
}: {
  title: string;
  intro: string;
  sections?: { heading: string; body: string }[];
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-heading text-[2.25rem] leading-tight font-bold tracking-tight text-foreground sm:text-[2.75rem]">
        {title}
      </h1>
      <p className="mt-3 text-base text-muted-foreground">{intro}</p>

      {sections ? (
        <div className="mt-9 flex flex-col gap-8">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
                {section.heading}
              </h2>
              <p className="mt-2.5 text-[15px] leading-7 text-muted-foreground sm:text-base">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      ) : null}

      {children ? <div className="mt-9">{children}</div> : null}
    </div>
  );
}
