'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Card, CardContent} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const schema = yup.object({
  Age: yup.string().required('Age is required'),
  FeelingSadOrTearful: yup.string().required('This field is required'),
  IrritableTowardsBabyAndPartner: yup.string().required('This field is required'),
  TroubleSleepingAtNight: yup.string().required('This field is required'),
  ProblemsConcentratingOrMakingDecision: yup.string().required('This field is required'),
  OvereatingOrLossOfAppetite: yup.string().required('This field is required'),
  FeelingOfGuilt: yup.string().required('This field is required'),
  ProblemsOfBondingWithBaby: yup.string().required('This field is required'),
  SuicideAttempt: yup.string().required('This field is required'),
}).required()

type FormData = yup.InferType<typeof schema>

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function DepressionScreeningQuiz() {
  const [prediction, setPrediction] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post('http://localhost:8000/predict_anxiety', data)
      setPrediction(response.data.prediction)
    } catch (error) {
      console.error('Error:', error)
      setPrediction('Error occurred while predicting')
    }
  }

  return (
    <Card className="bg-[#fff5f9] mt-8">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {[
            { name: 'Age', label: 'Age', options: ['25-30', '30-35', '35-40', '40-45', '45-50'] },
            { name: 'FeelingSadOrTearful', label: 'Feeling sad or Tearful', options: ['Yes', 'Sometimes', 'No'] },
            { name: 'IrritableTowardsBabyAndPartner', label: 'Irritable towards baby & partner', options: ['Yes', 'Sometimes', 'No'] },
            { name: 'TroubleSleepingAtNight', label: 'Trouble sleeping at night', options: ['Yes', 'Two or more days a week', 'No'] },
            { name: 'ProblemsConcentratingOrMakingDecision', label: 'Problems concentrating or making decision', options: ['Yes', 'Often', 'No'] },
            { name: 'OvereatingOrLossOfAppetite', label: 'Overeating or loss of appetite', options: ['Yes', 'No', 'Not at all'] },
            { name: 'FeelingOfGuilt', label: 'Feeling of guilt', options: ['Yes', 'Maybe', 'No'] },
            { name: 'ProblemsOfBondingWithBaby', label: 'Problems of bonding with baby', options: ['Yes', 'Sometimes', 'No'] },
            { name: 'SuicideAttempt', label: 'Suicide attempt', options: ['Yes', 'No'] },
          ].map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block mb-2 text-[#c56679] font-semibold">{field.label}</label>
              <select 
                {...register(field.name as keyof FormData)} 
                className="w-full p-2 border rounded text-[#3e5563] bg-white border-[#e17489]/20 focus:border-[#e17489] focus:ring focus:ring-[#e17489]/50"
              >
                <option value="">Select option</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors[field.name as keyof FormData] && <p className="text-red-500 text-sm mt-1">{errors[field.name as keyof FormData]?.message}</p>}
            </div>
          ))}
          <Button type="submit" className="w-full bg-[#e17489] hover:bg-[#c56679] text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
            Submit
          </Button>
        </form>

        {prediction && (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
            className="mt-8 p-4 bg-white rounded-lg shadow-md"
          >
            <h2 className="text-2xl font-bold mb-4 text-[#c56679]">Prediction Result:</h2>
            <p className="text-xl text-[#3e5563]">{prediction}</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}