import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Flower, Smile, Frown, Meh, MessageSquare, Wind, Book, Phone } from 'lucide-react'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useSession } from 'next-auth/react'
import axios from 'axios'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function MentalHealth() {
  const { data: session } = useSession()

  const [mood, setMood] = useState(5)
  const [sleep, setSleep] = useState(7)
  const [meditationTime, setMeditationTime] = useState(0)
  const [isMeditating, setIsMeditating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [weeklyMood, setWeeklyMood] = useState([
    { day: 'Mon', mood: 7 },
    { day: 'Tue', mood: 6 },
    { day: 'Wed', mood: 8 },
    { day: 'Thu', mood: 5 },
    { day: 'Fri', mood: 7 },
    { day: 'Sat', mood: 9 },
    { day: 'Sun', mood: 8 },
  ])

  const fetchWeeklyMood = async () => {
    try {
      const response = await axios.get(`/api/mood/weekly?userid=${(session?.user as any)?.id}`); // Replace with dynamic userId as needed
      console.log('Weekly mood:', response.data);
      setWeeklyMood(response.data);
    } catch (error) {
      console.error('Failed to fetch weekly mood:', error);
    }
  };

  useEffect(() => {
    const fetchMoodData = async () => {
      if (session) {
        try {
          const response = await axios.get(`/api/mood?userid=${(session?.user as any)?.id}&date=${new Date().toISOString().split('T')[0]}`);
          const moodData = response.data;
          setMood(moodData.mood);
          setSleep(moodData.sleep);
        } catch (error) {
          console.error('Error fetching mood data:', error);
        }
      }
    };
    fetchMoodData();
    fetchWeeklyMood();
  }, [session]);
  

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined
    if (isMeditating) {
      interval = setInterval(() => {
        setMeditationTime(prevTime => prevTime + 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isMeditating])

  const getMoodIcon = (value: number) => {
    if (value <= 3) return <Frown className="w-6 h-6 text-red-500" />
    if (value <= 7) return <Meh className="w-6 h-6 text-yellow-500" />
    return <Smile className="w-6 h-6 text-green-500" />
  }

  const getMoodColor = (value: number) => {
    if (value <= 3) return "#ef4444" // red-500
    if (value <= 7) return "#eab308" // yellow-500
    return "#22c55e" // green-500
  }

  const toggleMeditation = () => {
    setIsMeditating(!isMeditating)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      setIsMeditating(false)
    }
  }

  const handleMoodChange = async () => {
    if (session) 
    {
      try
      {
        const body = {
          userId: (session?.user as any)?.id,
          date: new Date().toISOString().split('T')[0],
          mood: mood,
          sleep: sleep
        }
        console.log(body)
        await axios.post('/api/mood', body)
        fetchWeeklyMood();
      } catch(error) {
        console.error('Error updating mood:', error);
      }
    }
  }

  interface CustomTooltipProps {
    active?: boolean;
    payload?: { value: number }[];
    label?: string;
  }
  
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow">
          <p className="font-semibold">{`${label} : ${payload[0].value}`}</p>
          <div className="flex justify-center mt-1">
            {getMoodIcon(payload[0].value)}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Mental Health Tracker</h2>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.2 }}>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smile className="w-6 h-6 mr-2 text-yellow-500" />
              Mood Tracker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="daily" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
              </TabsList>
              <TabsContent value="daily" className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How are you feeling today?</label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[mood]}
                      onValueChange={(value) => setMood(value[0])}
                      max={10}
                      step={1}
                      className="flex-grow"
                    />
                    {getMoodIcon(mood)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How many hours did you sleep last night?</label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[sleep]}
                      onValueChange={(value) => setSleep(value[0])}
                      max={12}
                      step={0.5}
                      className="flex-grow"
                    />
                    <span className="font-semibold">{sleep} hrs</span>
                  </div>
                </div>
                <Button className="w-full" onClick={handleMoodChange}>Save Today&apos;s Check-in</Button>
              </TabsContent>
              <TabsContent value="weekly">
              <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyMood}>
                      <XAxis dataKey="day" />
                      <YAxis domain={[0, 10]} hide={true} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="mood">
                        {weeklyMood.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getMoodColor(entry.mood)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Flower className="w-6 h-6 mr-2 text-purple-500" />
                Guided Meditation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <span>Meditation Time</span>
                  <span className="font-bold">{formatTime(meditationTime)}</span>
                </div>
                <Progress value={(meditationTime / 600) * 100} max={100} className="w-full" />
                <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
                  <DialogTrigger asChild>
                    <Button onClick={toggleMeditation} className="w-full">Start Guided Meditation</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Guided Meditation</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-2">
                        <span>Meditation Time</span>
                        <span className="font-bold">{formatTime(meditationTime)}</span>
                      </div>
                      <Progress value={(meditationTime / 600) * 100} max={100} className="w-full" />
                      <Button onClick={toggleMeditation} className="w-full">
                        {isMeditating ? 'Pause Meditation' : 'Start/Continue Meditation'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wind className="w-6 h-6 mr-2 text-blue-400" />
              Stress Reduction Techniques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <StressReliefItem technique="Deep Breathing" description="Practice 4-7-8 breathing technique" />
              <StressReliefItem technique="Progressive Muscle Relaxation" description="Tense and relax each muscle group" />
              <StressReliefItem technique="Mindful Walking" description="Take a 10-minute mindful walk outdoors" />
              <StressReliefItem technique="Gratitude Journaling" description="Write down 3 things you're grateful for" />
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.4 }}>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Mental Health Resources</h3>
        <Card className='pt-7'>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-green-500" />
                <span> 24/7 Maternal Mental Health Hotline:: +91-080-46110007</span>
              </li>
              <li className="flex items-center">
                <Book className="w-5 h-5 mr-2 text-yellow-800" />
                <span>Recommended Reading: &quot;Garbh Sanskar&quot; by Dr. Balaji Tambe</span>
              </li>
              <li className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-teal-500" />
                <span>Online Forums: <Link href="https://www.babychakra.com/" className="text-black-500 hover:underline" target="_blank" rel="noopener noreferrer">BabyChakra</Link></span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

interface StressReliefItemProps {
  technique: string;
  description: string;
}

function StressReliefItem({ technique, description }: StressReliefItemProps) {
  return (
    <li className="flex items-start">
      <div>
        <span className="font-semibold">{technique}:</span> {description}
      </div>
    </li>
  )
}