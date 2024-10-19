import { useState, useEffect} from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, Info, TrendingUp, Activity, CalendarHeart, HeartPulse , Plus, Edit2 } from 'lucide-react'
import { Slider } from "@/components/ui/slider"
import { useSession } from 'next-auth/react'
import axios from 'axios'

export default function Dashboard() {
  const { data: session } = useSession()

  const [metrics, setMetrics] = useState({
    Age: '26',
    bloodPressure: '120/80',
    glucose: '95',
    heartRate: '80',
    fetalSize: 'ear of corn',
    fetalWeight: '1.3',
    gestationalAge: '24',
  })

  const [tips, setTips] = useState<string[]>([])

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const response = await axios.get('/api/dashboard/pregnancyTips')
        setTips(response.data.tips)
      } catch (error) {
        console.error('Error fetching tips:', error)
      }
    }

    fetchTips()
  }, [])

  useEffect(() => {

    console.log('fetching fetal data for week:', metrics.gestationalAge);

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

  const [reminders, setReminders] = useState([
    { id: 1, text: 'Prenatal Checkup', date: 'July 15, 2024 - 10:00 AM' },
  ])
  const [newReminder, setNewReminder] = useState({ text: '', date: '' })
  const [isEditing, setIsEditing] = useState<string | null>(null)

  const handleMetricChange = (metric: any, value: any) => {
    setMetrics(prev => ({ ...prev, [metric]: value }))
  }

  const handleAddReminder = () => {
    if (newReminder.text && newReminder.date) {
      setReminders(prev => [...prev, { id: Date.now(), ...newReminder }])
      setNewReminder({ text: '', date: '' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Welcome, {session?.user?.name?.split(' ')[0] || 'Guest'}!</h2>
        <div className="text-right">
          <p className="text-xl font-semibold text-pink-500">Week {metrics.gestationalAge}</p>
            <p className="text-sm text-gray-500">
            {parseInt(metrics.gestationalAge) < 13
              ? '1st Trimester'
              : parseInt(metrics.gestationalAge) < 28
              ? '2nd Trimester'
              : '3rd Trimester'}
            </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon={<CalendarHeart className="w-8 h-8 text-indigo-500" />}
          title="Age"
          value={metrics.Age}
          onChange={(value) => handleMetricChange('weight', value)}
        />
        <MetricCard
          icon={<Activity className="w-8 h-8 text-red-500" />}
          title="Blood Pressure"
          value={metrics.bloodPressure}
          unit="mmHg"
          onChange={(value) => handleMetricChange('bloodPressure', value)}
        />
        <MetricCard
          icon={<TrendingUp className="w-8 h-8 text-green-500" />}
          title="Glucose"
          value={metrics.glucose}
          unit="mg/dL"
          onChange={(value) => handleMetricChange('glucose', value)}
        />
        <MetricCard
          icon={<HeartPulse  className="w-8 h-8 text-red-700" />}
          title="Heart Rate"
          value={metrics.heartRate}
          unit="bpm"
          onChange={(value) => handleMetricChange('heartRate', value)}
        />
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Fetal Development</h3>
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
                    value={[parseInt(metrics.gestationalAge)]}
                    onValueChange={(value: [number]) => handleMetricChange('gestationalAge', value[0])}
                    max={40}
                    step={1}
                  />
                  <span>{metrics.gestationalAge} weeks</span>
                  <Button onClick={() => setIsEditing(null)}>Save</Button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-2">Your baby is now the size of {metrics.fetalSize} and weighs about {metrics.fetalWeight}.</p>
                  <Progress value={(parseInt(metrics.gestationalAge)/40)*100} max={100} className="w-full" />
                  <p className="text-xs text-gray-500 mt-1">{metrics.gestationalAge} weeks out of 40</p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Upcoming Appointments</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" /> Add Reminder
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Reminder</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="reminder-text" className="text-right">
                        Reminder
                      </Label>
                      <Input
                        id="reminder-text"
                        value={newReminder.text}
                        onChange={(e) => setNewReminder(prev => ({ ...prev, text: e.target.value }))}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="reminder-date" className="text-right">
                        Date
                      </Label>
                      <Input
                        id="reminder-date"
                        type="datetime-local"
                        value={newReminder.date}
                        onChange={(e) => setNewReminder(prev => ({ ...prev, date: e.target.value }))}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddReminder}>Add Reminder</Button>
                </DialogContent>
              </Dialog>
            </div>
            <ul className="space-y-2">
              {reminders.map(reminder => (
                <li key={reminder.id} className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-pink-500" />
                  <span>{reminder.text}: {new Date(reminder.date).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-xl font-semibold mb-4">Daily Tips</h3>
            <ul className="space-y-2">
                {tips.map((tip, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <Info className="h-5 w-5 text-blue-500 shrink-0" />
                  <span>{tip}</span>
                </li>
                ))}
            </ul>
          </CardContent>
        </Card>
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
    <Card>
      <CardContent className="p-4 flex flex-col items-center text-center relative">
        {icon}
        <h3 className="text-sm font-semibold mt-2">{title}</h3>
        {isEditing ? (
          <div className="mt-2 flex items-center">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-20 text-center"
            />
            <Button size="sm" onClick={handleSave} className="ml-2">
              Save
            </Button>
          </div>
        ) : (
          <div className="mt-2 flex items-center">
            <p className="text-2xl font-bold">{value} {unit}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="ml-2"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}