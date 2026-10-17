import { Layout } from "@/components/layout/layout";
import { Hero } from "@/components/ui/hero";
import { GradeSection } from "@/components/ui/grade-section";
import { ExperimentsPreview } from "@/components/ui/experiments-preview";
import { AcademicCredits } from "@/components/ui/academic-credits";
import { HomeExperienceGate } from "@/components/intro/home-experience-gate";
import { PageEntranceMotion } from "@/components/ui/page-entrance-motion";

export default function Home() {
  return (
    <HomeExperienceGate>
      <Layout>
        <PageEntranceMotion>
          <Hero />
          <GradeSection />
          <ExperimentsPreview />
          <AcademicCredits />
        </PageEntranceMotion>
      </Layout>
    </HomeExperienceGate>
  );
}
