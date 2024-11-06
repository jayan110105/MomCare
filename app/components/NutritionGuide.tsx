import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Utensils, Edit2, RefreshCw  } from 'lucide-react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
}

export default function NutritionGuide() {
  const { data: session } = useSession()

  const [nutritionValues, setNutritionValues] = useState({
    calories: { value: 1200, target: 2400 },
    protein: { value: 35, target: 71 },
    fats: { value: 37, target: 75 },
    carbs: { value: 100, target: 200 },
    fibre: { value: 14, target: 28 },
    iron: { value: 14, target: 27 }
  })

  const [isVegetarian, setIsVegetarian] = useState(false)
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleNutritionChange = (
    nutrient: 'calories' | 'protein' | 'fats' | 'carbs' | 'fibre' | 'iron',
    field: 'value' | 'target',
    newValue: number
  ) => {
    const updatedNutrition = {
      ...nutritionValues,
      [nutrient]: { ...nutritionValues[nutrient], [field]: newValue }
    };

    setNutritionValues(updatedNutrition);
    handleSaveNutition(updatedNutrition);
  };

  useEffect(() => {
    const fetchNutrition = async () => {
      if (session) {
        try {
          const nutritionResponse = await axios.get(`/api/nutrition?userid=${(session?.user as any)?.id}`);
          if(nutritionResponse.data) 
            setNutritionValues(nutritionResponse.data);
          console.log('Nutrition:', nutritionResponse.data);
          fetchNutritionRecommendations();
        } catch (error) {
          console.error('Error fetching nutrition:', error);
        }
      }
    }
    fetchNutrition();
  }, [session])

  async function fetchNutritionRecommendations() {
    try {
      const response = await axios.post('http://localhost:8000/recommendations/', {
        calories: nutritionValues.calories.target- nutritionValues.calories.value,
        fats: nutritionValues.fats.target - nutritionValues.fats.value,
        proteins: nutritionValues.protein.target - nutritionValues.protein.value,
        iron: nutritionValues.iron.target - nutritionValues.iron.value,
        carbohydrates: nutritionValues.carbs.target - nutritionValues.carbs.value,
        fibre: nutritionValues.fibre.target - nutritionValues.fibre.value,
        veg_only: isVegetarian ? 1 : 0
      });
      const foodItems = response.data.recommendations.map((item: { Food_items: string }) => item.Food_items);
      console.log('Recommendations:', foodItems);
      setRecommendations(foodItems || []);
    } catch (error) {
      console.error('Error fetching nutrition recommendations:', error);
    }
  }

  const handleSaveNutition = async (updatedNutrition: typeof nutritionValues) => {
    if (session) {
      try {
        const body = {
          userId: parseInt((session?.user as any)?.id, 10),
          calorie: updatedNutrition.calories.value,
          calorieReq: updatedNutrition.calories.target,
          protein: updatedNutrition.protein.value,
          proteinReq: updatedNutrition.protein.target,
          fats: updatedNutrition.fats.value,
          fatsReq: updatedNutrition.fats.target,
          carbs: updatedNutrition.carbs.value,
          carbsReq: updatedNutrition.carbs.target,
          fibre: updatedNutrition.fibre.value,
          fibreReq: updatedNutrition.fibre.target,
          iron: updatedNutrition.iron.value,
          ironReq: updatedNutrition.iron.target,
          createdAt: new Date(),
        };
        await axios.post('/api/nutrition', body);
        console.log('Nutrition saved:', body);
      } catch (error) {
        console.error('Error updating nutrition:', (error as any).response.data);
      }
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold text-[#c56679] mb-6">Nutritional Guidance</h2>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: 0.2 }}>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-[#fff5f9]">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#c56679]">Today's Nutrition</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <NutritionProgress
                  title="Calories"
                  nutrient="calories"
                  value={nutritionValues.calories.value}
                  target={nutritionValues.calories.target}
                  onChange={handleNutritionChange}
                  color="green"
                />
                <NutritionProgress
                  title="Protein"
                  nutrient="protein"
                  value={nutritionValues.protein.value}
                  target={nutritionValues.protein.target}
                  onChange={handleNutritionChange}
                  color="blue"
                />
                <NutritionProgress
                  title="Fats"
                  nutrient="fats"
                  value={nutritionValues.fats.value}
                  target={nutritionValues.fats.target}
                  onChange={handleNutritionChange}
                  color="yellow"
                />
                <NutritionProgress
                  title="Carbs"
                  nutrient="carbs"
                  value={nutritionValues.carbs.value}
                  target={nutritionValues.carbs.target}
                  onChange={handleNutritionChange}
                  color="orange"
                />
                <NutritionProgress
                  title="Fibre"
                  nutrient="fibre"
                  value={nutritionValues.fibre.value}
                  target={nutritionValues.fibre.target}
                  onChange={handleNutritionChange}
                  color="purple"
                />
                <NutritionProgress
                  title="Iron"
                  nutrient="iron"
                  value={nutritionValues.iron.value}
                  target={nutritionValues.iron.target}
                  onChange={handleNutritionChange}
                  color="purple"
                />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#fff5f9]">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#c56679]">
                <div className='flex justify-between items-center'>
                  <div>Nutrition Tips</div>
                  <div className="flex items-center space-x-2">
                  <Checkbox
                    id="vegetarian"
                    checked={isVegetarian}
                    onCheckedChange={(checked) => {
                      setIsVegetarian(checked as boolean)
                      fetchNutritionRecommendations()
                    }}
                  />
                  <Label
                    htmlFor="vegetarian"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Vegetarian meals only
                  </Label>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-lg text-[#c56679]">Based on your nutritional needs:</p>
                </div>
                <AnimatePresence>
                  {recommendations.map((item, index) => (
                    <motion.div
                      key={index}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={slideIn}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-3 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="bg-[#fadee5] p-2 rounded-full">
                        <Utensils className="h-5 w-5 text-[#e17489]" />
                      </div>
                      <span className="flex-grow">{item}</span>
                      <Badge variant="outline" className="text-[#e17489] border-[#e17489]">
                        {['High Protein', 'Iron-rich', 'Fiber-packed', 'Low-fat'][index % 4]}
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {recommendations.length === 0 && !isLoading && (
                  <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-center font-semibold text-sm text-[#c56679] bg-[#fadee5] p-4 rounded-lg"
                  >
                    No specific recommendations at the moment. Keep maintaining a balanced diet!
                  </motion.p>
                )}
                {isLoading && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="flex justify-center items-center h-32"
                  >
                    <RefreshCw className="h-8 w-8 text-[#e17489] animate-spin" />
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}

interface NutritionProgressProps {
  title: string;
  nutrient: 'calories' | 'protein' | 'fats' | 'carbs' | 'fibre' | 'iron';
  value: number;
  target: number;
  onChange: (nutrient: 'calories' | 'protein' | 'fats' | 'carbs' | 'fibre' | 'iron', field: 'value' | 'target', newValue: number) => void;
  color: string;
}

function NutritionProgress({ title, nutrient, value, target, onChange, color }: NutritionProgressProps) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className={`font-semibold text-gray-700`}>{title}</span>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <Input
                type="number"
                value={value}
                onChange={(e) => onChange(nutrient, 'value', parseFloat(e.target.value))}
                className="w-20 text-right"
              />
              <span>/</span>
              <Input
                type="number"
                value={target}
                onChange={(e) => onChange(nutrient, 'target', parseFloat(e.target.value))}
                className="w-20 text-right"
              />
              <Button size="sm" onClick={() => setIsEditing(false)}>Save</Button>
            </>
          ) : (
            <>
              <motion.span
                key={value}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-lg font-bold"
              >
                {value} / {target}
              </motion.span>
              <span>{title === 'Calories' ? 'kcal' : 'g'}</span>
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      <Progress value={(value/target) * 100} max={100} className={`w-full h-2`} />
    </div>
  )
}

function MealSuggestion({ icon, meal, suggestion }: { icon: React.ReactNode; meal: string; suggestion: string }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={slideIn}
      className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm"
    >
      <div className="bg-[#e17489] p-2 rounded-full">{icon}</div>
      <div>
        <span className="font-semibold text-[#cf4477]">{meal}:</span>
        <p className="text-gray-600">{suggestion}</p>
      </div>
    </motion.div>
  )
}