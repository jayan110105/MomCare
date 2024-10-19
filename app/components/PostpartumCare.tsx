import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Heart, Phone, Book, MessageSquare } from 'lucide-react'
import Link from 'next/link'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function PostpartumCare() {

  return (
    <div className="space-y-6">
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Postpartum Care</h2>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.2 }}>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Postpartum Depression Screening</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">It&apos;s important to monitor your emotional health. If you&apos;re experiencing any of the following symptoms, please consult your healthcare provider:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Persistent sadness or anxiety</li>
                <li>Difficulty bonding with your baby</li>
                <li>Withdrawing from family and friends</li>
                <li>Loss of appetite</li>
                <li>Inability to sleep or sleeping too much</li>
              </ul>
              <Button className="mt-4">Take Depression Screening Quiz</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-6 h-6 mr-2 text-green-500" />
                Self-Care Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <SelfCareItem reminder="Rest when baby sleeps" description="Try to nap or relax when your baby is sleeping" />
                <SelfCareItem reminder="Stay hydrated" description="Drink water regularly, especially if breastfeeding" />
                <SelfCareItem reminder="Gentle exercises" description="Start with light walks and pelvic floor exercises" />
                <SelfCareItem reminder="Healthy eating" description="Focus on nutritious meals to support recovery" />
              </ul>
            </CardContent>
          </Card>
        </div>
      </motion.div>
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.6 }}>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Postpartum Resources</h3>
        <Card className='pt-7'>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-green-500" />
                <span>Lactation Consultant Hotline: +91-11-2786-8013</span>
              </li>
              <li className="flex items-center">
                <Book className="w-5 h-5 mr-2 text-yellow-800" />
                <span>Recommended Reading: &quot;Baby Care & Child Health&quot; by Dr. R.K. Anand</span>
              </li>
              <li className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-teal-500" />
                <span>Online Support: <Link href="https://www.postpartum.net/" className="text-black-500 hover:underline" target="_blank" rel="noopener noreferrer">Postpartum Support International</Link></span>
              </li>
            </ul>
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
    <li className="flex items-start">
      <AlertCircle className="w-5 h-5 mr-2 text-blue-500 mt-1" />
      <div>
        <span className="font-semibold">{reminder}:</span> {description}
      </div>
    </li>
  )
}