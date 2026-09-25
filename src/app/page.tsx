import { Hero } from "@/components/landing/Hero";
import { Resume } from "@/components/landing/Resume";
import { WhyEval } from "@/components/landing/WhyEval";
import { HowFintel } from "@/components/landing/HowFintel";

export default function Home() {
  return (
    <>
      <Hero />
      <Resume />
      <WhyEval />
      <HowFintel />
    </>
  );
}
