import type { Metadata } from "next"
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
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-blue-600 p-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-full text-white"
              >
                <path d="M16 2v5h5" />
                <path d="M21 6v6.5c0 .8-.7 1.5-1.5 1.5h-7c-.8 0-1.5-.7-1.5-1.5v-9c0-.8.7-1.5 1.5-1.5H17l4 4z" />
                <path d="M7 8v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H15" />
                <path d="M3 12v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H11" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">Lexa AI</span>
          </div>
          <nav className="hidden md:flex md:gap-6">
            <a href="/" className="text-sm font-medium text-blue-600">
              Dashboard
            </a>
            <a href="/cases" className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600">
              Cases
            </a>
            <a href="/police-reports" className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600">
              Police Reports
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-bell"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <span className="sr-only">Notifications</span>
            </button>
            <button className="size-8 rounded-full bg-blue-100 text-blue-600">
              <span className="sr-only">Profile</span>
              <span className="flex h-full items-center justify-center text-sm font-medium">JD</span>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container grid items-start gap-6 px-4 py-6 md:px-6 md:py-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Document Processing</h1>
            <p className="text-gray-600">Upload case documents for automated information extraction and analysis</p>
          </div>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100">
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
        <div className="container px-4 md:px-6">
          <p>© 2025 Lexa AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
