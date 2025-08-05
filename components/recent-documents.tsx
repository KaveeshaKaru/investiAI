"use client"

import { useState, useEffect } from "react"
import { Search, Filter, FileText, Download, Trash2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IDocument } from "@/models/Document"
import { useToast } from "@/components/ui/use-toast"

export default function RecentDocuments() {
  const [documents, setDocuments] = useState<IDocument[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch("/api/documents")
        const data = await response.json()
        if (data.success) {
          setDocuments(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch documents:", error)
      }
    }

    fetchDocuments()
  }, [])

  const deleteDocument = async (id: string) => {
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setDocuments(documents.filter((doc) => doc._id !== id))
        toast({
          title: "Success",
          description: "Document deleted successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete document.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to delete document:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: IDocument["status"]) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Processed</Badge>
      case "uploading":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">Processing</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-200">Failed</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">Pending</Badge>
    }
  }

  const getTypeBadge = (docType: IDocument["docType"]) => {
    switch (docType) {
      case "policeReport":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">Police Report</Badge>
      case "courtOrder":
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">Court Order</Badge>
      default:
        return <Badge>{docType}</Badge>
    }
  }

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-gray-900">Recent Documents</CardTitle>
        <CardDescription className="text-gray-600">View and manage your recently processed documents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search documents..."
              className="w-full border-gray-300 pl-10 text-gray-900 placeholder-gray-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
              View All
            </Button>
          </div>
        </div>

        <div className="overflow-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Document Name
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-700">Size</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {documents.map((doc) => (
                <tr key={doc._id as string} className="bg-white hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-4 text-sm">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <span className="font-medium text-gray-900">{doc.fileName}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm">{getTypeBadge(doc.docType)}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm">{getStatusBadge(doc.status)}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">{new Date(doc.createdAt).toLocaleDateString()}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-gray-700"
                        onClick={() => deleteDocument(doc._id as string)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px] bg-white text-gray-900 border-gray-200">
                          <DropdownMenuLabel>Options</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-gray-200" />
                          <DropdownMenuItem className="focus:bg-gray-100 focus:text-gray-900">
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-gray-100 focus:text-gray-900">
                            Edit Metadata
                          </DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-gray-100 focus:text-gray-900">
                            Share Document
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-200" />
                          <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
