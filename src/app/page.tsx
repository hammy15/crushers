"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Users,
  Target,
  Zap,
  TrendingUp,
  MapPin,
  ChevronRight,
  Check,
  Menu,
  X,
  Upload,
  QrCode,
  Smartphone,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-orange-400 flex items-center justify-center relative overflow-hidden">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="relative z-10">
                <circle cx="12" cy="8" r="5" stroke="white" strokeWidth="2.5" fill="none" />
                <path d="M12 13 L8 22 L12 19 L16 22 L12 13Z" fill="white" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>
            <span className="text-xl font-black tracking-tight">CRUSHERS</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted hover:text-foreground transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm text-muted hover:text-foreground transition-colors">Pricing</a>
            <a href="#facility" className="text-sm text-muted hover:text-foreground transition-colors">Visit Us</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted hover:text-foreground transition-colors px-4 py-2"
            >
              Log In
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-white bg-gradient-to-r from-accent to-orange-500 px-5 py-2.5 rounded-full hover:shadow-lg hover:shadow-accent/25 transition-all"
            >
              Start Free
            </Link>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden border-t border-border bg-white px-6 py-4 space-y-3"
          >
            <a href="#features" className="block text-sm py-2">Features</a>
            <a href="#how-it-works" className="block text-sm py-2">How It Works</a>
            <a href="#pricing" className="block text-sm py-2">Pricing</a>
            <a href="#facility" className="block text-sm py-2">Visit Us</a>
            <Link href="/dashboard" className="block text-sm font-semibold text-white bg-accent text-center px-5 py-3 rounded-full mt-3">
              Start Free
            </Link>
          </motion.div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
        {/* Background — subtle course green feel */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-emerald-50/40 to-accent/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-green-50/30 to-accent/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-transparent to-emerald-50/20 blur-3xl" />
        </div>

        <motion.div
          className="max-w-7xl mx-auto px-6 relative"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <div className="max-w-3xl">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-1.5 mb-6">
              <MapPin className="w-3.5 h-3.5" />
              Now open in St. George, Utah &middot; 3 TrackMan Bays
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-6">
              Crush<br />
              <span className="text-gradient">Your Game.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted max-w-lg mb-8 leading-relaxed">
              See exactly how golfers like you got better. TrackMan data meets
              peer intelligence — your fastest path to lower scores.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 text-base font-semibold text-white bg-gradient-to-r from-accent to-orange-500 px-8 py-4 rounded-full hover:shadow-xl hover:shadow-accent/25 transition-all group"
              >
                Try the Demo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 text-base font-semibold text-foreground bg-white border border-border px-8 py-4 rounded-full hover:bg-surface-hover transition-colors"
              >
                See How It Works
              </a>
            </motion.div>
          </div>

          {/* Hero Stats */}
          <motion.div
            variants={fadeUp}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { label: "Active Members", value: "847", sub: "and growing" },
              { label: "Avg. Improvement", value: "4.2", sub: "strokes in 3 months" },
              { label: "Sessions Tracked", value: "12K+", sub: "and counting" },
              { label: "Peer Matches", value: "2,400+", sub: "connections made" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl border border-border p-5 stat-card"
              >
                <p className="text-3xl md:text-4xl font-black text-gradient">{stat.value}</p>
                <p className="text-sm font-semibold mt-1">{stat.label}</p>
                <p className="text-xs text-muted">{stat.sub}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">
              Why Crushers
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tight">
              Your data. Their path.<br />Your breakthrough.
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: BarChart3,
                title: "TrackMan Analytics",
                description:
                  "40+ data points per shot. Ball speed, spin rate, launch angle, club path — every metric that matters, tracked and trended.",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Users,
                title: "Peer Matching",
                description:
                  "Get matched with golfers who share your build, swing speed, and weaknesses — then see exactly what they did to improve.",
                color: "from-accent to-orange-500",
              },
              {
                icon: Target,
                title: "Improvement Paths",
                description:
                  "AI-generated practice plans built from real peer data. Not generic tips — specific drills that worked for golfers like you.",
                color: "from-emerald-500 to-teal-500",
              },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                className="bg-white rounded-3xl border border-border p-8 hover:shadow-lg transition-shadow group"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">
              How It Works
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tight mb-16">
              Three ways in.<br />One goal: lower scores.
            </motion.h2>

            <motion.div variants={stagger} className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Upload,
                  step: "01",
                  title: "Upload Your Data",
                  description:
                    "Export your TrackMan CSV from any session and drop it in. We parse all 40+ parameters automatically.",
                },
                {
                  icon: QrCode,
                  step: "02",
                  title: "Scan at the Bay",
                  description:
                    "Scan the QR code at any of our 3 bays in St. George. Your session streams directly to your profile.",
                },
                {
                  icon: Smartphone,
                  step: "03",
                  title: "Manual Entry",
                  description:
                    "No TrackMan? Enter your key stats manually. We'll still match you with peers and build your plan.",
                },
              ].map((item) => (
                <motion.div key={item.step} variants={fadeUp} className="relative">
                  <div className="text-7xl font-black text-accent/10 mb-4">{item.step}</div>
                  <div className="flex items-center gap-3 mb-3">
                    <item.icon className="w-5 h-5 text-accent" />
                    <h3 className="text-xl font-bold">{item.title}</h3>
                  </div>
                  <p className="text-muted leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* The Crushers Difference */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">
                The Crushers Difference
              </p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                Stop guessing.<br />Start matching.
              </h2>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white rounded-3xl border border-border overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-border">
                  <p className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Traditional Approach</p>
                  <div className="space-y-4">
                    {[
                      "Generic YouTube tips",
                      "One-size-fits-all lessons",
                      "No data, just feelings",
                      "Practice without direction",
                      "Improve alone",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3 text-muted">
                        <X className="w-4 h-4 text-red-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-8 md:p-12 bg-gradient-to-br from-accent/[0.02] to-orange-50/50">
                  <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-4">The Crushers Way</p>
                  <div className="space-y-4">
                    {[
                      "Matched with golfers who share your exact profile",
                      "See what specifically worked for people like you",
                      "40+ TrackMan data points per shot",
                      "AI practice plans from real peer improvement data",
                      "Community of golfers on the same journey",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-accent" />
                        </div>
                        <span className="font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Pricing</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                Pick your path.
              </h2>
              <p className="text-muted mt-4 max-w-md mx-auto">Start free. Upgrade when you&apos;re ready to get serious.</p>
            </motion.div>

            <motion.div variants={stagger} className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  name: "Free",
                  price: "$0",
                  period: "forever",
                  description: "Get started with basic tracking",
                  features: [
                    "5 sessions / month",
                    "Basic shot tracking",
                    "Club averages",
                    "1 peer match",
                  ],
                  cta: "Start Free",
                  highlighted: false,
                },
                {
                  name: "Crusher",
                  price: "$12",
                  period: "/ month",
                  description: "Full analytics + peer matching",
                  features: [
                    "Unlimited sessions",
                    "All 40+ TrackMan metrics",
                    "Full peer matching",
                    "AI improvement plans",
                    "Strokes Gained analysis",
                    "Progress tracking",
                    "CSV upload",
                  ],
                  cta: "Start Crushing",
                  highlighted: true,
                },
                {
                  name: "Pro",
                  price: "$29",
                  period: "/ month",
                  description: "For competitive players & coaches",
                  features: [
                    "Everything in Crusher",
                    "Advanced peer filtering",
                    "Coach dashboard",
                    "Video attachment",
                    "Custom drill library",
                    "Priority matching",
                    "API access",
                  ],
                  cta: "Go Pro",
                  highlighted: false,
                },
              ].map((tier) => (
                <motion.div
                  key={tier.name}
                  variants={fadeUp}
                  className={`rounded-3xl border p-8 relative ${
                    tier.highlighted
                      ? "border-accent bg-gradient-to-b from-accent/[0.03] to-white shadow-xl shadow-accent/10"
                      : "border-border bg-white"
                  }`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold text-white bg-accent px-4 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-lg font-bold">{tier.name}</h3>
                  <p className="text-sm text-muted mt-1">{tier.description}</p>
                  <div className="mt-4 mb-6">
                    <span className="text-4xl font-black">{tier.price}</span>
                    <span className="text-muted text-sm ml-1">{tier.period}</span>
                  </div>
                  <div className="space-y-3 mb-8">
                    {tier.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-accent shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/dashboard"
                    className={`block text-center font-semibold py-3 rounded-full transition-all ${
                      tier.highlighted
                        ? "bg-gradient-to-r from-accent to-orange-500 text-white hover:shadow-lg hover:shadow-accent/25"
                        : "bg-foreground/5 text-foreground hover:bg-foreground/10"
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Facility Tier */}
            <motion.div variants={fadeUp} className="mt-8 max-w-5xl mx-auto">
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-10 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <p className="text-sm font-semibold text-accent-light uppercase tracking-wider mb-1">For Facilities</p>
                  <h3 className="text-2xl font-bold mb-2">Crushers for Your Range</h3>
                  <p className="text-slate-300 max-w-md">
                    Give your members a reason to come back. White-label Crushers for your facility with custom branding and bay integration.
                  </p>
                </div>
                <a
                  href="mailto:hello@crushers.golf"
                  className="shrink-0 inline-flex items-center gap-2 bg-white text-foreground font-semibold px-6 py-3 rounded-full hover:bg-slate-100 transition-colors"
                >
                  Contact Sales
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Facility */}
      <section id="facility" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Our Facility</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                Come crush it in person.
              </h2>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white rounded-3xl border border-border overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-8 md:p-12">
                  <div className="flex items-center gap-2 text-emerald-700 mb-4">
                    <MapPin className="w-5 h-5" />
                    <span className="font-semibold">St. George, Utah</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">3 TrackMan Bays</h3>
                  <p className="text-muted leading-relaxed mb-8">
                    State-of-the-art TrackMan simulators in the heart of Southern Utah&apos;s
                    golf country. Book a bay, scan in, and every shot feeds your Crushers profile automatically.
                  </p>

                  <div className="space-y-4">
                    {[
                      { label: "Hours", value: "Mon-Sat 7am - 10pm, Sun 8am - 8pm" },
                      { label: "Bays", value: "3 TrackMan 4 Simulators" },
                      { label: "Rate", value: "$45/hr or included with membership" },
                      { label: "Location", value: "St. George, UT 84770" },
                    ].map((detail) => (
                      <div key={detail.label} className="flex items-start gap-3">
                        <span className="text-sm font-semibold text-muted w-16 shrink-0">{detail.label}</span>
                        <span className="text-sm">{detail.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex gap-3">
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-accent px-6 py-3 rounded-full hover:bg-accent-dark transition-colors"
                    >
                      Book a Bay
                    </Link>
                    <a
                      href="tel:+14355551234"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-foreground bg-foreground/5 px-6 py-3 rounded-full hover:bg-foreground/10 transition-colors"
                    >
                      Call Us
                    </a>
                  </div>
                </div>

                {/* Course-feel visual */}
                <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 flex items-center justify-center p-12 min-h-[300px] relative overflow-hidden">
                  {/* Subtle course texture */}
                  <div className="absolute inset-0 opacity-30" style={{
                    backgroundImage: `radial-gradient(circle at 20% 80%, rgba(34,197,94,0.15) 0%, transparent 50%),
                                     radial-gradient(circle at 80% 20%, rgba(132,204,22,0.1) 0%, transparent 50%),
                                     radial-gradient(circle at 50% 50%, rgba(16,185,129,0.08) 0%, transparent 60%)`
                  }} />
                  <div className="text-center relative">
                    <div className="w-20 h-20 rounded-full bg-white/80 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-100 animate-pulse-ring">
                      <MapPin className="w-8 h-8 text-emerald-600" />
                    </div>
                    <p className="font-bold text-lg text-emerald-900">St. George, Utah</p>
                    <p className="text-sm text-emerald-700/70">Red rock country meets golf tech</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,87,34,0.15),transparent_60%)]" />
            <div className="relative">
              <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-black tracking-tight mb-4">
                Ready to crush it?
              </motion.h2>
              <motion.p variants={fadeUp} className="text-lg text-slate-300 max-w-md mx-auto mb-8">
                Join hundreds of golfers already using Crushers to find their fastest path to lower scores.
              </motion.p>
              <motion.div variants={fadeUp}>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 text-base font-semibold text-white bg-gradient-to-r from-accent to-orange-500 px-10 py-4 rounded-full hover:shadow-xl hover:shadow-accent/30 transition-all group"
                >
                  Start Free — No Credit Card
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-orange-400 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="5" stroke="white" strokeWidth="2.5" fill="none" />
                    <path d="M12 13 L8 22 L12 19 L16 22 L12 13Z" fill="white" />
                  </svg>
                </div>
                <span className="text-lg font-black">CRUSHERS</span>
              </div>
              <p className="text-sm text-muted">
                Data-driven golf improvement through peer matching and TrackMan analytics.
              </p>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">Product</p>
              <div className="space-y-2">
                <a href="#features" className="block text-sm text-muted hover:text-foreground">Features</a>
                <a href="#pricing" className="block text-sm text-muted hover:text-foreground">Pricing</a>
                <Link href="/dashboard" className="block text-sm text-muted hover:text-foreground">Dashboard</Link>
              </div>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">Facility</p>
              <div className="space-y-2">
                <a href="#facility" className="block text-sm text-muted hover:text-foreground">Visit Us</a>
                <a href="#facility" className="block text-sm text-muted hover:text-foreground">Book a Bay</a>
                <a href="tel:+14355551234" className="block text-sm text-muted hover:text-foreground">Contact</a>
              </div>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">Legal</p>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-muted hover:text-foreground">Privacy</a>
                <a href="#" className="block text-sm text-muted hover:text-foreground">Terms</a>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted">&copy; {new Date().getFullYear()} Crushers Golf. All rights reserved.</p>
            <div className="flex items-center gap-2 text-xs text-muted">
              <TrendingUp className="w-3 h-3" />
              Powered by TrackMan data
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
