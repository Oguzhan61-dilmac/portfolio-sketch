import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Journey from "@/components/Journey";
import Achievements from "@/components/Achievements";
import TechStack from "@/components/TechStack";
import Projects from "@/components/Projects";
import Notes from "@/components/Notes";
import Contact from "@/components/Contact";
import { getProjects } from "@/lib/github";
import { getPosts } from "@/lib/medium";
import { MEDIUM_USERNAME } from "@/lib/content";

// Projeler GitHub'dan sunucuda çekilir; sayfa saatte bir yeniden üretilir (ISR).
export const revalidate = 3600;

export default async function Home() {
  const [{ projects, source }, posts] = await Promise.all([getProjects(), getPosts()]);
  const mediumUrl = MEDIUM_USERNAME ? `https://medium.com/@${MEDIUM_USERNAME.replace(/^@/, "")}` : null;

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Journey />
        <Achievements />
        <TechStack />
        <Projects projects={projects} source={source} />
        <Notes posts={posts} mediumUrl={mediumUrl} />
        <Contact />
      </main>
    </>
  );
}
