'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart, Mail, Lock, User } from 'lucide-react'
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function AuthPage() {
  const router = useRouter();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // const [rememberMe, setRememberMe] = useState(false)
  const [fullName, setFullName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(true)
  const [activeTab, setActiveTab] = useState("signin")

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
        console.log('fields:', { signUpEmail, signUpPassword, fullName })

        const response = await axios.post('/api/auth/signup', {
            "name":fullName,
            "email":signUpEmail,
            "password":signUpPassword,
        })
  
        if (response.status === 201) {
          console.log('User created successfully')
          router.push('/auth')
        }
      } catch (error: any) {
        if (error.response) {
          // Server responded with a status other than 2xx
          console.log(error.response || 'Something went wrong')
        } else {
          // Network error or other issues
          console.log('An unexpected error occurred. Please try again.')
        }
      }
  }

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
                        
    if (!email || !password) {
        alert("Please fill in both email and password.");
        return;
    }

    const res = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
    });

    if (res?.error) {
        console.log(res.error);
        console.log("Sign in failed. Please check your credentials.");
    } else {
        console.log(res);
        router.push("/");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex flex-col justify-center items-center p-4">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-6">
          <Heart className="h-12 w-12 text-pink-500" />
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome to MomCare</h1>
        <Card>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="signin">
                <form onSubmit={handleSignin}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input id="email" type="email" placeholder="Enter your email" className="pl-10" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        required/>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input id="password" type="password" placeholder="Enter your password" className="pl-10" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <label htmlFor="remember" className="text-sm text-gray-600">Remember me</label>
                    </div>
                    <Button type="submit" className="w-full">Sign In</Button>
                  </div>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleSignup}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input id="name" placeholder="Enter your full name" className="pl-10" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required/>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input id="email" type="email" placeholder="Enter your email" className="pl-10" 
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        required/>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input id="password" type="password" placeholder="Create a password" className="pl-10" 
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        required/>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" 
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(!!checked)}
                      />
                      <label htmlFor="terms" className="text-sm text-gray-600">I agree to the Terms and Privacy Policy</label>
                    </div>
                    <Button type="submit" className="w-full">Sign Up</Button>
                  </div>
                </form>
              </TabsContent>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-600">
                {activeTab === "signin" ? "Don't have an account? " : "Already have an account? "}
                <Button variant="link" onClick={() => setActiveTab(activeTab === "signin" ? "signup" : "signin")} className="p-0">
                  {activeTab === "signin" ? "Sign up" : "Sign in"}
                </Button>
              </p>
            </CardFooter>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  )
}
