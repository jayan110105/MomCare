import { motion } from 'framer-motion'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Sun, Utensils, Moon, Cookie, Apple } from 'lucide-react'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function NutritionGuide() {
  const [nutritionValues, setNutritionValues] = useState({
    calories: { value: 1200, target: 2400 },
    protein: { value: 35, target: 71 },
    fats: { value: 37, target: 75 },
    carbs: { value: 100, target: 200 },
    fibre: { value: 14, target: 28 }
  })

  const handleNutritionChange = (
    nutrient: 'calories' | 'protein' | 'fats' | 'carbs' | 'fibre',
    field: 'value' | 'target',
    newValue: number
  ) => {
    setNutritionValues(prev => ({
      ...prev,
      [nutrient]: { ...prev[nutrient], [field]: newValue }
    }));
  };

  return (
    <div className="space-y-6">
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Nutritional Guidance</h2>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.2 }}>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Nutrition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
            <NutritionProgress
                  title="Calories"
                  nutrient="calories"
                  value={nutritionValues.calories.value}
                  target={nutritionValues.calories.target}
                  onChange={handleNutritionChange}
                />
                <NutritionProgress
                  title="Protein"
                  nutrient="protein"
                  value={nutritionValues.protein.value}
                  target={nutritionValues.protein.target}
                  onChange={handleNutritionChange}
                />
                <NutritionProgress
                  title="Fats"
                  nutrient="fats"
                  value={nutritionValues.fats.value}
                  target={nutritionValues.fats.target}
                  onChange={handleNutritionChange}
                />
                <NutritionProgress
                  title="Carbs"
                  nutrient="carbs"
                  value={nutritionValues.carbs.value}
                  target={nutritionValues.carbs.target}
                  onChange={handleNutritionChange}
                />
                <NutritionProgress
                  title="Fibre"
                  nutrient="fibre"
                  value={nutritionValues.fibre.value}
                  target={nutritionValues.fibre.target}
                  onChange={handleNutritionChange}
                />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Meal Plan Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
            <MealSuggestion
                    icon={<Sun className="h-5 w-5 text-orange-500" />}
                    meal="Breakfast"
                    suggestion="Whole grain toast with avocado and a boiled egg"
                  />
                  <MealSuggestion
                    icon={<Utensils className="h-5 w-5 text-green-500" />}
                    meal="Lunch"
                    suggestion="Spinach salad with grilled chicken and mixed nuts"
                  />
                  <MealSuggestion
                    icon={<Moon className="h-5 w-5 text-blue-500" />}
                    meal="Dinner"
                    suggestion="Baked salmon with quinoa and steamed broccoli"
                  />
                  <MealSuggestion
                    icon={<Cookie className="h-5 w-5 text-yellow-500" />}
                    meal="Snack"
                    suggestion="Greek yogurt with berries and chia seeds"
                  />
            </ul>
          </CardContent>
        </Card>
      </div>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Apple className="w-6 h-6 mr-2 text-red-500" />
              Nutrition Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
          <p className="mb-4">Based on your recent iron levels, here are some iron-rich foods to include in your diet:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Lean red meat</li>
            <li>Spinach and other leafy greens</li>
            <li>Beans and lentils</li>
            <li>Fortified cereals</li>
            <li>Dried fruits like raisins and apricots</li>
          </ul>
          <p className="mt-4 text-sm text-gray-600">Remember to pair these with vitamin C-rich foods to enhance iron absorption.</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

interface NutritionProgressProps {
  title: string;
  nutrient: 'calories' | 'protein' | 'fats' | 'carbs' | 'fibre';
  value: number;
  target: number;
  onChange: (nutrient: 'calories' | 'protein' | 'fats' | 'carbs' | 'fibre', field: 'value' | 'target', newValue: number) => void;
}

function NutritionProgress({ title, nutrient, value, target, onChange }: NutritionProgressProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span>{title}</span>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(nutrient, 'value', parseFloat(e.target.value))}
            className="w-20 px-2 py-1 text-right border rounded"
          />
          <span>/</span>
          <input
            type="number"
            value={target}
            onChange={(e) => onChange(nutrient, 'target', parseFloat(e.target.value))}
            className="w-20 px-2 py-1 text-right border rounded"
          />
          <span>{title === 'Calories' ? 'kcal' : 'g'}</span>
        </div>
      </div>
      <Progress value={(value/target) * 100} max={100} className="w-full" />
    </div>
  )
}

function MealSuggestion({ icon, meal, suggestion }: { icon: React.ReactNode; meal: string; suggestion: string }) {
  return (
    <div className="flex items-center space-x-2">
      {icon}
      <div>
        <span className="font-semibold">{meal}:</span> {suggestion}
      </div>
    </div>
  )
}