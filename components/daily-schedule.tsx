"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle2 } from "lucide-react"

// Schedule data based on the provided table
const scheduleData = [
  { time: "07:30", activity: "Wake up, light mobility, water, no phone till 8" },
  { time: "08:00", activity: "1st job block: Apply for 2–3 jobs, LinkedIn, etc." },
  { time: "09:00", activity: "Guitar practice (30 min), song practice/recording" },
  { time: "09:45", activity: "Business work (learn/build/scale, 60 min)" },
  { time: "11:00", activity: "Gym + Walk (combined steps + lifting, ~2 hrs total)" },
  { time: "13:15", activity: "Shower, lunch (high protein, 1500 cal plan)" },
  { time: "14:00", activity: "2nd job block: Interview prep or coding project" },
  { time: "15:30", activity: "Break / light housework or short walk" },
  { time: "16:00", activity: "Business research, outreach, content, etc." },
  { time: "17:30", activity: "Guitar or edit/post IG content (30–60 min)" },
  { time: "18:30", activity: "Dinner, screen-free wind down" },
  { time: "19:30", activity: "Marathon training (run days only, 3x/week)" },
  { time: "20:30", activity: "Relax: podcast, read, or journaling" },
  { time: "22:00", activity: "Sleep routine begins (lights out by 10:30 PM)" },
]

export function DailySchedule() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [dayProgress, setDayProgress] = useState(0)
  const [use24HourFormat, setUse24HourFormat] = useState(false)

  useEffect(() => {
    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Calculate day progress (from 7:30 AM to 10:30 PM)
    const startTime = new Date(currentTime)
    startTime.setHours(7, 30, 0, 0)

    const endTime = new Date(currentTime)
    endTime.setHours(22, 30, 0, 0)

    const totalDayMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60)
    const elapsedMinutes = Math.max(0, (currentTime.getTime() - startTime.getTime()) / (1000 * 60))

    const progress = Math.min(100, Math.max(0, (elapsedMinutes / totalDayMinutes) * 100))
    setDayProgress(progress)
  }, [currentTime])

  // Format current time for display
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !use24HourFormat,
  })

  // Determine current activity
  const getCurrentActivity = () => {
    const currentHour = currentTime.getHours()
    const currentMinute = currentTime.getMinutes()
    const currentTimeValue = currentHour * 60 + currentMinute

    for (let i = 0; i < scheduleData.length - 1; i++) {
      const [startHour, startMinute] = scheduleData[i].time.split(":").map(Number)
      const [nextHour, nextMinute] = scheduleData[i + 1].time.split(":").map(Number)

      const startTimeValue = startHour * 60 + startMinute
      const nextTimeValue = nextHour * 60 + nextMinute

      if (currentTimeValue >= startTimeValue && currentTimeValue < nextTimeValue) {
        return i
      }
    }

    // Check if we're in the last time slot
    const [lastHour, lastMinute] = scheduleData[scheduleData.length - 1].time.split(":").map(Number)
    const lastTimeValue = lastHour * 60 + lastMinute

    if (currentTimeValue >= lastTimeValue) {
      return scheduleData.length - 1
    }

    // Before the first activity
    return -1
  }

  const currentActivityIndex = getCurrentActivity()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-blue-400" />
          <span className="text-xl font-mono">{formattedTime}</span>
          <button
            onClick={() => setUse24HourFormat(!use24HourFormat)}
            className="ml-2 px-2 py-1 text-xs rounded bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            {use24HourFormat ? "12h" : "24h"}
          </button>
        </div>
        <div className="text-sm text-gray-400">Day Progress</div>
      </div>

      <Progress value={dayProgress} className="h-2 bg-gray-800" />

      <div className="space-y-3">
        {scheduleData.map((item, index) => {
          // Determine the status of this time block
          const isPast = index < currentActivityIndex
          const isCurrent = index === currentActivityIndex
          const isFuture = index > currentActivityIndex

          return (
            <Card
              key={index}
              className={`p-4 border-l-4 transition-all duration-300 ${
                isCurrent
                  ? "border-l-blue-500 bg-blue-900/20"
                  : isPast
                    ? "border-l-green-500 bg-gray-900/50 opacity-70"
                    : "border-l-gray-700 bg-gray-900/30"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className={`font-mono text-lg ${isCurrent ? "text-blue-400" : ""}`}>{item.time}</span>
                    {isPast && <CheckCircle2 className="ml-2 h-4 w-4 text-green-500" />}
                    {isCurrent && <span className="ml-2 h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>}
                  </div>
                  <p
                    className={`mt-1 ${isCurrent ? "text-white font-medium" : isFuture ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {item.activity}
                  </p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
