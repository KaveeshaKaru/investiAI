import type { Metadata } from "next"
import Header from "@/components/header"
import DocumentUploader from "@/components/document-uploader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RecentDocuments from "@/components/recent-documents"
import DashboardStats from "@/components/dashboard-stats"

export const metadata: Metadata = {
  title: "Criminal Investigation Document Processing",
  description: "Automated document processing for criminal investigations",
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <div className="container grid items-start gap-6 px-4 py-6 md:px-6 md:py-8">
          <div className="flex flex-col gap-2">
            <h1 className="font-geist-mono text-3xl font-bold tracking-tight text-gray-900">Document Processing</h1>
            <p className="font-geist-mono text-gray-600">Upload case documents for automated information extraction and analysis</p>
          </div>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="font-geist-mono grid w-full grid-cols-3 bg-gray-100">
              <TabsTrigger value="upload">Upload Documents</TabsTrigger>
              <TabsTrigger value="recent">Recent Documents</TabsTrigger>
              <TabsTrigger value="stats">Processing Stats</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="mt-6">
              <DocumentUploader />
            </TabsContent>
            <TabsContent value="recent" className="mt-6">
              <RecentDocuments />
            </TabsContent>
            <TabsContent value="stats" className="mt-6">
              <DashboardStats />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="border-t border-gray-200 bg-gray-50 py-6 text-center text-sm text-gray-500">
        <div className="font-geist-mono container px-4 md:px-6">
          <p>© 2025 Lexa AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
