"use client"

import { useEffect, useState } from "react"
import {
  Search,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Trash,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Case = {
  id: string
  caseId: string
  courtOrderDate: string
  courtLocation: string
  victimStatement: string
  plaintiffAge: string
  plaintiffGender: string
  perpetratorStatement: string
  defendantAge: string
  defendantGender: string
  chargeOffense: string
  courtRuling: string
  sentenceFine: string
  courtAction: string
  evidenceSummary: string
  status: "closed" | "pending" | "active"
  recurrence: string
  documentId: string
}

export default function CasesTable() {
  const [cases, setCases] = useState<Case[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<keyof Case>("courtOrderDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const itemsPerPage = 10

  useEffect(() => {
    const storedCases = localStorage.getItem("cases")
    if (storedCases) {
      setCases(JSON.parse(storedCases))
    }
  }, [])

  const clearCases = () => {
    localStorage.removeItem("cases")
    setCases([])
  }

  const filteredCases = cases
    .filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) {
        return false
      }
      return (
        c.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.courtLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.chargeOffense.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1
      }
      return 0
    })

  const paginatedCases = filteredCases.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalPages = Math.ceil(filteredCases.length / itemsPerPage)

  const handleSort = (field: keyof Case) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Get status badge
  const getStatusBadge = (status: Case["status"]) => {
    switch (status) {
      case "closed":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Closed</Badge>
      case "active":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">Active</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">Pending</Badge>
    }
  }

  // Get status icon
  const getStatusIcon = (status: Case["status"]) => {
    switch (status) {
      case "closed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "active":
        return <AlertCircle className="h-4 w-4 text-blue-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-amber-600" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by case ID, location, or offense..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            variant="outline"
            onClick={clearCases}
            className="border-red-300 text-red-700 hover:bg-red-100 hover:text-red-900"
          >
            <Trash className="mr-2 h-4 w-4" />
            Clear Cases
          </Button>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-700">
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("caseId")}>
                  Case ID
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-700">
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("courtOrderDate")}>
                  Date
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-700">
                Court Location
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-700">
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("courtLocation")}>
                  Court Location
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-700">
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("chargeOffense")}>
                  Charge/Offense
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-700">
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("status")}>
                  Status
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedCases.length > 0 ? (
              paginatedCases.map((c) => (
                <tr key={c.id} className="bg-white hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      {c.caseId}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                    {new Date(c.courtOrderDate).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">{c.courtLocation}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">{c.chargeOffense}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(c.status)}
                      {getStatusBadge(c.status)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View Details</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-4xl">
                          <DialogHeader>
                            <DialogTitle className="text-xl">Case Details: {c.caseId}</DialogTitle>
                            <DialogDescription className="text-gray-600">
                              Complete information extracted from court documents
                            </DialogDescription>
                          </DialogHeader>

                          <Tabs defaultValue="details" className="mt-4">
                            <TabsList className="bg-gray-100 grid w-full grid-cols-3">
                              <TabsTrigger value="details">Case Details</TabsTrigger>
                              <TabsTrigger value="parties">Involved Parties</TabsTrigger>
                              <TabsTrigger value="evidence">Evidence & Statements</TabsTrigger>
                            </TabsList>

                            <TabsContent value="details" className="mt-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="rounded-md border border-gray-200 p-4">
                                  <h3 className="text-sm font-medium text-gray-600 mb-2">Case Information</h3>
                                  <div className="space-y-2">
                                    <div className="grid grid-cols-2">
                                      <span className="text-sm text-gray-600">Case ID:</span>
                                      <span className="text-sm font-medium text-gray-900">{c.caseId}</span>
                                    </div>
                                    <div className="grid grid-cols-2">
                                      <span className="text-sm text-gray-600">Court Location:</span>
                                      <span className="text-sm text-gray-900">{c.courtLocation}</span>
                                    </div>
                                    <div className="grid grid-cols-2">
                                      <span className="text-sm text-gray-600">Court Order Date:</span>
                                      <span className="text-sm text-gray-900">
                                        {new Date(c.courtOrderDate).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-2">
                                      <span className="text-sm text-gray-600">Charge/Offense:</span>
                                      <span className="text-sm text-gray-900">{c.chargeOffense}</span>
                                    </div>
                                    <div className="grid grid-cols-2">
                                      <span className="text-sm text-gray-600">Court Ruling:</span>
                                      <span className="text-sm text-gray-900">{c.courtRuling}</span>
                                    </div>
                                    <div className="grid grid-cols-2">
                                      <span className="text-sm text-gray-600">Court Action:</span>
                                      <span className="text-sm text-gray-900">{c.courtAction}</span>
                                    </div>
                                    <div className="grid grid-cols-2">
                                      <span className="text-sm text-gray-600">Status:</span>
                                      <span className="text-sm flex items-center gap-1 text-gray-900">
                                        {getStatusIcon(c.status)}
                                        {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-2">
                                      <span className="text-sm text-gray-600">Recurrence:</span>
                                      <span className="text-sm text-gray-900">{c.recurrence}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="rounded-md border border-gray-200 p-4">
                                  <h3 className="text-sm font-medium text-gray-600 mb-2">Sentencing Information</h3>
                                  <div className="space-y-2">
                                    <div className="grid grid-cols-2">
                                      <span className="text-sm text-gray-600">Sentence/Fine:</span>
                                      <span className="text-sm text-gray-900">{c.sentenceFine}</span>
                                    </div>
                                    <div className="grid grid-cols-2">
                                      <span className="text-sm text-gray-600">Document ID:</span>
                                      <span className="text-sm text-gray-900">{c.documentId}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent value="parties" className="mt-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="rounded-md border border-gray-200 p-4">
                                  <h3 className="text-sm font-medium text-gray-600 mb-2">Plaintiff Information</h3>
                                  <div className="space-y-2">
                                    <div className="grid grid-cols-2">
                                      <span className="text-sm text-gray-600">Age:</span>
                                      <span className="text-sm text-gray-900">{c.plaintiffAge}</span>
                                    </div>
                                    <div className="grid grid-cols-2">
                                      <span className="text-sm text-gray-600">Gender:</span>
                                      <span className="text-sm text-gray-900">{c.plaintiffGender}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="rounded-md border border-gray-200 p-4">
                                  <h3 className="text-sm font-medium text-gray-600 mb-2">Defendant Information</h3>
                                  <div className="space-y-2">
                                    <div className="grid grid-cols-2">
                                      <span className="text-sm text-gray-600">Age:</span>
                                      <span className="text-sm text-gray-900">{c.defendantAge}</span>
                                    </div>
                                    <div className="grid grid-cols-2">
                                      <span className="text-sm text-gray-600">Gender:</span>
                                      <span className="text-sm text-gray-900">{c.defendantGender}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent value="evidence" className="mt-4 space-y-4">
                              <div className="space-y-4">
                                <div className="rounded-md border border-gray-200 p-4">
                                  <h3 className="text-sm font-medium text-gray-600 mb-2">Victim Statement</h3>
                                  <p className="text-sm text-gray-900">{c.victimStatement}</p>
                                </div>

                                <div className="rounded-md border border-gray-200 p-4">
                                  <h3 className="text-sm font-medium text-gray-600 mb-2">Perpetrator Statement</h3>
                                  <p className="text-sm text-gray-900">{c.perpetratorStatement}</p>
                                </div>

                                <div className="rounded-md border border-gray-200 p-4">
                                  <h3 className="text-sm font-medium text-gray-600 mb-2">Evidence Summary</h3>
                                  <p className="text-sm text-gray-900">{c.evidenceSummary}</p>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>

                          <div className="mt-6 flex justify-end gap-2">
                            <Button
                              variant="outline"
                              className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Export Case Data
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

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
                            Edit Case
                          </DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-gray-100 focus:text-gray-900">
                            View Document
                          </DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-gray-100 focus:text-gray-900">
                            Share Case
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-200" />
                          <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600">
                            Delete Case
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="h-24 text-center">
                  No cases found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredCases.length)} of {filteredCases.length} cases
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous Page</span>
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                className={
                  page === currentPage
                    ? "h-8 w-8 bg-blue-600 text-white hover:bg-blue-700"
                    : "h-8 w-8 border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next Page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
