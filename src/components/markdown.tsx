import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

/** Минимальная типографика markdown для теории и условий заданий. */
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn("text-sm leading-relaxed text-foreground/90", className)}>
      <ReactMarkdown
        components={{
          p: (p) => <p className="my-2 first:mt-0 last:mb-0" {...p} />,
          strong: (p) => <strong className="font-semibold text-white" {...p} />,
          em: (p) => <em className="text-muted" {...p} />,
          h1: (p) => <h1 className="mt-5 mb-2 text-lg font-bold text-white first:mt-0" {...p} />,
          h2: (p) => <h2 className="mt-5 mb-2 text-base font-bold text-white first:mt-0" {...p} />,
          h3: (p) => <h3 className="mt-4 mb-2 text-sm font-bold text-white first:mt-0" {...p} />,
          ul: (p) => <ul className="my-2 list-disc space-y-1 pl-5" {...p} />,
          ol: (p) => <ol className="my-2 list-decimal space-y-1 pl-5" {...p} />,
          li: (p) => <li className="pl-1" {...p} />,
          blockquote: (p) => (
            <blockquote
              className="my-3 rounded-r-md border-l-2 border-accent bg-surface-2/60 py-2 pl-3 pr-2 text-muted"
              {...p}
            />
          ),
          a: (p) => <a className="text-aqua underline underline-offset-2" target="_blank" {...p} />,
          code: (p) => {
            const { className: cls, children: kids } = p;
            const isBlock = /language-/.test(cls ?? "");
            if (isBlock) {
              return (
                <code className="block font-mono text-[13px] leading-relaxed text-foreground" {...p}>
                  {kids}
                </code>
              );
            }
            return (
              <code
                className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.9em] text-aqua"
                {...p}
              >
                {kids}
              </code>
            );
          },
          pre: (p) => (
            <pre
              className="my-3 overflow-x-auto rounded-lg border border-border-soft bg-[#0d1117] p-4"
              {...p}
            />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}