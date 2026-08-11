import { Hero } from "@/components/landing/Hero";
import { Novelty } from "@/components/landing/Novelty";
import { Synthesis } from "@/components/landing/Synthesis";
import { Contacts } from "@/components/landing/Contacts";

export default function Home() {
  return (
    <>
      <Hero />
      <Synthesis />
      <Novelty />
      <Contacts />
    </>
  );
}
