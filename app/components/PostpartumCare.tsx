'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertCircle, Heart, Phone, Book, MessageSquare, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import DepressionScreeningQuiz from './DepressionScreeningQuiz'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
}

export default function PostpartumCare() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  return (
    <div className="space-y-8">
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold text-[#c56679] mb-6">Postpartum Care</h2>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.2 }}>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-[#fff5f9]">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#c56679] flex items-center">
                <Heart className="w-6 h-6 mr-2 text-[#e17489]" />
                Postpartum Depression Screening
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 font-semibold text-[#c56679]">It's important to monitor your emotional health. If you're experiencing any of the following symptoms, please consult your healthcare provider:</p>
              <ul className="space-y-3">
                <AnimatePresence>
                  {[
                    "Persistent sadness or anxiety",
                    "Difficulty bonding with your baby",
                    "Withdrawing from family and friends",
                    "Loss of appetite",
                    "Inability to sleep or sleeping too much"
                  ].map((symptom, index) => (
                    <motion.li
                      key={index}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={slideIn}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm"
                    >
                      <AlertCircle className="w-5 h-5 text-[#e17489]" />
                      <span className="">{symptom}</span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="mt-6 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:bg-[#e17489] hover:-translate-y-1 hover:scale-105 bg-[#e17489]">
                    Take Depression Screening Quiz
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#fff5f9] max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-[#c56679] flex items-center">
                      <Heart className="w-6 h-6 mr-2 text-[#e17489]" />
                      Depression Screening Quiz
                    </DialogTitle>
                  </DialogHeader>
                  <DepressionScreeningQuiz />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
          <Card className="bg-[#fff5f9]">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#c56679] flex items-center">
                <CheckCircle className="w-6 h-6 mr-2 text-[#e17489]" />
                Self-Care Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <AnimatePresence>
                  {[
                    { reminder: "Rest when baby sleeps", description: "Try to nap or relax when your baby is sleeping" },
                    { reminder: "Stay hydrated", description: "Drink water regularly, especially if breastfeeding" },
                    { reminder: "Gentle exercises", description: "Start with light walks and pelvic floor exercises" },
                    { reminder: "Healthy eating", description: "Focus on nutritious meals to support recovery" }
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={slideIn}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <SelfCareItem reminder={item.reminder} description={item.description} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </CardContent>
          </Card>
        </div>
      </motion.div>
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.6 }}>
        <Card className="bg-[#fff5f9]">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl font-bold text-[#c56679]">
          Postpartum Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { icon: Phone, color: "text-[#e17489]", title: "Lactation Consultant Hotline", content: "+91-11-2786-8013" },
                { icon: Book, color: "text-[#e17489]", title: "Recommended Reading", content: "\"Baby Care & Child Health\" by Dr. R.K. Anand" },
                { icon: MessageSquare, color: "text-[#e17489]", title: "Online Support", content: "Postpartum Support International", link: "https://www.postpartum.net/", linkText: "Postpartum Support International" }
              ].map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <resource.icon className={`w-12 h-12 mb-3 ${resource.color}`} />
                  <h4 className="text-lg font-semibold mb-2">{resource.title}</h4>
                  {resource.link ? (
                    <Link href={resource.link} className={`${resource.color} hover:underline`} target="_blank" rel="noopener noreferrer">
                      {resource.content}
                    </Link>
                  ) : (
                    <p className="text-gray-600">{resource.content}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

interface SelfCareItemProps {
  reminder: string;
  description: string;
}

function SelfCareItem({ reminder, description }: SelfCareItemProps) {
  return (
    <div className="flex items-start bg-white p-4 rounded-lg shadow-sm">
      <AlertCircle className="w-5 h-5 mr-3 text-[#e17489] mt-1" />
      <div>
        <span className="font-semibold text-[#c56679]">{reminder}:</span>{' '}
        <span className="text-gray-600">{description}</span>
      </div>
    </div>
  )
}