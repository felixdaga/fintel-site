import { Hero } from "@/components/landing/Hero";
import { Questions } from "@/components/landing/Questions";
import { Novelty } from "@/components/landing/Novelty";
import { Synthesis } from "@/components/landing/Synthesis";
import { CTA } from "@/components/landing/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Questions />
      <Synthesis />
      <Novelty />
      <CTA />
    </>
  );
}
