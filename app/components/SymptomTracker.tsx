import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { AlertCircle, Droplet , Moon , Meh } from 'lucide-react'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function SymptomTracker() {
  const [symptoms, setSymptoms] = useState({
    nausea: 0,
    fatigue: 0,
    moodSwings: 0
  })

  const handleSymptomChange = (symptom: string, value: [number]) => {
    setSymptoms(prev => ({ ...prev, [symptom]: value[0] }))
  }

  return (
    <div className="space-y-6">
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Symptom Tracker</h2>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.2 }}>
        <div className="grid md:grid-cols-3 gap-6">
          <SymptomCard
            title="Nausea"
            value={symptoms.nausea}
            icon={<Droplet  className="w-8 h-8 text-green-500" />}
            onChange={(value: [number]) => handleSymptomChange('nausea', value)}
          />
          <SymptomCard
            title="Fatigue"
            value={symptoms.fatigue}
            icon={<Moon  className="w-8 h-8 text-gray-500" />}
            onChange={(value: [number]) => handleSymptomChange('fatigue', value)}
          />
          <SymptomCard
            title="Mood Swings"
            value={symptoms.moodSwings}
            icon={<Meh className="w-8 h-8 text-purple-500" />}
            onChange={(value: [number]) => handleSymptomChange('moodSwings', value)}
          />
        </div>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.4 }}>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>AI Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-1" />
              <div>
                <p className="font-semibold">Based on your symptom tracking:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Try eating small, frequent meals to help with nausea</li>
                  <li>Consider taking short naps during the day to combat fatigue</li>
                  <li>Practice relaxation techniques like deep breathing for mood swings</li>
                </ul>
                <p className="mt-4 text-sm text-gray-600">If symptoms persist or worsen, please consult your healthcare provider.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.6 }}>
        <Button className="mt-6">Save Today&apos;s Symptoms</Button>
      </motion.div>
      
    </div>
  )
}

interface SymptomCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  onChange: (value: [number]) => void;
}

function SymptomCard({ title, value, icon, onChange }: SymptomCardProps) {
  return (
    <Card>
      <CardContent className="p-6 flex flex-col items-center">
        {icon}
        <h3 className="text-lg font-semibold mt-2 mb-4">{title}</h3>
        <Slider
          value={[value]}
          onValueChange={onChange}
          max={10}
          step={1}
          className="w-full"
        />
        <span className="mt-2 text-2xl font-bold">{value}/10</span>
      </CardContent>
    </Card>
  )
}