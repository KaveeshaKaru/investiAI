"use client"

import { useState } from "react"
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
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<keyof Case>("courtOrderDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const itemsPerPage = 10

  // Mock data for cases
  const mockCases: Case[] = [
    {
      id: "case-1",
      caseId: "7832/24",
      courtOrderDate: "2024-04-26",
      courtLocation: "Themba District Court",
      victimStatement:
        "The plaintiff stated that the defendant had an extramarital affair, was unproductive and uncooperative, and ultimately deserted him on or around March 27, 2024.",
      plaintiffAge: "35",
      plaintiffGender: "Male",
      perpetratorStatement: "Unknown",
      defendantAge: "32",
      defendantGender: "Female",
      chargeOffense: "Desertion",
      courtRuling: "Divorce granted",
      sentenceFine: "Rs. 5000",
      courtAction: "Divorce granted",
      evidenceSummary:
        "Marriage certificate (No. 2876) presented as evidence; photos of the defendant with another person were found online.",
      status: "closed",
      recurrence: "First offense",
      documentId: "doc-1",
    },
    {
      id: "case-2",
      caseId: "6421/24",
      courtOrderDate: "2024-04-15",
      courtLocation: "Central District Court",
      victimStatement:
        "The victim reported physical abuse occurring on multiple occasions over a six-month period, with the most recent incident resulting in visible bruising.",
      plaintiffAge: "29",
      plaintiffGender: "Female",
      perpetratorStatement: "The defendant denied all allegations and claimed the injuries were self-inflicted.",
      defendantAge: "31",
      defendantGender: "Male",
      chargeOffense: "Domestic Violence",
      courtRuling: "Restraining order issued",
      sentenceFine: "Rs. 10000",
      courtAction: "Restraining order with mandatory counseling",
      evidenceSummary:
        "Medical reports documenting injuries, witness testimonies from neighbors, and photographic evidence.",
      status: "active",
      recurrence: "Multiple incidents",
      documentId: "doc-2",
    },
    {
      id: "case-3",
      caseId: "5987/24",
      courtOrderDate: "2024-04-10",
      courtLocation: "Metropolitan Family Court",
      victimStatement: "No direct victim statement as this is a custody dispute.",
      plaintiffAge: "42",
      plaintiffGender: "Male",
      perpetratorStatement: "Not applicable",
      defendantAge: "39",
      defendantGender: "Female",
      chargeOffense: "Not applicable",
      courtRuling: "Joint custody granted",
      sentenceFine: "None",
      courtAction: "Custody arrangement modified",
      evidenceSummary: "Character witnesses, school records, psychological evaluations of both parents and children.",
      status: "closed",
      recurrence: "Second modification",
      documentId: "doc-3",
    },
    {
      id: "case-4",
      caseId: "5432/24",
      courtOrderDate: "2024-03-28",
      courtLocation: "Eastern District Court",
      victimStatement:
        "The plaintiff claims intellectual property theft of software code that was subsequently used in a commercial product.",
      plaintiffAge: "Unknown",
      plaintiffGender: "Not specified",
      perpetratorStatement:
        "The defendant claims the code was developed independently and any similarities are coincidental.",
      defendantAge: "Unknown",
      defendantGender: "Not specified",
      chargeOffense: "Intellectual Property Theft",
      courtRuling: "Pending judgment",
      sentenceFine: "To be determined",
      courtAction: "Case under review",
      evidenceSummary:
        "Source code comparisons, development timelines, expert witness testimonies from software engineers.",
      status: "pending",
      recurrence: "First occurrence",
      documentId: "doc-4",
    },
    {
      id: "case-5",
      caseId: "4987/24",
      courtOrderDate: "2024-03-15",
      courtLocation: "Northern District Court",
      victimStatement:
        "The tenant claims the landlord failed to maintain habitable conditions despite multiple requests for repairs.",
      plaintiffAge: "27",
      plaintiffGender: "Female",
      perpetratorStatement: "The landlord states that repairs were scheduled but delayed due to supply chain issues.",
      defendantAge: "58",
      defendantGender: "Male",
      chargeOffense: "Housing Code Violations",
      courtRuling: "In favor of plaintiff",
      sentenceFine: "Rs. 25000 plus repair costs",
      courtAction: "Mandatory repairs ordered",
      evidenceSummary: "Photographic evidence of conditions, maintenance request records, inspector reports.",
      status: "active",
      recurrence: "Multiple complaints",
      documentId: "doc-5",
    },
    {
      id: "case-6",
      caseId: "4521/24",
      courtOrderDate: "2024-03-05",
      courtLocation: "Western District Court",
      victimStatement:
        "The employee alleges wrongful termination after reporting safety violations at the manufacturing facility.",
      plaintiffAge: "45",
      plaintiffGender: "Male",
      perpetratorStatement:
        "The employer claims termination was due to documented performance issues unrelated to the safety report.",
      defendantAge: "Not applicable",
      defendantGender: "Not applicable",
      chargeOffense: "Wrongful Termination",
      courtRuling: "Settlement reached",
      sentenceFine: "Confidential settlement amount",
      courtAction: "Case settled out of court",
      evidenceSummary: "Employment records, performance reviews, safety reports, internal communications.",
      status: "closed",
      recurrence: "First occurrence",
      documentId: "doc-6",
    },
    {
      id: "case-7",
      caseId: "3987/24",
      courtOrderDate: "2024-02-20",
      courtLocation: "Southern District Court",
      victimStatement: "The consumer alleges fraudulent misrepresentation of investment returns and hidden fees.",
      plaintiffAge: "62",
      plaintiffGender: "Male",
      perpetratorStatement:
        "The financial advisor claims all risks and fees were disclosed in the documentation provided.",
      defendantAge: "47",
      defendantGender: "Male",
      chargeOffense: "Financial Fraud",
      courtRuling: "Pending investigation",
      sentenceFine: "To be determined",
      courtAction: "Discovery phase",
      evidenceSummary: "Financial statements, marketing materials, recorded conversations, expert financial analysis.",
      status: "pending",
      recurrence: "Multiple complaints from different clients",
      documentId: "doc-7",
    },
    {
      id: "case-8",
      caseId: "3456/24",
      courtOrderDate: "2024-02-10",
      courtLocation: "Central Family Court",
      victimStatement:
        "The petitioner seeks adoption of their stepchild after four years of marriage to the child's biological parent.",
      plaintiffAge: "36",
      plaintiffGender: "Female",
      perpetratorStatement: "Not applicable",
      defendantAge: "8",
      defendantGender: "Male",
      chargeOffense: "Not applicable",
      courtRuling: "Adoption granted",
      sentenceFine: "None",
      courtAction: "Legal adoption finalized",
      evidenceSummary:
        "Home study reports, character references, financial stability documentation, child's preference statement.",
      status: "closed",
      recurrence: "Not applicable",
      documentId: "doc-8",
    },
    {
      id: "case-9",
      caseId: "2987/24",
      courtOrderDate: "2024-01-25",
      courtLocation: "Eastern District Court",
      victimStatement:
        "The patient claims medical malpractice resulting in permanent nerve damage following routine surgery.",
      plaintiffAge: "51",
      plaintiffGender: "Female",
      perpetratorStatement:
        "The medical team asserts that the complication was a known risk that was disclosed and not due to negligence.",
      defendantAge: "Unknown",
      defendantGender: "Not specified",
      chargeOffense: "Medical Malpractice",
      courtRuling: "Pending expert testimony",
      sentenceFine: "To be determined",
      courtAction: "Expert witnesses being deposed",
      evidenceSummary: "Medical records, surgical notes, consent forms, expert medical opinions, precedent cases.",
      status: "active",
      recurrence: "First occurrence",
      documentId: "doc-9",
    },
    {
      id: "case-10",
      caseId: "2345/24",
      courtOrderDate: "2024-01-15",
      courtLocation: "Traffic Court",
      victimStatement: "Not applicable",
      plaintiffAge: "Not applicable",
      plaintiffGender: "Not applicable",
      perpetratorStatement:
        "The driver claims the traffic signal was malfunctioning at the time of the alleged violation.",
      defendantAge: "24",
      defendantGender: "Male",
      chargeOffense: "Traffic Violation",
      courtRuling: "Fine reduced",
      sentenceFine: "Rs. 2000",
      courtAction: "Reduced penalty",
      evidenceSummary: "Traffic camera footage, maintenance records for the traffic signal, officer testimony.",
      status: "closed",
      recurrence: "Second offense",
      documentId: "doc-10",
    },
    {
      id: "case-11",
      caseId: "1987/24",
      courtOrderDate: "2024-01-05",
      courtLocation: "Northern District Court",
      victimStatement:
        "The business owner claims breach of contract when the contractor abandoned the renovation project after receiving 60% payment.",
      plaintiffAge: "Unknown",
      plaintiffGender: "Not specified",
      perpetratorStatement:
        "The contractor states that significant undisclosed structural issues made the original contract terms impossible to fulfill.",
      defendantAge: "Unknown",
      defendantGender: "Not specified",
      chargeOffense: "Breach of Contract",
      courtRuling: "Partial refund ordered",
      sentenceFine: "Rs. 150000",
      courtAction: "Mediated settlement",
      evidenceSummary: "Contract documents, payment records, project timeline, expert assessment of completed work.",
      status: "closed",
      recurrence: "First occurrence",
      documentId: "doc-11",
    },
    {
      id: "case-12",
      caseId: "1456/24",
      courtOrderDate: "2023-12-20",
      courtLocation: "Western District Court",
      victimStatement:
        "The employee alleges age discrimination after being passed over for promotion in favor of less experienced younger colleagues.",
      plaintiffAge: "57",
      plaintiffGender: "Male",
      perpetratorStatement:
        "The employer claims promotion decisions were based on performance metrics and leadership qualities unrelated to age.",
      defendantAge: "Not applicable",
      defendantGender: "Not applicable",
      chargeOffense: "Age Discrimination",
      courtRuling: "Pending decision",
      sentenceFine: "To be determined",
      courtAction: "Awaiting judgment",
      evidenceSummary:
        "Performance reviews, promotion history, company demographics, internal communications, witness testimonies.",
      status: "pending",
      recurrence: "Similar complaints within organization",
      documentId: "doc-12",
    },
  ]

  // Filter cases based on search term and status
  const filteredCases = mockCases.filter((caseItem) => {
    const matchesSearch =
      caseItem.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.courtLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.chargeOffense.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.courtRuling.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || caseItem.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Sort cases
  const sortedCases = [...filteredCases].sort((a, b) => {
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

  // Paginate cases
  const totalPages = Math.ceil(sortedCases.length / itemsPerPage)
  const paginatedCases = sortedCases.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Handle sort
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search cases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-gray-300 pl-10 text-gray-900 placeholder-gray-500 focus:border-blue-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] border-gray-300 bg-white text-gray-900">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 text-gray-900">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>

          <Button
            size="sm"
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => {
              // Export functionality would go here
              alert("Export functionality would be implemented here")
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
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
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("courtRuling")}>
                    Court Ruling
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
              {paginatedCases.map((caseItem) => (
                <tr key={caseItem.id} className="bg-white hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      {caseItem.caseId}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                    {new Date(caseItem.courtOrderDate).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">{caseItem.courtLocation}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">{caseItem.chargeOffense}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">{caseItem.courtRuling}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(caseItem.status)}
                      {getStatusBadge(caseItem.status)}
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
                            <DialogTitle className="text-xl">Case Details: {caseItem.caseId}</DialogTitle>
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
                                      <span className="text-sm font-medium text-gray-900">{caseItem.caseId}</span>
                                    </div>
                                    <div className="grid grid-cols-2">
                                      <span className="text-sm text-gray-600">Court Location:</span>
                                      <span className="text-sm text-gray-900">{caseItem.courtLocation}</span>
                                    </div>
                                    <div className="grid grid-cols-2">
                                      <span className="text-sm text-gray-600">Court Order Date:</span>
                                      <span className="text-sm text-gray-900">
                                        {new Date(caseItem.courtOrderDate).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-2">
                                      <span className="text-sm text-gray-600">Charge/Offense:</span>
                                      <span className="text-sm text-gray-900">{caseItem.chargeOffense}</span>
                                    </div>
                                    <div className="grid grid-cols-2">
                                      <span className="text-sm text-gray-600">Court Ruling:</span>
                                      <span className="text-sm text-gray-900">{caseItem.courtRuling}</span>
                                    </div>
                                    <div className="grid grid-cols-2">
                                      <span className="text-sm text-gray-600">Court Action:</span>
                                      <span className="text-sm text-gray-900">{caseItem.courtAction}</span>
                                    </div>
                                    <div className="grid grid-cols-2">
                                      <span className="text-sm text-gray-600">Status:</span>
                                      <span className="text-sm flex items-center gap-1 text-gray-900">
                                        {getStatusIcon(caseItem.status)}
                                        {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-2">
                                      <span className="text-sm text-gray-600">Recurrence:</span>
                                      <span className="text-sm text-gray-900">{caseItem.recurrence}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="rounded-md border border-gray-200 p-4">
                                  <h3 className="text-sm font-medium text-gray-600 mb-2">Sentencing Information</h3>
                                  <div className="space-y-2">
                                    <div className="grid grid-cols-2">
                                      <span className="text-sm text-gray-600">Sentence/Fine:</span>
                                      <span className="text-sm text-gray-900">{caseItem.sentenceFine}</span>
                                    </div>
                                    <div className="grid grid-cols-2">
                                      <span className="text-sm text-gray-600">Document ID:</span>
                                      <span className="text-sm text-gray-900">{caseItem.documentId}</span>
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
                                      <span className="text-sm text-gray-900">{caseItem.plaintiffAge}</span>
                                    </div>
                                    <div className="grid grid-cols-2">
                                      <span className="text-sm text-gray-600">Gender:</span>
                                      <span className="text-sm text-gray-900">{caseItem.plaintiffGender}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="rounded-md border border-gray-200 p-4">
                                  <h3 className="text-sm font-medium text-gray-600 mb-2">Defendant Information</h3>
                                  <div className="space-y-2">
                                    <div className="grid grid-cols-2">
                                      <span className="text-sm text-gray-600">Age:</span>
                                      <span className="text-sm text-gray-900">{caseItem.defendantAge}</span>
                                    </div>
                                    <div className="grid grid-cols-2">
                                      <span className="text-sm text-gray-600">Gender:</span>
                                      <span className="text-sm text-gray-900">{caseItem.defendantGender}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent value="evidence" className="mt-4 space-y-4">
                              <div className="space-y-4">
                                <div className="rounded-md border border-gray-200 p-4">
                                  <h3 className="text-sm font-medium text-gray-600 mb-2">Victim Statement</h3>
                                  <p className="text-sm text-gray-900">{caseItem.victimStatement}</p>
                                </div>

                                <div className="rounded-md border border-gray-200 p-4">
                                  <h3 className="text-sm font-medium text-gray-600 mb-2">Perpetrator Statement</h3>
                                  <p className="text-sm text-gray-900">{caseItem.perpetratorStatement}</p>
                                </div>

                                <div className="rounded-md border border-gray-200 p-4">
                                  <h3 className="text-sm font-medium text-gray-600 mb-2">Evidence Summary</h3>
                                  <p className="text-sm text-gray-900">{caseItem.evidenceSummary}</p>
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
              ))}
            </tbody>
          </table>
        </div>
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
