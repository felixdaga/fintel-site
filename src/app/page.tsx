import { Hero } from "@/components/landing/Hero";
import { WhyEval } from "@/components/landing/WhyEval";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Novelty } from "@/components/landing/Novelty";
import { HowFintel } from "@/components/landing/HowFintel";

export default function Home() {
  return (
    <>
      <Hero />
      <WhyEval />
      <HowItWorks />
      <Novelty />
      <HowFintel />
    </>
  );
}
