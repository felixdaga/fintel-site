import type { Metadata } from "next";
import { ABOUT_COPY } from "@/components/about-us/about_texts";
import { Marked } from "@/components/landing/Mark";
import { HEADLINE, PAGE_GUTTER, PAGE_PAD, PAGE_TITLE } from "@/components/landing/whyEvalData";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: ABOUT_COPY.meta.title,
  description: ABOUT_COPY.meta.description,
  alternates: {
    canonical: `${SITE_URL}/about-us`,
  },
};

export default function AboutPage() {
  return (
    <section className="bg-bg">
      <div className={`${PAGE_PAD} py-12 sm:py-20`}>
        <div className={`${PAGE_GUTTER} mx-auto max-w-3xl`}>
          <h1 className={`text-center ${PAGE_TITLE}`}>
            {ABOUT_COPY.title}
          </h1>

          <div className="mt-16 space-y-16 sm:mt-20 sm:space-y-20">
          {ABOUT_COPY.sections.map((section) => (
            <div key={section.title}>
              <h2 className={HEADLINE}>
                <Marked text={section.title} />
              </h2>
              <div className="mt-8 space-y-6">
                {section.paragraphs.map((p) => (
                  <p
                    key={p}
                    className="text-base leading-relaxed text-text-soft sm:text-lg"
                  >
                    <Marked text={p} />
                  </p>
                ))}
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
