import { BlurReveal } from "@kit/components/motion/BlurReveal";
import { SectionHeader } from "@kit/components/section/SectionHeader";
import { Button } from "@kit/components/ui/Button";
import copy from "@content/copy.json";

type BookItem = (typeof copy.books.items)[number];

const DATA_SOURCE = "projects/booquarium/src/components/sections/Books.tsx";

export function Books() {
  const { books } = copy;

  return (
    <section
      id="books"
      data-component="Books"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-border,color-text,color-text-muted,font-serif,radius-window"
      className="relative w-full bg-[var(--color-bg)]"
      style={{ paddingTop: "clamp(80px, 12vh, 160px)", paddingBottom: "clamp(80px, 12vh, 160px)" }}
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 md:px-8 lg:px-10">
        <SectionHeader
          eyebrow={books.eyebrow}
          headline={books.headline}
          align="stacked"
          headingLevel="h2"
          dataSource={DATA_SOURCE}
          className="mb-12 lg:mb-16"
        />

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
          {books.items.map((book, i) => (
            <BlurReveal key={book.title} delay={i * 0.07}>
              <BookCard book={book} />
            </BlurReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookCard({ book }: { book: BookItem }) {
  const isComingSoon = book.status === "coming_soon";

  return (
    <article className="flex flex-col gap-4">
      {/* Flat cover */}
      <div
        className="relative w-full overflow-hidden rounded-[12px]"
        style={{
          aspectRatio: "2/3",
          backgroundColor: book.cover_color,
          border: isComingSoon ? "1px dashed var(--color-border)" : "none",
          opacity: isComingSoon ? 0.5 : 1,
        }}
      />

      {/* Meta */}
      <div className="flex flex-col gap-2">
        <h3
          className="font-serif font-medium text-[var(--color-text)]"
          style={{ fontSize: "16px", lineHeight: 1.2, letterSpacing: "-0.01em" }}
        >
          {book.title}
        </h3>

        <p
          className="font-sans font-medium uppercase tracking-[0.06em] text-[var(--color-text-subtle)]"
          style={{ fontSize: "11px" }}
        >
          {book.genre} · {book.year}
        </p>

        <p
          className="font-sans leading-[1.5] text-[var(--color-text-muted)]"
          style={{ fontSize: "14px" }}
        >
          {book.tagline}
        </p>

        <div className="mt-1">
          {book.cta ? (
            <Button href={book.cta.href} variant="secondary" size="md">
              {book.cta.label}
            </Button>
          ) : (
            <span className="inline-flex items-center gap-2 font-sans font-medium text-[var(--color-text-subtle)]" style={{ fontSize: "13px" }}>
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: "var(--color-accent)" }}
              />
              Coming soon
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
