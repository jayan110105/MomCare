'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, LogOut, Home, Activity, Apple, Dumbbell, Smile, Baby, Sun} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Dashboard from './components/Dashboard'
import SymptomTracker from './components/SymptomTracker'
import NutritionGuide from './components/NutritionGuide'
import ExerciseTracker from './components/ExerciseTracker'
import MentalHealth from './components/MentalHealth'
import LaborPrep from './components/LaborPrep'
import HeroPage from './components/HeroPage'
import PostpartumCare from './components/PostpartumCare'
import { signOut, useSession } from 'next-auth/react'

const fadeIn = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 }
}

export default function MaternalHealthTracker() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState("dashboard")

  if (!session) {
    return <HeroPage />
  }

  const handleItemClick = (action: string) => {
    if (action === 'logout') {
      signOut({ callbackUrl: '/' })
    } 
  }

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "symptoms", label: "Symptoms", icon: Activity },
    { id: "nutrition", label: "Nutrition", icon: Apple },
    { id: "exercise", label: "Exercise", icon: Dumbbell },
    { id: "mentalhealth", label: "Mental Health", icon: Smile },
    { id: "labor", label: "Labor Prep", icon: Baby },
    { id: "postpartum", label: "Postpartum", icon: Sun },
  ]

  return (
    <div className="min-h-screen bg-[#fadee5] overflow-hidden">
      <motion.header 
        className="p-4 bg-[#fff5f9] shadow-md"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <nav className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-[#e17489]" />
            <span className="text-2xl font-bold text-[#c56679]">MomCare</span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1 ${
                  activeTab === item.id
                    ? "bg-[#e17489] text-white hover:bg-[#e17489]/90"
                    : "bg-[#e17489]/10 text-[#e17489] hover:bg-[#e17489]/20 hover:text-[#e17489]/90"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt="User avatar" />
                    <AvatarFallback>{session?.user?.name ? session.user.name.charAt(0) : 'MC'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session?.user?.name || 'Guest'}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session?.user?.email || 'guest@example.com'}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {navItems.map((item) => (
                  <DropdownMenuItem key={item.id} onClick={() => setActiveTab(item.id)} className="md:hidden">
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem onClick={() => handleItemClick('logout')}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </motion.header>

      <main className="container mx-auto mt-8 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>
          <TabsContent value="symptoms">
            <SymptomTracker />
          </TabsContent>
          <TabsContent value="nutrition">
            <NutritionGuide />
          </TabsContent>
          <TabsContent value="exercise">
            <ExerciseTracker />
          </TabsContent>
          <TabsContent value="mentalhealth">
            <MentalHealth />
          </TabsContent>
          <TabsContent value="labor">
            <LaborPrep />
          </TabsContent>
          <TabsContent value="postpartum">
            <PostpartumCare />
          </TabsContent>
        </Tabs>
      </main>

      <motion.footer 
        className="mt-16 bg-[#fff5f9] py-8"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="container mx-auto text-center">
          <div className="flex justify-center items-center mb-4">
            <Heart className="h-6 w-6 text-[#e17489] mr-2" />
            <span className="text-xl font-bold text-[#c56679]">MomCare Pro</span>
          </div>
          <p className="mt-2 text-gray-500">Always consult with your healthcare provider for medical advice.</p>
        </div>
      </motion.footer>
    </div>
  )
}