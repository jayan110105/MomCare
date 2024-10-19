"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, LogOut } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Dashboard from './components/Dashboard'
// import Milestones from './components/Milestones'
import SymptomTracker from './components/SymptomTracker'
import NutritionGuide from './components/NutritionGuide'
import ExerciseTracker from './components/ExerciseTracker'
import MentalHealth from './components/MentalHealth'
import LaborPrep from './components/LaborPrep'
import PostpartumCare from './components/PostpartumCare'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
// import { useRouter } from 'next/navigation'

export default function MaternalHealthTracker() {
  // const router = useRouter()

  const { data: session } = useSession()

  const [activeTab, setActiveTab] = useState("dashboard")

  const handleItemClick = (action: string) => {
    if (action === 'logout') {
      signOut({ callbackUrl: '/auth' })
    } 
    // else if (action === 'settings') {
    //  Navigate to settings page
    //   router.push('/settings')
    // } else if (action === 'profile') {
    //  router.push('/profile')
    // }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-white">
      <header className="p-4 bg-white shadow-md">
        <nav className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-pink-500" />
            <span className="text-xl font-bold text-gray-800">MomCare Pro</span>
          </div>
          <div className="space-x-2 flex-wrap">
            <Button variant="ghost" size="sm" onClick={() => setActiveTab("dashboard")}>Dashboard</Button>
            {/* <Button variant="ghost" size="sm" onClick={() => setActiveTab("milestones")}>Milestones</Button> */}
            <Button variant="ghost" size="sm" onClick={() => setActiveTab("symptoms")}>Symptoms</Button>
            <Button variant="ghost" size="sm" onClick={() => setActiveTab("nutrition")}>Nutrition</Button>
            <Button variant="ghost" size="sm" onClick={() => setActiveTab("exercise")}>Exercise</Button>
            <Button variant="ghost" size="sm" onClick={() => setActiveTab("mentalhealth")}>Mental Health</Button>
            <Button variant="ghost" size="sm" onClick={() => setActiveTab("labor")}>Labor Prep</Button>
            <Button variant="ghost" size="sm" onClick={() => setActiveTab("postpartum")}>Postpartum</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt="User avatar" />
                    <AvatarFallback>{session?.user?.name ? session.user.name.charAt(0) : 'SC'}</AvatarFallback>
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
                {/* <DropdownMenuItem onClick={() => handleItemClick('profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleItemClick('settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator /> */}
                <DropdownMenuItem onClick={() => handleItemClick('logout')}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </header>

      <main className="container mx-auto mt-8 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>
          {/* <TabsContent value="milestones">
            <Milestones />
          </TabsContent> */}
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

      <footer className="mt-16 bg-gray-100 py-8">
        <div className="container mx-auto text-center text-gray-600">
          <p>&copy; 2024 MomCare Pro. All rights reserved.</p>
          <p className="mt-2">Always consult with your healthcare provider for medical advice.</p>
        </div>
      </footer>
    </div>
  )
}