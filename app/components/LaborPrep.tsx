import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Heart, Droplet, Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import axios from 'axios'


const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
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
  },[session])

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
    // Update the local state immediately for UI responsiveness
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  
    // Find the current completed status to toggle it correctly
    const currentItem = checklist.find(item => item.id === id);
    if (!currentItem) return;
  
    try {
      // Make the PUT request using axios to update the completed status on the server
      await axios.put('/api/laborPrep', {
        id,
        completed: !currentItem.completed,
      });
    } catch (error) {
      console.error('Error updating checklist item:', error);
    }
  };

  const addChecklistItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (newItem.trim() !== "") {
      setChecklist([...checklist, { id: Date.now(), text: newItem, completed: false }])
      saveChecklist(newItem);
      setNewItem("")
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  return (
    <div className="space-y-6">
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Labor Preparation</h2>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.2 }}>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Contraction Timer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Button 
                    onClick={addContraction} 
                    disabled={isContractionActive}
                    className={isContractionActive ? "bg-red-500 hover:bg-red-600" : ""}
                  >
                    {isContractionActive ? "Contraction Active" : "Start Contraction"}
                  </Button>
                  <Button onClick={endContraction} variant="outline" disabled={!isContractionActive}>
                    End Contraction
                  </Button>
                </div>
                {isContractionActive && (
                  <div>
                    <p className="text-lg font-semibold mb-2">Current Contraction Time: {formatTime(activeContractionTime)}</p>
                    <Progress value={(activeContractionTime % 60) * 1.67} className="w-full" />
                  </div>
                )}
                {contractions.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Recent Contractions:</h4>
                    <ul className="space-y-2">
                      {contractions.slice(-3).reverse().map((contraction, index) => (
                        <li key={index} className="flex justify-between">
                          <span>Started: {contraction.start.toLocaleTimeString()}</span>
                          {contraction.end && (
                            <span>Duration: {((new Date(contraction.end!).getTime() - new Date(contraction.start).getTime()) / 1000).toFixed(0)}s</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                When to Go to the Hospital
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  <span>Contractions every 5 minutes, lasting 1 minute, for 1 hour </span>
                </li>
                <li className="flex items-center">
                  <Droplet className="w-5 h-5 mr-2 text-blue-400" />
                  <span>Water breaks or you experience heavy bleeding</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle>Labor Preparation Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addChecklistItem} className="flex space-x-2 mb-4">
              <Input
                type="text"
                placeholder="Add new item"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </form>
            <ul className="space-y-2">
              {checklist.map(item => (
                <ChecklistItem 
                  key={item.id}
                  id={item.id}
                  text={item.text}
                  completed={item.completed}
                  onToggle={toggleChecklistItem}
                />
              ))}
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
    <div className="flex items-center space-x-2">
      <Checkbox
        id={`task-${id}`}
        checked={completed}
        onCheckedChange={() => onToggle(id)}
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