"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Upload, FileType, File, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import CasesResult from "./cases-result"
import { CourtCase, PoliceReport } from "@/lib/types"
import { IDocument } from "@/models/Document"

type ExtractedData = {
  courtOrders: CourtCase[]
  policeReports: PoliceReport[]
}

export default function DocumentUploader() {
  const { toast } = useToast()
  const [documents, setDocuments] = useState<IDocument[]>([])
  const [fileObjects, setFileObjects] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [uploadStatus, setUploadStatus] = useState<Record<string, "idle" | "uploading" | "success" | "error">>({})
  const [extractedData, setExtractedData] = useState<ExtractedData>({ courtOrders: [], policeReports: [] })
  const [docType, setDocType] = useState<"courtOrder" | "policeReport">("courtOrder")

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch('/api/documents');
        const data = await response.json();
        if (data.success) {
          setDocuments(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch documents', error);
      }
    };
    fetchDocuments();
  }, []);

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

  const handleFiles = async (fileList: FileList) => {
    const newFileObjects = Array.from(fileList)
    setFileObjects(prev => [...prev, ...newFileObjects])
    setExtractedData({ courtOrders: [], policeReports: [] })

    for (const file of newFileObjects) {
      const newDocument = {
        fileName: file.name,
        fileSize: file.size,
        docType: docType,
        status: 'pending',
      }

      try {
        const response = await fetch('/api/documents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newDocument),
        });
        const data = await response.json();
        if (data.success) {
          setDocuments(prev => [...prev, data.data]);
        } else {
          toast({
            title: "Error",
            description: "Failed to save document to database",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Failed to save document', error);
      }
    }
  }

  const saveToDatabase = async (data: any) => {
    try {
      const endpoint = docType === 'policeReport' ? '/api/police-reports' : '/api/court-cases';
      
      // Log the data being sent to help debug
      console.log('Saving to database:', { endpoint, data });
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to save ${docType} to database`);
      }

      const savedData = await response.json();
      console.log('Successfully saved:', savedData);
      return savedData;
    } catch (error: any) {
      console.error('Error saving to database:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to save ${docType} to database`,
        variant: "destructive",
      });
      throw error;
    }
  };

  const uploadFiles = async () => {
    if (fileObjects.length === 0) return;
    const file = fileObjects[0];
    const document = documents.find(doc => doc.fileName === file.name && doc.status === 'pending');

    if (!document) {
      toast({
        title: "Error",
        description: "Document not found or already processed.",
        variant: "destructive",
      });
      return;
    }

    try {
      await fetch(`/api/documents/${document._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'uploading' }),
      });
      setDocuments(prev => prev.map(doc => doc._id === document._id ? { ...doc, status: 'uploading' } as IDocument : doc));
      
      const formData = new FormData()
      formData.append("file", file)
      formData.append("docType", docType)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process document');
      }

      const data = await response.json()
      
      if (docType === 'courtOrder') {
        const newCases: CourtCase[] = data.cases
        const savedCases = await Promise.all(
          newCases.map(caseData => saveToDatabase(caseData))
        )
        setExtractedData(prev => ({...prev, courtOrders: savedCases}))
        
        toast({
          title: "Success",
          description: `Successfully processed and saved ${savedCases.length} court orders`,
        })
      } else if (docType === 'policeReport') {
        const newReports: PoliceReport[] = data.cases
        const savedReports = await Promise.all(
          newReports.map(reportData => saveToDatabase(reportData))
        )
        setExtractedData(prev => ({...prev, policeReports: savedReports}))
        
        toast({
          title: "Success",
          description: `Successfully processed and saved ${savedReports.length} police reports`,
        })
      }

      await fetch(`/api/documents/${document._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'success' }),
      });
      setDocuments(prev => prev.map(doc => doc._id === document._id ? { ...doc, status: 'success' } as IDocument : doc));
      
      setTimeout(() => {
        setFileObjects(prev => prev.filter(f => f.name !== file.name));
        setDocuments(prev => prev.filter(doc => doc._id !== document._id));
      }, 1500);

    } catch (error: any) {
      console.error('Upload error:', error)
      if (document) {
        await fetch(`/api/documents/${document._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'error' }),
        });
        setDocuments(prev => prev.map(doc => doc._id === document._id ? { ...doc, status: 'error' } as IDocument : doc));
      }
      toast({
        title: "Error",
        description: error.message || "Failed to process and save document",
        variant: "destructive",
      })
    }
  }

  const dismissFile = (documentId: string) => {
    const docToDismiss = documents.find(doc => doc._id === documentId);
    if (!docToDismiss) return;

    setDocuments(prev => prev.filter(doc => doc._id !== documentId));
    setFileObjects(prev => prev.filter(f => f.name !== docToDismiss.fileName));
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
              <div className="mb-4">
                <Select value={docType} onValueChange={(value) => setDocType(value as "courtOrder" | "policeReport")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="courtOrder">Court Order</SelectItem>
                    <SelectItem value="policeReport">Police Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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

              {documents.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h4 className="font-medium text-gray-900">Selected Files</h4>
                  <div className="rounded-lg border border-gray-200 divide-y divide-gray-200">
                    {documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(doc.fileName)}
                          <div>
                            <p className="font-medium text-gray-900">{doc.fileName}</p>
                            <p className="text-xs text-gray-600">{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          {doc.status === "success" ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : doc.status === "error" ? (
                            <AlertCircle className="h-5 w-5 text-red-600" />
                          ) : doc.status === "uploading" ? (
                            <div className="w-24">
                              <Progress value={uploadProgress[doc.fileName]} className="h-2" />
                            </div>
                          ) : null}
                          <button
                            onClick={() => dismissFile(doc._id as string)}
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
                            <span className="sr-only">Dismiss</span>
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
                disabled={fileObjects.length === 0 || documents.every(d => d.status !== 'pending')}
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
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-200 pt-6">
              <Button className="ml-auto bg-blue-600 text-white hover:bg-blue-700">Process URL</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      {(extractedData.courtOrders.length > 0 || extractedData.policeReports.length > 0) && (
        <div className="mt-6">
          <CasesResult cases={extractedData.courtOrders} policeReports={extractedData.policeReports} docType={docType} />
        </div>
      )}
    </div>
  )
}