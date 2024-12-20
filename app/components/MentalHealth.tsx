'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import meditationAnimation from '../animations/meditation.json'
import MaternalHealthChatbot from './MaternalHealthChatbot'

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
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)

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
      const response = await axios.get(`/api/mood/weekly?userid=${(session?.user as any)?.id}`);
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
    <div className="space-y-6 relative">
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold text-[#c56679] mb-4">Mental Health Tracker</h2>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.2 }}>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-[#fff5f9]">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-bold text-[#c56679]">
                <Smile className="w-8 h-8 mr-2 text-[#e17489]" />
                Mood Tracker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="daily" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="daily" className="text-lg">Daily</TabsTrigger>
                  <TabsTrigger value="weekly" className="text-lg">Weekly</TabsTrigger>
                </TabsList>
                <TabsContent value="daily" className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#3e5563]">How are you feeling today?</label>
                    <div className="flex items-center space-x-4">
                      <Slider
                        value={[mood]}
                        onValueChange={(value) => setMood(value[0])}
                        max={10}
                        step={1}
                        className="flex-grow"
                      />
                      <motion.div
                        key={mood}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {getMoodIcon(mood)}
                      </motion.div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#3e5563] mb-2">How many hours did you sleep last night?</label>
                    <div className="flex items-center space-x-4">
                      <Slider
                        value={[sleep]}
                        onValueChange={(value) => setSleep(value[0])}
                        max={12}
                        step={0.5}
                        className="flex-grow"
                      />
                      <span className="font-semibold text-[#3e5563]">{sleep} hrs</span>
                    </div>
                  </div>
                  <Button className="w-full text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:bg-[#e17489] hover:-translate-y-1 hover:scale-105 bg-[#e17489]" onClick={handleMoodChange}>Save Today&apos;s Check-in</Button>
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
          <Card className="bg-[#fff5f9]">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-bold text-[#c56679]">
                <Flower className="w-8 h-8 mr-2 text-[#e17489]" />
                Guided Meditation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold text-[#c56679]">Meditation Time</span>
                  <span className="text-lg font-bold text-[#c56679]">{formatTime(meditationTime)}</span>
                </div>
                <Progress value={(meditationTime / 600) * 100} max={100} className="w-full h-3" />
                <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
                  <DialogTrigger asChild>
                    <Button onClick={toggleMeditation} className="w-full text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:bg-[#e17489] hover:-translate-y-1 hover:scale-105 bg-[#e17489]">Start Guided Meditation</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-[#c56679]">Guided Meditation</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Lottie animationData={meditationAnimation} loop={true} className="w-120 h-120 mx-auto" />
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-semibold text-[#c56679]">Meditation Time</span>
                        <span className="text-lg font-bold text-[#c56679]">{formatTime(meditationTime)}</span>
                      </div>
                      <Progress value={(meditationTime / 600) * 100} max={100} className="w-full h-3" />
                      <Button onClick={toggleMeditation} className="w-full text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:bg-[#e17489] hover:-translate-y-1 hover:scale-105 bg-[#e17489]">
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
        <Card className="bg-[#fff5f9]">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-bold text-[#c56679]">
              <Wind className="w-8 h-8 mr-2 text-[#e17489]]" />
              Stress Reduction Techniques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <AnimatePresence>
                {[
                  { technique: "Deep Breathing", description: "Practice 4-7-8 breathing technique" },
                  { technique: "Progressive Muscle Relaxation", description: "Tense and relax each muscle group" },
                  { technique: "Mindful Walking", description: "Take a 10-minute mindful walk outdoors" },
                  { technique: "Gratitude Journaling", description: "Write down 3 things you're grateful for" }
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <StressReliefItem technique={item.technique} description={item.description} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.6 }}>
        <Card className="bg-[#fff5f9]">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl  font-bold text-[#c56679]">
          Mental Health Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { icon: Phone, title: "24/7 Hotline", content: "+91-080-46110007", color: "text-[#e17489]" },
                { icon: Book, title: "Recommended Reading", content: "\"Garbh Sanskar\" by Dr. Balaji Tambe", color: "text-[#e17489]" },
                { icon: MessageSquare, title: "Online Forums", content: "BabyChakra", link: "https://www.babychakra.com/", color: "text-[#e17489]" }
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

      {/* Floating Chatbot Button */}
      <motion.div
        className="fixed bottom-6 right-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          onClick={() => setIsChatbotOpen(true)}
          className="rounded-full w-16 h-16 bg-[#e17489] hover:bg-[#c56679] text-white shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
        >
          <MessageSquare className="w-8 h-8" />
        </Button>
      </motion.div>

      {/* Chatbot Dialog */}
      <Dialog open={isChatbotOpen} onOpenChange={setIsChatbotOpen}>
        <DialogContent className="sm:max-w-[500px] h-[600px] p-0">
          <DialogHeader className="p-4 bg-[#e17489] text-white">
            <DialogTitle className="text-2xl font-bold flex items-center">
              <MessageSquare className="w-6 h-6 mr-2" />
              Mental Health Assistant
            </DialogTitle>
          </DialogHeader>
          <div className="h-full overflow-hidden">
            <MaternalHealthChatbot />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface StressReliefItemProps {
  technique: string;
  description: string;
}

function StressReliefItem({ technique, description }: StressReliefItemProps) {
  return (
    <div className="flex items-start p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <div>
        <span className="font-bold text-[#c56679]">{technique}:</span>{' '}
        <span className="font-semibold text-[#3e5563]">{description}</span>
      </div>
    </div>
  )
}