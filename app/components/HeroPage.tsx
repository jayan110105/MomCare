'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, ArrowRight } from 'lucide-react'
import { GiBabyBottle } from 'react-icons/gi'
import { IoIosHeart } from "react-icons/io"
import { MdOutlineInsights } from "react-icons/md"
import DashboardImage from "../img/maternal-healthcare-mockup.png"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const staggeredFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
    },
  }),
}

export default function HeroPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff5f9] to-white flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5 }}
              className="text-center md:text-left"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-[#c56679] mb-6">
                Mom Care
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Your personal companion for a healthy and happy pregnancy journey
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='px-2'
              >
                <Button asChild className="bg-[#e17489] hover:bg-[#c56679] text-white px-10 py-6 rounded-full text-xl font-semibold transition duration-300 shadow-lg hover:shadow-xl" aria-label="Get Started with Mom Care">
                  <Link href="/auth" className="flex items-center">
                    Get Started
                    <motion.div
                      whileHover={{ x: 5 }}
                      whileTap={{ x: -2 }}
                    >
                      <ArrowRight className="ml-2 h-6 w-6" />
                    </motion.div>
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <Image
                src= {DashboardImage}
                alt="Mom Care App"
                width={600}
                height={600}
                className="rounded-lg shadow-xl"
              />
              <motion.div 
                className="absolute -bottom-4 right-1 bg-white p-4 rounded-lg shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-[#c56679] font-semibold">Empowering moms-to-be</p>
                <p className="text-sm text-gray-600 mt-1">Your journey, our support</p>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-[#c56679] mb-6 text-center">
              Track Your Journey
            </h2>
            <ul className="grid md:grid-cols-2 gap-6">
              {[
                { icon: IoIosHeart, text: "Monitor your health metrics" },
                { icon: GiBabyBottle, text: "Track fetal development" },
                { icon: MdOutlineInsights, text: "Log and monitor symptoms to get actionable insights" },
                { icon: Calendar, text: "Set reminders for appointments" },
              ].map((feature, index) => (
                <motion.li
                  key={index}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={staggeredFadeIn}
                  className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm"
                >
                  <div className="bg-[#fadee5] p-3 rounded-full">
                    <feature.icon className="w-6 h-6 text-[#e17489]" />
                  </div>
                  <span className="text-xl text-gray-700">{feature.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Personalized Dashboard",
                description: "Get a comprehensive overview of your pregnancy journey tailored just for you.",
              },
              {
                title: "Symptom Insights",
                description: "Log and monitor symptoms to get actionable insights on your health throughout your pregnancy.",
              },
              {
                title: "Nutrition Recommendations",
                description: "Receive tailored nutrition guides to ensure a healthy diet for you and your baby.",
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={staggeredFadeIn}
              >
                <Card className="h-full bg-white hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-[#c56679] mb-4">{card.title}</h3>
                    <p className="text-gray-600">{card.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <motion.footer
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-[#fff5f9] py-8"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">&copy; 2024 Maternal Health Tracker. All rights reserved.</p>
            <div className="flex space-x-4">
              <Link href="/privacy-policy" className="text-gray-600 hover:text-[#e17489]">Privacy Policy</Link>
              <Link href="/terms-of-service" className="text-gray-600 hover:text-[#e17489]">Terms of Service</Link>
              <Link href="/contact" className="text-gray-600 hover:text-[#e17489]">Contact</Link>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}