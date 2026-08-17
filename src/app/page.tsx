import ScrollyCanvas from "@/components/ScrollyCanvas";
import Projects from "@/components/Projects";
import SkillsPhysics from "@/components/SkillsPhysics";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative w-full bg-[#121212] selection:bg-white selection:text-[#121212]">
      <ScrollyCanvas />
      <Projects />
      <SkillsPhysics />
      <Footer />
    </main>
  );
}
