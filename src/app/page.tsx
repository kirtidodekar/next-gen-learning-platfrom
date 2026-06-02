"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Sparkles,
  BookOpen,
  BarChart3,
  Award,
  Brain,
  Users,
  ArrowRight,
  CheckCircle2,
  Star,
  GraduationCap,
  Clock,
  TrendingUp,
  ChevronRight,
  Play,
  Menu,
  X,
} from "lucide-react";

// ── Animated Counter ──────────────────────────────────────────
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ── Feature Card ──────────────────────────────────────────────
function FeatureCard({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur-sm transition-colors hover:border-violet/30 hover:bg-white/[0.07]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet/5 to-cyan/5 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative z-10">
        <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-violet/20 to-indigo/20 p-3">
          <Icon className="size-6 text-violet-300" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}

// ── Testimonial Card ──────────────────────────────────────────
function TestimonialCard({
  name,
  role,
  text,
  rating,
  delay,
}: {
  name: string;
  role: string;
  text: string;
  rating: number;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur-sm"
    >
      <div className="mb-3 flex gap-1">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">&ldquo;{text}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-violet to-cyan text-sm font-bold text-white">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Landing Page ──────────────────────────────────────────────
export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Brain,
      title: "Personalized Learning",
      description: "AI-powered paths that adapt to your learning style, pace, and goals for maximum efficiency.",
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Real-time dashboards with detailed analytics on your study habits, streaks, and achievements.",
    },
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description: "Deep insights into your learning patterns with actionable recommendations for improvement.",
    },
    {
      icon: Award,
      title: "Certification System",
      description: "Earn verifiable certificates and badges as you complete courses and reach milestones.",
    },
    {
      icon: Sparkles,
      title: "Smart Recommendations",
      description: "Get course and content suggestions based on your interests, skill gaps, and career goals.",
    },
    {
      icon: Users,
      title: "Community Learning",
      description: "Connect with peers, join study groups, and collaborate on projects to enhance your learning.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      text: "This platform transformed how I learn. The personalized paths helped me land my dream job in just 6 months!",
      rating: 5,
    },
    {
      name: "Marcus Johnson",
      role: "Data Scientist",
      text: "The analytics dashboard gives me insights I never had before. I can see exactly where I need to improve.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      text: "Best learning platform I've used. The community features and smart recommendations keep me engaged daily.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* ── Ambient background ──────────────────────────────── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/4 size-[600px] rounded-full bg-violet/8 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 size-[500px] rounded-full bg-cyan/6 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 size-[400px] rounded-full bg-indigo/5 blur-[80px]" />
      </div>

      {/* ── Navigation ──────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-violet to-indigo">
              <Sparkles className="size-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">NextGen Learn</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</a>
            <a href="#stats" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Results</a>
            <a href="#testimonials" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Testimonials</a>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/signin"
              className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-xl bg-gradient-to-r from-violet to-indigo px-5 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet/25"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="grid size-9 place-items-center rounded-lg border border-white/10 md:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="border-t border-white/5 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-2 p-4">
              <a href="#features" className="rounded-lg px-3 py-2 text-sm hover:bg-white/5">Features</a>
              <a href="#stats" className="rounded-lg px-3 py-2 text-sm hover:bg-white/5">Results</a>
              <a href="#testimonials" className="rounded-lg px-3 py-2 text-sm hover:bg-white/5">Testimonials</a>
              <hr className="border-white/10" />
              <Link href="/signin" className="rounded-lg px-3 py-2 text-sm hover:bg-white/5">Sign In</Link>
              <Link
                href="/signup"
                className="rounded-xl bg-gradient-to-r from-violet to-indigo px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ── Hero Section ────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-4 py-1.5"
            >
              <Sparkles className="size-4 text-violet-300" />
              <span className="text-xs font-medium text-violet-200">Next-Gen Learning Platform</span>
            </motion.div>

            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-7xl">
              Learn Smarter.{" "}
              <span className="bg-gradient-to-r from-violet via-indigo to-cyan bg-clip-text text-transparent">
                Grow Faster.
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Master new skills, track progress, and achieve your goals with our next-generation learning platform.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet to-indigo px-8 py-3.5 text-sm font-semibold text-white transition-all hover:shadow-xl hover:shadow-violet/25"
              >
                Get Started Free
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/courses"
                className="group inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-white/10"
              >
                <Play className="size-4" />
                Explore Courses
              </Link>
            </div>
          </motion.div>

          {/* Hero illustration */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative mx-auto mt-16 max-w-4xl"
          >
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-violet/10 via-black/50 to-cyan/10 p-1">
              <div className="rounded-xl bg-background/80 p-4 sm:p-6 backdrop-blur-sm">
                {/* Mock dashboard preview */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="rounded-lg bg-violet/20 p-1.5">
                        <BookOpen className="size-4 text-violet-300" />
                      </div>
                      <span className="text-xs text-muted-foreground">Active Courses</span>
                    </div>
                    <p className="text-2xl font-bold">12+</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="rounded-lg bg-emerald/20 p-1.5">
                        <TrendingUp className="size-4 text-emerald-300" />
                      </div>
                      <span className="text-xs text-muted-foreground">Completion Rate</span>
                    </div>
                    <p className="text-2xl font-bold">94%</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="rounded-lg bg-cyan/20 p-1.5">
                        <Clock className="size-4 text-cyan-300" />
                      </div>
                      <span className="text-xs text-muted-foreground">Learning Hours</span>
                    </div>
                    <p className="text-2xl font-bold">50K+</p>
                  </div>
                </div>
                {/* Progress bars */}
                <div className="mt-4 space-y-3">
                  {["React Patterns", "TypeScript", "System Design"].map((course, i) => (
                    <div key={course} className="flex items-center gap-3">
                      <span className="w-28 truncate text-xs text-muted-foreground">{course}</span>
                      <div className="flex-1">
                        <div className="h-2 rounded-full bg-white/10">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${[75, 60, 90][i]}%` }}
                            transition={{ delay: 0.8 + i * 0.2, duration: 1 }}
                            className="h-full rounded-full bg-gradient-to-r from-violet to-cyan"
                          />
                        </div>
                      </div>
                      <span className="text-xs font-medium">{[75, 60, 90][i]}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-r from-violet/20 via-transparent to-cyan/20 blur-xl" />
          </motion.div>
        </div>
      </section>

      {/* ── Features Section ────────────────────────────────── */}
      <section id="features" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-wider text-violet-300">
              Features
            </span>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Everything You Need to Succeed
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Our platform provides comprehensive tools and features designed to accelerate your learning journey.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Section ───────────────────────────────────── */}
      <section id="stats" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet/10 via-background to-cyan/10 p-6 sm:p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-wider text-cyan-300">
                Our Impact
              </span>
              <h2 className="text-3xl font-bold sm:text-4xl">Trusted by Learners Worldwide</h2>
            </motion.div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { value: 50000, suffix: "+", label: "Active Students", icon: GraduationCap, color: "text-violet-300" },
                { value: 500, suffix: "+", label: "Expert Courses", icon: BookOpen, color: "text-cyan-300" },
                { value: 94, suffix: "%", label: "Completion Rate", icon: CheckCircle2, color: "text-emerald-300" },
                { value: 120000, suffix: "+", label: "Learning Hours", icon: Clock, color: "text-orange-300" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className={`mx-auto mb-3 size-8 ${stat.color}`} />
                  <p className="mb-1 text-3xl font-extrabold sm:text-4xl">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials Section ─────────────────────────────── */}
      <section id="testimonials" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-wider text-emerald-300">
              Testimonials
            </span>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">What Our Students Say</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Join thousands of satisfied learners who have transformed their careers with our platform.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.name} {...testimonial} delay={index * 0.15} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ─────────────────────────────────────── */}
      <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet/20 via-indigo/10 to-cyan/20 p-8 text-center sm:p-16"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet/5 to-cyan/5" />
            <div className="relative z-10">
              <Sparkles className="mx-auto mb-6 size-10 text-violet-300" />
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
                Join thousands of learners already achieving their goals. Create your free account today.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/signup"
                  className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet to-indigo px-8 py-3.5 text-sm font-semibold text-white transition-all hover:shadow-xl hover:shadow-violet/25"
                >
                  Create Free Account
                  <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">No credit card required. Start learning instantly.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-white/5 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 grid-cols-2 lg:grid-cols-4">
            <div>
              <Link href="/" className="mb-4 flex items-center gap-2">
                <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-violet to-indigo">
                  <Sparkles className="size-3.5 text-white" />
                </div>
                <span className="font-bold">NextGen Learn</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                The next-generation learning platform for ambitious learners.
              </p>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="transition-colors hover:text-foreground">Features</a></li>
                <li><Link href="/courses" className="transition-colors hover:text-foreground">Courses</Link></li>
                <li><a href="#stats" className="transition-colors hover:text-foreground">Results</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="transition-colors hover:text-foreground">About</a></li>
                <li><a href="#" className="transition-colors hover:text-foreground">Contact</a></li>
                <li><a href="#" className="transition-colors hover:text-foreground">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="transition-colors hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="transition-colors hover:text-foreground">Terms of Service</a></li>
                <li><a href="#" className="transition-colors hover:text-foreground">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-white/5 pt-6 text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} NextGen Learn. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
