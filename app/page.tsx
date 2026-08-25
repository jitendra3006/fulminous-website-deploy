import React from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TechPartnerIntro, TechPartnerStats } from "@/components/TechPartnerIntro";
import { Showcase } from "@/components/Showcase";
import { Partners } from "@/components/Partners";
import { Domains } from "@/components/Domains";
import { Industries } from "@/components/Industries";
import { FulminousAiSection } from "@/components/FulminousAiSection";
import { Testimonials } from "@/components/Testimonials";
import { Blogs } from "@/components/Blogs";
import { Cases } from "@/components/Cases";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        <div className="content-stack">
          <section className="tech-partner" aria-labelledby="tech-partner-title">
            <div className="tech-partner__inner">
              <TechPartnerIntro />
              <TechPartnerStats />
              <Showcase />
            </div>
          </section>

          <Partners />
          <Domains />
          {/* Sits between the tech stack and the industries, on request: the
              AI practice reads as the thing that stack is put to work on,
              before the page turns to who it is delivered for. */}
          <FulminousAiSection />
          <Industries />
          <Testimonials />
          <Cases />
          <Blogs />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
