import type { Metadata } from "next"
import Header from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PoliceReportsTable from "@/components/police-reports-table"
import PredictionsTable from "@/components/predictions-table"

export const metadata: Metadata = {
  title: "Police Reports | Lexa AI",
  description: "View and manage all data extracted from police reports",
}

export default function PoliceReportsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <div className="container grid items-start gap-6 px-4 py-6 md:px-6 md:py-8">
          <div className="flex flex-col gap-2 font-geist-mono">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Police Reports</h1>
            <p className="text-gray-600">View and manage all data extracted from police reports</p>
          </div>

          <Card className="bg-white border-gray-200">
            <CardHeader className="font-geist-mono">
              <CardTitle className="text-gray-900">Police Report Database</CardTitle>
              <CardDescription className="text-gray-600">
                All extracted police report data with detailed information
              </CardDescription>
            </CardHeader>
            <CardContent>
                <PoliceReportsTable />
            </CardContent>
          </Card>

          <div className="mt-8">
            <PredictionsTable />
          </div>
        </div>
      </main>
      <footer className="border-t border-gray-200 bg-gray-50 py-6 text-center text-sm text-gray-500 font-geist-mono">
        <div className="container px-4 md:px-6">
          <p>© 2025 Lexa AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}