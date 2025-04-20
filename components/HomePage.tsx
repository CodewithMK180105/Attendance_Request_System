"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Calendar, CheckCircle, FileCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

interface HomeProps {
    isLoggedIn: boolean
    userRole: string | null
}

export default function Home({ isLoggedIn, userRole }: HomeProps) {

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            Attendance Portal
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href={isLoggedIn ? `/dashboard/${userRole}` : "/login"}>
                 <Button>{isLoggedIn ? "Dashboard" : "Login"}</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1
                className="text-4xl md:text-6xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Streamline Attendance Management
              </motion.h1>
              <motion.p
                className="text-xl mb-8 text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                A smart portal to digitize the process of requesting and approving attendance for students engaged in
                extracurricular activities.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link href="/login">
                  <Button size="lg" className="mr-4">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline">
                    Create Class
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                className="bg-card p-6 rounded-lg shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Request Submission</h3>
                <p className="text-muted-foreground">
                  Students can quickly submit attendance requests for extracurricular activities with all necessary
                  details.
                </p>
              </motion.div>

              <motion.div
                className="bg-card p-6 rounded-lg shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Streamlined Approvals</h3>
                <p className="text-muted-foreground">
                  HODs and Professors can efficiently review and approve requests with just a few clicks.
                </p>
              </motion.div>

              <motion.div
                className="bg-card p-6 rounded-lg shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Complete History</h3>
                <p className="text-muted-foreground">
                  Track all attendance requests with comprehensive filtering and status updates.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                {/* Timeline */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border md:left-1/2"></div>

                {/* Step 1 */}
                <motion.div
                  className="relative mb-12 md:mb-8"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="md:w-1/2 md:pr-8 md:text-right">
                    <div className="bg-card p-4 rounded-lg shadow-sm">
                      <h3 className="text-lg font-semibold mb-2">1. Student Submits Request</h3>
                      <p className="text-muted-foreground">
                        Student fills out the attendance request form with event details and uploads supporting
                        documents.
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-0 top-4 bg-background border-4 border-primary rounded-full w-8 h-8 md:left-1/2 md:-ml-4"></div>
                </motion.div>

                {/* Step 2 */}
                <motion.div
                  className="relative mb-12 md:mb-8"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="md:w-1/2 md:ml-auto md:pl-8">
                    <div className="bg-card p-4 rounded-lg shadow-sm">
                      <h3 className="text-lg font-semibold mb-2">2. HOD Reviews</h3>
                      <p className="text-muted-foreground">
                        HOD reviews the request and either approves or rejects it based on the provided information.
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-0 top-4 bg-background border-4 border-primary rounded-full w-8 h-8 md:left-1/2 md:-ml-4"></div>
                </motion.div>

                {/* Step 3 */}
                <motion.div
                  className="relative mb-12 md:mb-8"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="md:w-1/2 md:pr-8 md:text-right">
                    <div className="bg-card p-4 rounded-lg shadow-sm">
                      <h3 className="text-lg font-semibold mb-2">3. Professor Grants Attendance</h3>
                      <p className="text-muted-foreground">
                        Once approved by HOD, the professor can view the request and grant attendance for the missed
                        class.
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-0 top-4 bg-background border-4 border-primary rounded-full w-8 h-8 md:left-1/2 md:-ml-4"></div>
                </motion.div>

                {/* Step 4 */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="md:w-1/2 md:ml-auto md:pl-8">
                    <div className="bg-card p-4 rounded-lg shadow-sm">
                      <h3 className="text-lg font-semibold mb-2">4. Student Receives Confirmation</h3>
                      <p className="text-muted-foreground">
                        Student can track the status of their request and receive confirmation once attendance is
                        granted.
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-0 top-4 bg-background border-4 border-primary rounded-full w-8 h-8 md:left-1/2 md:-ml-4"></div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join our platform today and simplify your attendance management process.
            </p>
            <Link href="/login">
              <Button size="lg" variant="secondary">
                Sign Up Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} Attendance Request Portal. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
