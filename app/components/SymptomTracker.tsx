import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { AlertCircle, Droplet, Moon, Meh } from 'lucide-react'
import { useSession } from 'next-auth/react'
import axios from 'axios'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
}

export default function SymptomTracker() {
  const { data: session } = useSession()

  const [symptoms, setSymptoms] = useState({
    nausea: 0,
    fatigue: 0,
    moodSwings: 0
  })

  const [suggestions, setSuggestions] = useState<string[]>([])
  const hasFetchedSuggestions = useRef(false)

  const fetchSuggestions = async () => {
    if (session) {
      try {
        const suggestionResponse = await axios.post(`/api/symptoms/suggestions`, symptoms)
        if (Array.isArray(suggestionResponse.data.suggestions)) 
          setSuggestions(suggestionResponse.data.suggestions)
        else
          setSuggestions([])
        console.log('Suggestions:', suggestionResponse.data.suggestions)
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      }
    }
  }

  useEffect(() => {
    const fetchSymptoms = async () => {
      if (session) {
        try {
          const symptomsResponse = await axios.get(`/api/symptoms?userid=${(session?.user as any)?.id}`)
          if(symptomsResponse.data) 
            setSymptoms(symptomsResponse.data)
          console.log('Symptoms:', symptomsResponse.data)
        } catch (error) {
          console.error('Error fetching symptoms:', error)
        }
      }
    }
    fetchSymptoms()
  }, [session])

  useEffect(() => {
    const hasNonZeroSymptom = Object.values(symptoms).some(value => value !== 0)

    if (hasNonZeroSymptom && !hasFetchedSuggestions.current) {
      fetchSuggestions()
      hasFetchedSuggestions.current = true
    }
  }, [symptoms])  

  const handleSymptomChange = (symptom: string, value: [number]) => {
    setSymptoms(prev => ({ ...prev, [symptom]: value[0] }))
    console.log('Saving metrics:', symptoms)
  }

  const handleSaveSymptoms = async (updatedSymptoms: typeof symptoms) => {
    if (session) {
      try {
        fetchSuggestions()
        const body = {
          userId: parseInt((session?.user as any)?.id, 10),
          nausea: updatedSymptoms.nausea,
          fatigue: updatedSymptoms.fatigue,
          moodSwings: updatedSymptoms.moodSwings,
          createdAt: new Date(),
        }
        await axios.post('/api/symptoms', body)
      } catch (error) {
        console.error('Error updating symptoms:', (error as any).response.data)
      }
    }
  }

  return (
    <div className="space-y-8">
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold text-[#c56679] mb-6">Symptom Tracker</h2>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.2 }}>
        <div className="grid md:grid-cols-3 gap-6">
          <SymptomCard
            title="Nausea"
            value={symptoms.nausea}
            icon={<Droplet className="w-10 h-10 text-[#e17489]" />}
            onChange={(value: [number]) => handleSymptomChange('nausea', value)}
            color="[#e17489]"
          />
          <SymptomCard
            title="Fatigue"
            value={symptoms.fatigue}
            icon={<Moon className="w-10 h-10 text-[#e17489]" />}
            onChange={(value: [number]) => handleSymptomChange('fatigue', value)}
            color="[#e17489]"
          />
          <SymptomCard
            title="Mood Swings"
            value={symptoms.moodSwings}
            icon={<Meh className="w-10 h-10 text-[#e17489]" />}
            onChange={(value: [number]) => handleSymptomChange('moodSwings', value)}
            color="[#e17489]"
          />
        </div>
      </motion.div>

      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={fadeIn} 
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex justify-center"
      >
        <Button 
          size="lg"
          className="text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:bg-[#e17489] hover:-translate-y-1 hover:scale-105 bg-[#e17489] ml-auto"
          onClick={() => handleSaveSymptoms(symptoms)}
        >
          Save Today&apos;s Symptoms
        </Button>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.6 }}>
        <Card className="bg-[#fff5f9]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#c56679]">Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4">
              <AlertCircle className="h-6 w-6 text-[#e17489]" />
              <div>
                <p className="font-semibold text-lg text-black mb-3">Based on your symptom tracking:</p>
                <ul className="space-y-3">
                  <AnimatePresence>
                    {suggestions.map((suggestion, index) => (
                      <motion.li
                        key={index}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={slideIn}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-white p-3 rounded-lg shadow-sm"
                      >
                        {suggestion}
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <p className="mt-6 font-semibold text-sm text-[#c56679] bg-[#fadee5] p-3 rounded-lg">
                  If symptoms persist or worsen, please consult your healthcare provider.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

interface SymptomCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  onChange: (value: [number]) => void;
  color: string;
}

function SymptomCard({ title, value, icon, onChange}: SymptomCardProps) {
  return (
    <Card className={`bg-[#fff5f9] hover:shadow-lg transition-shadow duration-300`}>
      <CardContent className="p-6 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
        <h3 className={`text-xl font-semibold mt-3 mb-4`}>{title}</h3>
        <Slider
          value={[value]}
          onValueChange={onChange}
          max={10}
          step={1}
          className={`w-full`}
        />
        <motion.span 
          key={value}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`mt-4 text-3xl font-bold text-[#c56679]`}
        >
          {value}/10
        </motion.span>
      </CardContent>
    </Card>
  )
}