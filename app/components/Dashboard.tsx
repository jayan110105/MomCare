'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, Info, TrendingUp, Activity, CalendarHeart, HeartPulse, Plus, Edit2, AlertTriangle } from 'lucide-react'
import { Slider } from "@/components/ui/slider"
import { useSession } from 'next-auth/react'
import axios from 'axios'
import Lottie from 'lottie-react'
import pregnancyAnimation from '../animations/pregnancy-animation.json'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function Dashboard() {
  const { data: session } = useSession()

  const [metrics, setMetrics] = useState({
    age: 26,
    bloodPressure: '120/80',
    glucose: 95,
    heartRate: 80,
    fetalSize: 'ear of corn',
    fetalWeight: '1.3',
    gestationalAge: 24,
  })

  const [gestationalAge, setGestationalAge] = useState(24)
  const [tips, setTips] = useState<string[]>([])
  const [reminders, setReminders] = useState([
    { id: 1, text: 'Prenatal Checkup', date: 'July 15, 2024 - 10:00 AM' },
  ])
  const [newReminder, setNewReminder] = useState({ text: '', date: '' })
  const [isEditing, setIsEditing] = useState<string | null>(null)

  const [prediction, setPrediction] = useState<string | null>(null);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const response = await axios.get('/api/dashboard/pregnancyTips')
        setTips(response.data.tips)
      } catch (error) {
        console.error('Error fetching tips:', error)
      }
    }

    const fetchMetrics = async () => {
      if (session) {
        try {
          const metricsResponse = await axios.get(`/api/dashboard/metrics?userid=${(session?.user as any)?.id}`)
          if(metricsResponse.data) 
            setMetrics(metricsResponse.data)
          console.log('Metrics:', metricsResponse.data)
          setGestationalAge(metricsResponse.data.gestationalAge)
          handlePredict(metricsResponse.data);
        } catch (error) {
          console.error('Error fetching metrics:', error)
        }
      }
    }
    
    const fetchReminders = async () => {
      if (session) {
        try {
          const remindersResponse = await axios.get(`/api/dashboard/reminders?userid=${(session?.user as any)?.id}`)
          setReminders(remindersResponse.data)
          console.log('Reminders:', remindersResponse.data)
        } catch (error) {
          console.error('Error fetching reminders:', error)
        }
      }
    }
    
    fetchTips()
    fetchMetrics()
    fetchReminders()
  }, [session])

  useEffect(() => {
    console.log('fetching fetal data for week:', metrics.gestationalAge)
    const fetchFetalData = async () => {
      try {
        const response = await axios.get(`/api/dashboard/gestationalData?gestationalAge=${metrics.gestationalAge}`)
        const { fetalWeight, fetalSize } = response.data
        setMetrics(prev => ({ ...prev, fetalWeight, fetalSize }))
      } catch (error) {
        console.error('Error fetching fetal data:', error)
      }
    }
    fetchFetalData()
  }, [metrics.gestationalAge])

  const handleMetricChange = (metric: any, value: any) => {
    const updatedMetrics = { ...metrics, [metric]: value }
    setMetrics(updatedMetrics)
    console.log('Saving metrics:', updatedMetrics)
    handleSaveMetrics(updatedMetrics)
  }

  const handleSaveMetrics = async (updatedMetrics: typeof metrics) => {
    if (session) {
      try {
        const body = {
          userId: parseInt((session?.user as any)?.id, 10),
          age: updatedMetrics.age,
          bloodPressure: updatedMetrics.bloodPressure,
          glucose: updatedMetrics.glucose,
          heartRate: updatedMetrics.heartRate,
          gestationalAge: updatedMetrics.gestationalAge,
          createdAt: new Date(),
        }
        await axios.post('/api/dashboard/metrics', body)
        handlePredict(body);
      } catch (error) {
        console.error('Error updating metrics:', (error as any).response.data)
      }
    }
  }

  const handleAddReminder = async () => {
    if (newReminder.text && newReminder.date) {
      setReminders(prev => [...prev, { id: Date.now(), ...newReminder }])
      
      if (session) {
        try {
          const body = {
            userId: Number((session?.user as any)?.id),
            text: newReminder.text,
            date: new Date(newReminder.date),
          }
          await axios.post('/api/dashboard/reminders', body)
        } catch (error) {
          console.error('Error updating reminders:', error)
        }
      }
      setNewReminder({ text: '', date: '' })
    }
  }

  const handlePredict = async (body: { age: number; bloodPressure: string; glucose: number; heartRate: number; gestationalAge: number; }) => {
    try {
      const [systolic, diastolic] = body.bloodPressure.split('/').map(Number);
      const inputData = {
        feature1: body.age,
        feature2: systolic,
        feature3: diastolic,
        feature4: body.glucose,
        feature5: body.heartRate,
      };
      const response = await axios.post('http://mom-care-backend.vercel.app/predict_risk', inputData);
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error('Error fetching prediction:', error);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={fadeIn} 
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <h2 className="text-3xl font-bold text-[#c56679]">Welcome, {session?.user?.name?.split(' ')[0] || 'Guest'}!</h2>
        <div className="text-right">
          <p className="text-2xl font-semibold text-[#e17489]">Week {metrics.gestationalAge}</p>
          <p className="text-sm text-gray-800">
            {metrics.gestationalAge < 13
              ? '1st Trimester'
              : metrics.gestationalAge < 28
              ? '2nd Trimester'
              : '3rd Trimester'}
          </p>
        </div>
      </motion.div>
      
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={fadeIn} 
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <MetricCard
          icon={<CalendarHeart className="w-8 h-8 text-[#e17489]" />}
          title="Age"
          value={metrics.age.toString()}
          onChange={(value) => handleMetricChange('age', parseInt(value))}
        />
        <MetricCard
          icon={<Activity className="w-8 h-8 text-[#e17489]" />}
          title="Blood Pressure"
          value={metrics.bloodPressure}
          unit="mmHg"
          onChange={(value) => handleMetricChange('bloodPressure', value)}
        />
        <MetricCard
          icon={<TrendingUp className="w-8 h-8 text-[#e17489]" />}
          title="Glucose"
          value={metrics.glucose.toString()}
          unit="mg/dL"
          onChange={(value) => handleMetricChange('glucose', parseInt(value))}
        />
        <MetricCard
          icon={<HeartPulse className="w-8 h-8 text-[#e17489]" />}
          title="Heart Rate"
          value={metrics.heartRate.toString()}
          unit="bpm"
          onChange={(value) => handleMetricChange('heartRate', parseInt(value))}
        />
      </motion.div>
      <motion.div
        initial="hidden" 
        animate="visible" 
        variants={fadeIn} 
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-[#fff5f9]">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-[#c56679]">Risk Assessment</h3>
              {/* <Button
                variant="outline"
                size="sm"
                onClick={handlePredict}
                className="ml-2 bg-[#e17489] text-white hover:bg-[#c56679]"
              >
                Update Risk
              </Button> */}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                {prediction ? (
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="w-6 h-6 text-[#e17489] mr-2" />
                      <h4 className="text-lg font-semibold text-[#c56679]">Pregnancy Risk Level : {prediction.split(' ')[0].charAt(0).toUpperCase() + prediction.split(' ')[0].slice(1)}</h4>
                    </div>
                    {/* <p className="text-gray-700">{prediction}</p> */}
                    <p className="text-sm text-gray-500 mt-2">
                      This assessment is based on your current metrics. Always consult with your healthcare provider for personalized advice.
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-700">Click &quot;Update Risk&quot; to get your latest risk assessment.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial="hidden" 
        animate="visible" 
        variants={fadeIn} 
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-[#fff5f9]">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-[#c56679]">Fetal Development</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing('fetal')}
                className="ml-2"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                {isEditing === 'fetal' ? (
                  <div className="flex items-center space-x-5">
                    <Slider
                      value={[gestationalAge]}
                      onValueChange={(value: [number]) => setGestationalAge(value[0])}
                      max={40}
                      step={1}
                    />
                    <span>{gestationalAge} weeks</span>
                    <Button onClick={() => {
                      handleMetricChange('gestationalAge', gestationalAge)
                      setIsEditing(null)
                    }}
                    className='ml-4 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:bg-[#e17489] hover:-translate-y-1 hover:scale-105 bg-[#e17489]'
                    >Save</Button>
                  </div>
                ) : (
                  <>
                    <p className="text-lg text-gray-800 mb-2">Your baby is now the size of {metrics.fetalSize} and weighs about {metrics.fetalWeight} lbs.</p>
                    <Progress value={(metrics.gestationalAge/40)*100} max={100} className="w-full h-3" />
                    <p className="text-sm text-gray-800 mt-2">{metrics.gestationalAge} weeks out of 40</p>
                  </>
                )}
              </div>
              <div className="w-32 h-32">
                <Lottie animationData={pregnancyAnimation} loop={true} />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial="hidden" 
          animate="visible" 
          variants={fadeIn} 
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="bg-[#fff5f9]">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-[#c56679]">Upcoming Appointments</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className='rounded-full bg-[#e17489] text-white'>
                      <Plus className="h-4 w-4 mr-2" /> Add Reminder
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='bg-[#fff5f9]'>
                    <DialogHeader>
                      <DialogTitle className='font-bold text-[#c56679]'>Add New Reminder</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="reminder-text" className="text-left">
                          Reminder
                        </Label>
                        <Input
                          id="reminder-text"
                          value={newReminder.text}
                          onChange={(e) => setNewReminder(prev => ({ ...prev, text: e.target.value }))}
                          className="col-span-3 rounded-full"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="reminder-date" className="text-left">
                          Date
                        </Label>
                        <Input
                          id="reminder-date"
                          type="datetime-local"
                          value={newReminder.date}
                          onChange={(e) => setNewReminder(prev => ({ ...prev, date: e.target.value }))}
                          className="col-span-3 rounded-full"
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddReminder} className='text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:bg-[#e17489] hover:-translate-y-1 hover:scale-105 bg-[#e17489]'>Add Reminder</Button>
                  </DialogContent>
                </Dialog>
              </div>
              <ul className="space-y-3">
                <AnimatePresence>
                  {reminders.map(reminder => (
                    <motion.li
                      key={reminder.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <Calendar className="h-6 w-6 text-[#e17489]" />
                      <span className="text-gray-700">{reminder.text}: {new Date(reminder.date).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}</span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial="hidden" 
          animate="visible" 
          variants={fadeIn} 
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="bg-[#fff5f9]">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-[#c56679] mb-4">Daily Tips</h3>
              <ul className="space-y-3">
                <AnimatePresence>
                  {tips.map((tip, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <Info className="h-6 w-6 text-[#e17489] shrink-0 mt-1" />
                      <span className="text-gray-800">{tip}</span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  unit?: string;
  onChange: (value: string) => void;
}

function MetricCard({ icon, title, value, unit = '', onChange }: MetricCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)

  const handleSave = () => {
    onChange(editValue)
    setIsEditing(false)
  }

  return (
    <Card className="bg-[#fff5f9] hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-4 flex flex-col items-center text-center relative">
        {icon}
        <h3 className="text-sm font-semibold mt-2 text-gray-700">{title}</h3>
        {isEditing ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-2 flex items-center"
          >
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-20 text-center rounded-full"
            />
            <Button size="sm" onClick={handleSave} className="ml-4 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:bg-[#e17489] hover:-translate-y-1 hover:scale-105 bg-[#e17489]">
              Save
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-2 flex items-center"
          >
            <p className="text-2xl font-bold text-[#3e5563]">{value} <span className="text-sm text-gray-500">{unit}</span></p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="ml-2"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}