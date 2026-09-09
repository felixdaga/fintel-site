import { Hero } from "@/components/landing/Hero";
import { Resume } from "@/components/landing/Resume";
import { WhyResume } from "@/components/landing/WhyResume";
import { WhyEval } from "@/components/landing/WhyEval";
import { HowFintel } from "@/components/landing/HowFintel";

export default function Home() {
  return (
    <>
      <Hero />
      <Resume />
      <WhyResume />
      <WhyEval />
      <HowFintel />
    </>
  );
}
