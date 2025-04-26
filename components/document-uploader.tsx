"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileType, File, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DocumentUploader() {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [uploadStatus, setUploadStatus] = useState<Record<string, "idle" | "uploading" | "success" | "error">>({})

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList)
    setFiles((prev) => [...prev, ...newFiles])

    // Initialize progress and status for each file
    newFiles.forEach((file) => {
      setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }))
      setUploadStatus((prev) => ({ ...prev, [file.name]: "idle" }))
    })
  }

  const uploadFiles = () => {
    files.forEach((file) => {
      if (uploadStatus[file.name] === "idle") {
        simulateUpload(file)
      }
    })
  }

  const simulateUpload = (file: File) => {
    setUploadStatus((prev) => ({ ...prev, [file.name]: "uploading" }))

    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 10
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setUploadStatus((prev) => ({ ...prev, [file.name]: "success" }))
      }
      setUploadProgress((prev) => ({ ...prev, [file.name]: progress }))
    }, 300)
  }

  const removeFile = (fileName: string) => {
    setFiles((prev) => prev.filter((file) => file.name !== fileName))
    setUploadProgress((prev) => {
      const newProgress = { ...prev }
      delete newProgress[fileName]
      return newProgress
    })
    setUploadStatus((prev) => {
      const newStatus = { ...prev }
      delete newStatus[fileName]
      return newStatus
    })
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    switch (extension) {
      case "pdf":
        return <FileType className="h-6 w-6 text-red-500" />
      case "doc":
      case "docx":
        return <FileType className="h-6 w-6 text-blue-500" />
      case "jpg":
      case "jpeg":
      case "png":
        return <FileType className="h-6 w-6 text-green-500" />
      case "csv":
      case "xls":
      case "xlsx":
        return <FileType className="h-6 w-6 text-emerald-500" />
      default:
        return <File className="h-6 w-6 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100">
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="url">From URL</TabsTrigger>
        </TabsList>
        <TabsContent value="upload" className="mt-4">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Document Upload</CardTitle>
              <CardDescription className="text-gray-600">
                Upload case documents for automated information extraction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
                  isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="mb-4 rounded-full bg-blue-100 p-3">
                  <Upload className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">Drag and drop files here</h3>
                <p className="mb-4 text-sm text-gray-600">or click to browse from your computer</p>
                <input
                  type="file"
                  multiple
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.csv,.txt"
                />
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
                    JPG
                  </Badge>
                  <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
                    PNG
                  </Badge>
                  <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
                    PDF
                  </Badge>
                  <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
                    DOCX
                  </Badge>
                  <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
                    CSV
                  </Badge>
                  <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
                    TXT
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-gray-500">Maximum file size: 20MB</p>
              </div>

              {files.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h4 className="font-medium text-gray-900">Selected Files</h4>
                  <div className="rounded-lg border border-gray-200 divide-y divide-gray-200">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file.name)}
                          <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          {uploadStatus[file.name] === "success" ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : uploadStatus[file.name] === "error" ? (
                            <AlertCircle className="h-5 w-5 text-red-600" />
                          ) : uploadStatus[file.name] === "uploading" ? (
                            <div className="w-24">
                              <Progress value={uploadProgress[file.name]} className="h-2" />
                            </div>
                          ) : null}
                          <button
                            onClick={() => removeFile(file.name)}
                            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 6 6 18" />
                              <path d="m6 6 12 12" />
                            </svg>
                            <span className="sr-only">Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t border-gray-200 pt-6">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                Cancel
              </Button>
              <Button
                onClick={uploadFiles}
                disabled={files.length === 0}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Process Documents
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="url" className="mt-4">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Import from URL</CardTitle>
              <CardDescription className="text-gray-600">
                Enter the URL of the document you want to process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="url" className="text-sm font-medium text-gray-700">
                    Document URL
                  </label>
                  <input
                    id="url"
                    type="url"
                    placeholder="https://example.com/document.pdf"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="document-type" className="text-sm font-medium text-gray-700">
                    Document Type
                  </label>
                  <select
                    id="document-type"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select document type</option>
                    <option value="police-report">Police Report</option>
                    <option value="witness-statement">Witness Statement</option>
                    <option value="court-order">Court Order</option>
                    <option value="evidence-log">Evidence Log</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-gray-200 pt-6">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                Cancel
              </Button>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">Import Document</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Processing Features</CardTitle>
          <CardDescription className="text-gray-600">
            Select which information to extract from your documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 4v10.54a4 4 0 1 1-4-4" />
                </svg>
              </div>
              <h3 className="mb-1 font-medium text-gray-900">OCR Text Extraction</h3>
              <p className="text-sm text-gray-600">Extract text from images and scanned documents</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="mb-1 font-medium text-gray-900">Entity Recognition</h3>
              <p className="text-sm text-gray-600">Identify people, locations, dates, and other key information</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3v12" />
                  <path d="m8 11 4 4 4-4" />
                  <path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4" />
                </svg>
              </div>
              <h3 className="mb-1 font-medium text-gray-900">Data Structuring</h3>
              <p className="text-sm text-gray-600">Convert unstructured text into structured, searchable data</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
