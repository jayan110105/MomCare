import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Heart, Droplet, Plus, Clock, CheckCircle2 } from 'lucide-react'
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

export default function LaborPrep() {
  const { data: session } = useSession()

  const [contractions, setContractions] = useState<{ start: Date; end: Date | null }[]>([])
  const [isContractionActive, setIsContractionActive] = useState(false)
  const [activeContractionTime, setActiveContractionTime] = useState(0)
  const [checklist, setChecklist] = useState<{ id: number; text: string; completed: boolean }[]>([])
  const [newItem, setNewItem] = useState("")

  useEffect(() => {
    const fetchChecklist = async () => {
      if (session) {
        try {
          const checklistResponse = await axios.get(`/api/laborPrep?userid=${(session?.user as any)?.id}`)
          console.log('Checklist:', checklistResponse.data)
          if (checklistResponse.data) setChecklist(checklistResponse.data)
        } catch (error) {
          console.error('Error fetching checklist:', error)
        }
      }
    }
    fetchChecklist()
  }, [session])

  const saveChecklist = async (updatedItem: typeof newItem) => {
    if (session) {
      try {
        const body = {
          userId: (session?.user as any)?.id,
          text: updatedItem,
        }
        await axios.post(`/api/laborPrep`, body)
        console.log('Checklist saved successfully')
      } catch (error) {
        console.error('Error saving checklist:', error)
      }
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined
    if (isContractionActive) {
      interval = setInterval(() => {
        setActiveContractionTime((prevTime) => prevTime + 1)
      }, 1000)
    } else {
      clearInterval(interval)
      setActiveContractionTime(0)
    }
    return () => clearInterval(interval)
  }, [isContractionActive])

  const addContraction = () => {
    setIsContractionActive(true)
    setContractions([...contractions, { start: new Date(), end: null }])
  }

  const endContraction = () => {
    setIsContractionActive(false)
    if (contractions.length > 0 && !contractions[contractions.length - 1].end) {
      const updatedContractions = [...contractions]
      updatedContractions[updatedContractions.length - 1].end = new Date()
      setContractions(updatedContractions)
    }
  }

  const toggleChecklistItem = async (id: number) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  
    const currentItem = checklist.find(item => item.id === id)
    if (!currentItem) return
  
    try {
      await axios.put('/api/laborPrep', {
        id,
        completed: !currentItem.completed,
      })
    } catch (error) {
      console.error('Error updating checklist item:', error)
    }
  }

  const addChecklistItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (newItem.trim() !== "") {
      setChecklist([...checklist, { id: Date.now(), text: newItem, completed: false }])
      saveChecklist(newItem)
      setNewItem("")
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  return (
    <div className="space-y-8">
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold text-[#c56679] mb-6">Labor Preparation</h2>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.2 }}>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-[#fff5f9]">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#c56679] flex items-center">
                <Clock className="w-6 h-6 mr-2 text-[#e17489]" />
                Contraction Timer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Button 
                    onClick={addContraction} 
                    disabled={isContractionActive}
                    className={`text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 bg-[#e17489] hover:bg-[#e17489]`}
                  >
                    {isContractionActive ? "Contraction Active" : "Start Contraction"}
                  </Button>
                  <Button 
                    onClick={endContraction} 
                    variant="outline" 
                    disabled={!isContractionActive}
                    className="border-[#cf3554] font-semibold text-[#a13c50]"
                  >
                    End Contraction
                  </Button>
                </div>
                {isContractionActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-xl font-semibold mb-2 text-[#c56679]">Current Contraction Time: {formatTime(activeContractionTime)}</p>
                    <Progress value={(activeContractionTime % 60) * 1.67} className="w-full h-2 text-[#c56679]" />
                  </motion.div>
                )}
                {contractions.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 text-lg text-[#c56679]">Recent Contractions:</h4>
                    <ul className="space-y-3">
                      <AnimatePresence>
                        {contractions.slice(-3).reverse().map((contraction, index) => (
                          <motion.li 
                            key={index} 
                            className="flex justify-between bg-white p-3 rounded-lg shadow-sm"
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={slideIn}
                            transition={{ duration: 0.3 }}
                          >
                            <span className="text-[#c56679]">Started: {contraction.start.toLocaleTimeString()}</span>
                            {contraction.end && (
                              <span className="font-semibold text-[#c56679]">
                                Duration: {((new Date(contraction.end!).getTime() - new Date(contraction.start).getTime()) / 1000).toFixed(0)}s
                              </span>
                            )}
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#fff5f9]">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#c56679] flex items-center">
                <Heart className="w-6 h-6 mr-2 text-[#e17489]" />
                When to Go to the Hospital
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <motion.li 
                  className="flex items-center bg-white p-4 rounded-lg shadow-sm"
                  initial="hidden"
                  animate="visible"
                  variants={slideIn}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Heart className="w-6 h-6 mr-3 text-[#e17489]" />
                  <span className="">Contractions every 5 minutes, lasting 1 minute, for 1 hour</span>
                </motion.li>
                <motion.li 
                  className="flex items-center bg-white p-4 rounded-lg shadow-sm"
                  initial="hidden"
                  animate="visible"
                  variants={slideIn}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Droplet className="w-6 h-6 mr-3 text-[#e17489]" />
                  <span className="">Water breaks or you experience heavy bleeding</span>
                </motion.li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.4 }}>
        <Card className="bg-[#fff5f9]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#c56679] flex items-center">
              <CheckCircle2 className="w-6 h-6 mr-2 text-[#e17489]" />
              Labor Preparation Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addChecklistItem} className="flex space-x-2 mb-6">
              <Input
                type="text"
                placeholder="Add new item"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                className="flex-grow rounded-full"
              />
              <Button 
                type="submit"
                className="ml-4 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:bg-[#e17489] hover:-translate-y-1 hover:scale-105 bg-[#e17489]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </form>
            <ul className="space-y-3">
              <AnimatePresence>
                {checklist.map(item => (
                  <motion.li
                    key={item.id}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={slideIn}
                    transition={{ duration: 0.3 }}
                  >
                    <ChecklistItem 
                      id={item.id}
                      text={item.text}
                      completed={item.completed}
                      onToggle={toggleChecklistItem}
                    />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

interface ChecklistItemProps {
  id: number;
  text: string;
  completed: boolean;
  onToggle: (id: number) => void;
}

function ChecklistItem({ id, text, completed, onToggle }: ChecklistItemProps) {
  return (
    <div className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm">
      <Checkbox
        id={`task-${id}`}
        checked={completed}
        onCheckedChange={() => onToggle(id)}
        className="border-[#c56679] text-[#c56679] checked:bg-[#e17489]"
      />
      <label
        htmlFor={`task-${id}`}
        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
          completed ? "line-through text-gray-500" : ""
        }`}
      >
        {text}
      </label>
    </div>
  )
}