import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HeartPulse , Footprints, Flower, Dumbbell, Activity, Waves, Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import axios from 'axios'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function ExerciseTracker() {
  const { data: session } = useSession()

  const [activeTab, setActiveTab] = useState("today")
  const [exerciseLog, setExerciseLog] = useState<{ type: string; duration: number; intensity: string }[]>([])
  const [newExercise, setNewExercise] = useState({ type: '', duration: '', intensity: '' })
  const [totalMinutesExercised, setTotalMinutesExercised] = useState(0);
  const [activeDays, setActiveDays] = useState(0);

  const addExercise = () => {
    if (newExercise.type && newExercise.duration && newExercise.intensity) {
      setExerciseLog([...exerciseLog, { ...newExercise, duration: parseInt(newExercise.duration) }])
      handleAddExercise(newExercise);
      setNewExercise({ type: '', duration: '', intensity: '' })
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
        };
        await axios.post('/api/exercise', body);

        fetchWeeklyProgress();
      } catch (error) {
        console.error('Error adding exercise:', (error as any).response.data);
      }
    }
  };

  interface Recommendation {
    type: string;
    description: string;
  }

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const fetchWeeklyProgress = async () => {
    if (session) {
      try {
        const weeklyProgressResponse = await axios.get(`/api/exercise/weekly?userid=${(session?.user as any)?.id}`);
        setTotalMinutesExercised(weeklyProgressResponse.data.totalMinutesExercised);
        setActiveDays(weeklyProgressResponse.data.daysActive);
        console.log('Weekly Progress:', weeklyProgressResponse.data);
      } catch (error) {
        console.error('Error fetching Weekly Progress:', error);
      }
    }
  }

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(`/api/exercise/ExerciseRecommendation?userid=${(session?.user as any)?.id}`);
        const data = await response.json();
        setRecommendations(data);
        console.log('Exercise recommendations:', data);
      } catch (error) {
        console.error('Error fetching exercise recommendations:', error);
      }
    };
    fetchRecommendations();
  }, []);

  useEffect(() => {    
    const fetchExerciseLog = async () => {
      if (session) {
        try {
          const exerciseLogResponse = await axios.get(`/api/exercise?userid=${(session?.user as any)?.id}&date=${new Date().toISOString()}`);
          setExerciseLog(exerciseLogResponse.data);
          console.log('Exercise Log:', exerciseLogResponse.data);
        } catch (error) {
          console.error('Error fetching Exercise Log:', error);
        }
      }
    };
    fetchExerciseLog();
    fetchWeeklyProgress();
  }, [session])  

  return (
    <div className="space-y-6">
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Exercise Tracker</h2>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.2 }}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="today">Today&apos;s Activity</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Summary</TabsTrigger>
          </TabsList>
          <TabsContent value="today">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Today&apos;s Exercise</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" /> Log Exercise
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Log Exercise</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="exercise-type" className="text-right">
                            Type
                          </Label>
                          <Select
                            value={newExercise.type}
                            onValueChange={(value) => setNewExercise({ ...newExercise, type: value })}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select exercise type" />
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
                          <Label htmlFor="duration" className="text-right">
                            Duration
                          </Label>
                          <Input
                            id="duration"
                            type="number"
                            value={newExercise.duration}
                            onChange={(e) => setNewExercise({ ...newExercise, duration: e.target.value })}
                            placeholder="Minutes"
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="intensity" className="text-right">
                            Intensity
                          </Label>
                          <Select
                            value={newExercise.intensity}
                            onValueChange={(value) => setNewExercise({ ...newExercise, intensity: value })}
                          >
                            <SelectTrigger className="col-span-3">
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
                      <Button onClick={addExercise}>Add Exercise</Button>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exerciseLog.map((exercise, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        {exercise.type === 'Walking' && <Footprints className="w-5 h-5 mr-2 text-green-500" />}
                        {exercise.type === 'Yoga' && <Flower className="w-5 h-5 mr-2 text-purple-500" />}
                        {exercise.type === 'Swimming' && <Waves className="w-5 h-5 mr-2 text-blue-500" />}
                        {exercise.type === 'Strength Training' && <Dumbbell className="w-5 h-5 mr-2 text-gray-500" />}
                        {exercise.type === 'Pelvic Exercises' && <Activity className="w-5 h-5 mr-2 text-pink-500" />}
                        <span>{exercise.type}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {exercise.duration} min - {exercise.intensity}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="weekly">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Minutes Exercised</span>
                      <span>{totalMinutesExercised} / 150 min</span>
                    </div>
                    <Progress value={(totalMinutesExercised/150)*100} className="w-full" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Days Active</span>
                      <span>{activeDays} / 5 days</span>
                    </div>
                    <Progress value={(activeDays/5)*100} className="w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HeartPulse className="w-6 h-6 mr-2 text-red-500" />
              Exercise Recommendations
            </CardTitle>
          </CardHeader>
            <CardContent>
            <ul className="space-y-2">
              {recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-center">
                {recommendation.type === 'Walking' && <Footprints className="w-5 h-5 mr-2 text-green-500" />}
                {recommendation.type === 'Yoga' && <Flower className="w-5 h-5 mr-2 text-purple-500" />}
                {recommendation.type === 'Swimming' && <Waves className="w-5 h-5 mr-2 text-blue-500" />}
                {recommendation.type === 'Strength Training' && <Dumbbell className="w-5 h-5 mr-2 text-gray-500" />}
                {recommendation.type === 'Pelvic Exercises' && <Activity className="w-5 h-5 mr-2 text-pink-500" />}
                <span>{recommendation.description}</span>
              </li>
              ))}
            </ul>
            </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}