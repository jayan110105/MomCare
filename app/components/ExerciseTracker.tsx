import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HeartPulse, Footprints, Flower, Dumbbell, Activity, Waves, Plus, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import Lottie from 'lottie-react'
import exerciseAnimation from '../animations/exercise-animation.json'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const exerciseIcons: { [key: string]: React.ComponentType<any> } = {
  Walking: Footprints,
  Yoga: Flower,
  Swimming: Waves,
  'Strength Training': Dumbbell,
  'Pelvic Exercises': Activity
}

const intensityColors = {
  Low: 'bg-green-200 text-green-800',
  Moderate: 'bg-yellow-200 text-yellow-800',
  High: 'bg-red-200 text-red-800'
}

export default function ExerciseTracker() {
  const { data: session } = useSession()

  const [activeTab, setActiveTab] = useState("today")
  const [exerciseLog, setExerciseLog] = useState<{ type: string; duration: number; intensity: keyof typeof intensityColors }[]>([])
  const [newExercise, setNewExercise] = useState<{ type: string; duration: string; intensity: keyof typeof intensityColors }>({ type: '', duration: '', intensity: 'Low' })
  const [totalMinutesExercised, setTotalMinutesExercised] = useState(0)
  const [activeDays, setActiveDays] = useState(0)
  const [recommendations, setRecommendations] = useState<{ type: string; description: string }[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const addExercise = () => {
    if (newExercise.type && newExercise.duration && newExercise.intensity) {
      setExerciseLog([...exerciseLog, { ...newExercise, duration: parseInt(newExercise.duration) }])
      handleAddExercise(newExercise)
      setNewExercise({ type: '', duration: '', intensity: 'Low' })
      setIsDialogOpen(false)
    }
  }

  const handleAddExercise = async (updatedExercises: typeof newExercise) => {
    if (session) {
      try {
        const body = {
          userId: parseInt((session?.user as any)?.id, 10),
          type: updatedExercises.type,
          duration: parseInt(updatedExercises.duration, 10),
          intensity: updatedExercises.intensity,
        }
        await axios.post('/api/exercise', body)
        fetchWeeklyProgress()
      } catch (error) {
        console.error('Error adding exercise:', (error as any).response?.data || error)
      }
    }
  }

  const fetchWeeklyProgress = async () => {
    if (session) {
      try {
        const weeklyProgressResponse = await axios.get(`/api/exercise/weekly?userid=${(session?.user as any)?.id}`)
        setTotalMinutesExercised(weeklyProgressResponse.data.totalMinutesExercised)
        setActiveDays(weeklyProgressResponse.data.daysActive)
      } catch (error) {
        console.error('Error fetching Weekly Progress:', error)
      }
    }
  }

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (session) {
        try {
          setIsLoading(true)
          const response = await fetch(`/api/exercise/ExerciseRecommendation?userid=${(session?.user as any)?.id}`)
          const data = await response.json()
          setRecommendations(data)
        } catch (error) {
          console.error('Error fetching exercise recommendations:', error)
          setRecommendations([])
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchRecommendations()
  }, [session])

  useEffect(() => {    
    const fetchExerciseLog = async () => {
      if (session) {
        try {
          const exerciseLogResponse = await axios.get(`/api/exercise?userid=${(session?.user as any)?.id}&date=${new Date().toISOString()}`)
          setExerciseLog(exerciseLogResponse.data)
        } catch (error) {
          console.error('Error fetching Exercise Log:', error)
        }
      }
    }
    fetchExerciseLog()
    fetchWeeklyProgress()
  }, [session])

  return (
    <div className="space-y-6">
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold text-[#c56679] mb-4">Exercise Tracker</h2>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.2 }}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="today" className="text-lg text-[#af7984]">Today&apos;s Activity</TabsTrigger>
            <TabsTrigger value="weekly" className="text-lg text-[#af7984]">Weekly Summary</TabsTrigger>
          </TabsList>
          <TabsContent value="today">
            <Card className="bg-[#fff5f9]">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#c56679]">Today&apos;s Exercise</span>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:bg-[#e17489] hover:-translate-y-1 hover:scale-105 bg-[#e17489]">
                        <Plus className="w-5 h-5 mr-2" /> Log Exercise
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-[#fff5f9]">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-[#c56679]">Log Exercise</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="exercise-type" className="text-left font-semibold">
                            Type
                          </Label>
                          <Select
                            value={newExercise.type}
                            onValueChange={(value) => setNewExercise({ ...newExercise, type: value })}
                          >
                            <SelectTrigger className="col-span-3 rounded-full">
                              <SelectValue placeholder="Select exercise type"/>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Walking">Walking</SelectItem>
                              <SelectItem value="Yoga">Yoga</SelectItem>
                              <SelectItem value="Swimming">Swimming</SelectItem>
                              <SelectItem value="Strength Training">Strength Training</SelectItem>
                              <SelectItem value="Pelvic Exercises">Pelvic Exercises</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="duration" className="text-left font-semibold">
                            Duration
                          </Label>
                          <Input
                            id="duration"
                            type="number"
                            value={newExercise.duration}
                            onChange={(e) => setNewExercise({ ...newExercise, duration: e.target.value })}
                            placeholder="Minutes"
                            className="col-span-3 rounded-full"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="intensity" className="text-left font-semibold">
                            Intensity
                          </Label>
                          <Select
                            value={newExercise.intensity}
                            onValueChange={(value) => setNewExercise({ ...newExercise, intensity: value as keyof typeof intensityColors })}
                          >
                            <SelectTrigger className="col-span-3 rounded-full">
                              <SelectValue placeholder="Select intensity" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Low">Low</SelectItem>
                              <SelectItem value="Moderate">Moderate</SelectItem>
                              <SelectItem value="High">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button onClick={addExercise} className="w-full text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:bg-[#e17489] hover:-translate-y-1 hover:scale-105 bg-[#e17489]">Add Exercise</Button>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence>
                  {exerciseLog.map((exercise, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between mb-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex items-center">
                        {exerciseIcons[exercise.type] && React.createElement(exerciseIcons[exercise.type], { className: "w-8 h-8 mr-3 text-[#e17489]" })}
                        <div>
                          <span className="font-semibold text-lg text-gray-800">{exercise.type}</span>
                          <div className="text-sm text-gray-600">
                            {exercise.duration} minutes
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${intensityColors[exercise.intensity]}`}>
                        {exercise.intensity}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="weekly">
            <Card className="bg-[#fff5f9]">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-[#c56679]">Weekly Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-lg font-semibold text-[#c56679]">Minutes Exercised</span>
                      <span className="text-lg font-bold text-[#c56679]">{totalMinutesExercised} / 150 min</span>
                    </div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `100%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    >
                      <Progress value={(totalMinutesExercised/150)*100} className="h-4 w-full" />
                    </motion.div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-lg font-semibold text-[#c56679]">Days Active</span>
                      <span className="text-lg font-bold text-[#c56679]">{activeDays} / 5 days</span>
                    </div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `100%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    >
                      <Progress value={(activeDays/5)*100} className="h-4 w-full" />
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.4 }}>
        <Card className="bg-[#fff5f9]">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-bold text-[#c56679]">
              <HeartPulse className="w-8 h-8 mr-2 text-[#e17489]" />
              Exercise Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-[#e17489]" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ul className="space-y-4">
                  {recommendations.map((recommendation, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      {exerciseIcons[recommendation.type] && React.createElement(exerciseIcons[recommendation.type], { className: "w-8 h-8 mr-3 text-[#e17489]" })}
                      <span className="text-gray-800">{recommendation.description}</span>
                    </motion.li>
                  ))}
                </ul>
                <div className="flex justify-center items-center">
                  <Lottie animationData={exerciseAnimation} loop={true} className="w-full max-w-md" />
                </div>
              </div>
            )}
          </CardContent>
        
        </Card>
      </motion.div>
    </div>
  )
}