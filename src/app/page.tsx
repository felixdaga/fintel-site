import { Hero } from "@/components/landing/Hero";
import { Questions } from "@/components/landing/Questions";
import { Novelty } from "@/components/landing/Novelty";
import { Synthesis } from "@/components/landing/Synthesis";
import { Contacts } from "@/components/landing/Contacts";

export default function Home() {
  return (
    <>
      <Hero />
      <Questions />
      <Synthesis />
      <Novelty />
      <Contacts />
    </>
  );
}
