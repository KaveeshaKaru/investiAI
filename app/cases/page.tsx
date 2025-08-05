import type { Metadata } from "next"
import Header from "@/components/header"
import CasesTable from "@/components/cases-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Cases | Lexa AI",
  description: "View and manage all case data extracted from court documents",
}

export default function CasesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <div className="container grid items-start gap-6 px-4 py-6 md:px-6 md:py-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Cases</h1>
            <p className="text-gray-600">View and manage all case data extracted from court documents</p>
          </div>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Case Database</CardTitle>
              <CardDescription className="text-gray-600">
                All extracted court order data with detailed case information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CasesTable />
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="border-t border-gray-200 bg-gray-50 py-6 text-center text-sm text-gray-500">
        <div className="container px-4 md:px-6">
          <p>© 2025 Lexa AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
