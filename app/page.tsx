import { DailySchedule } from "@/components/daily-schedule"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <main className="min-h-screen bg-black text-white p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            Daily Schedule
          </h1>
          <DailySchedule />
        </div>
      </main>
    </ThemeProvider>
  )
}
