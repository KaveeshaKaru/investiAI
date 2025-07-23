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
  Edit,
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
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { PoliceReport } from "@/lib/types"

export default function PoliceReportsTable() {
  const [reports, setReports] = useState<PoliceReport[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<keyof PoliceReport>("incidentDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const itemsPerPage = 10
  const [editingReport, setEditingReport] = useState<PoliceReport | null>(null)

  useEffect(() => {
    const storedReports = localStorage.getItem("police-reports")
    if (storedReports) {
      setReports(JSON.parse(storedReports))
    }
  }, [])

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editingReport) {
      setEditingReport({
        ...editingReport,
        [e.target.name]: e.target.value,
      })
    }
  }

  const handleStatusChange = (value: string) => {
    if (editingReport) {
      setEditingReport({
        ...editingReport,
        criminalStatus: value,
      })
    }
  }

  const handleSave = () => {
    if (editingReport) {
      const updatedReports = reports.map((r) => (r.id === editingReport.id ? editingReport : r))
      setReports(updatedReports)
      localStorage.setItem("police-reports", JSON.stringify(updatedReports))
      setEditingReport(null)
    }
  }

  const clearReports = () => {
    localStorage.removeItem("police-reports")
    setReports([])
  }

  const filteredReports = reports
    .filter((r) => {
      if (statusFilter !== "all" && r.criminalStatus !== statusFilter) {
        return false
      }
      return (
        r.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.incidentLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.typeOfViolence.toLowerCase().includes(searchTerm.toLowerCase())
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

  const paginatedReports = filteredReports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage)

  const handleSort = (field: keyof PoliceReport) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getStatusBadge = (status: PoliceReport["criminalStatus"]) => {
    switch (status.toLowerCase()) {
      case "criminal charges active":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-200">Active Charges</Badge>
      case "not a criminal":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Not Criminal</Badge>
      case "unknown":
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">Unknown</Badge>
      default:
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">{status}</Badge>
    }
  }
  
  const getStatusIcon = (status: PoliceReport["criminalStatus"]) => {
    switch (status.toLowerCase()) {
      case "criminal charges active":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "not a criminal":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by case ID, location, or violence type..."
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
              <SelectItem value="Criminal charges active">Active Charges</SelectItem>
              <SelectItem value="Not a Criminal">Not Criminal</SelectItem>
              <SelectItem value="Unknown">Unknown</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            variant="outline"
            onClick={clearReports}
            className="border-red-300 text-red-700 hover:bg-red-100 hover:text-red-900"
          >
            <Trash className="mr-2 h-4 w-4" />
            Clear Reports
          </Button>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-gray-50">
              <TableHead className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-700">
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("caseId")}>
                  Case ID
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-700">
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("incidentDate")}>
                  Incident Date
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-700">
                Incident Location
              </TableHead>
              <TableHead className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-700">
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("typeOfViolence")}>
                  Type of Violence
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-700">
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("criminalStatus")}>
                  Status
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200">
            {paginatedReports.length > 0 ? (
              paginatedReports.map((r) => (
                <TableRow key={r.id} className="bg-white hover:bg-gray-50">
                  <TableCell className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      {r.caseId}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                    {new Date(r.incidentDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">{r.incidentLocation}</TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">{r.typeOfViolence}</TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(r.criminalStatus)}
                      {getStatusBadge(r.criminalStatus)}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-4 text-sm">
                    <Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DialogTrigger asChild>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setEditingReport(r)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Report
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DialogContent className="sm:max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Report Details: {r.caseId}</DialogTitle>
                          <DialogDescription>
                            Full details for report {r.caseId}, recorded on {new Date(r.reportDate).toLocaleDateString()}.
                          </DialogDescription>
                        </DialogHeader>
                        <Tabs defaultValue="summary" className="w-full">
                          <TabsList className="bg-gray-100 grid w-full grid-cols-3">
                            <TabsTrigger value="summary">Report Details</TabsTrigger>
                            <TabsTrigger value="parties">Involved Parties</TabsTrigger>
                            <TabsTrigger value="document">Document</TabsTrigger>
                          </TabsList>

                          <TabsContent value="summary" className="mt-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="rounded-md border border-gray-200 p-4">
                                <h3 className="text-sm font-medium text-gray-600 mb-2">Incident Information</h3>
                                <div className="space-y-2">
                                  <div className="grid grid-cols-2">
                                    <span className="text-sm text-gray-600">Case ID:</span>
                                    <span className="text-sm font-medium text-gray-900">{r.caseId}</span>
                                  </div>
                                  <div className="grid grid-cols-2">
                                    <span className="text-sm text-gray-600">Incident Date:</span>
                                    <span className="text-sm text-gray-900">{new Date(r.incidentDate).toLocaleDateString()}</span>
                                  </div>
                                   <div className="grid grid-cols-2">
                                    <span className="text-sm text-gray-600">Report Date:</span>
                                    <span className="text-sm text-gray-900">{new Date(r.reportDate).toLocaleDateString()}</span>
                                  </div>
                                  <div className="grid grid-cols-2">
                                    <span className="text-sm text-gray-600">Location:</span>
                                    <span className="text-sm text-gray-900">{r.incidentLocation}</span>
                                  </div>
                                  <div className="grid grid-cols-2">
                                    <span className="text-sm text-gray-600">Type of Violence:</span>
                                    <span className="text-sm text-gray-900">{r.typeOfViolence}</span>
                                  </div>
                                  <div className="grid grid-cols-2">
                                    <span className="text-sm text-gray-600">Severity:</span>
                                    <span className="text-sm text-gray-900">{r.severityLevel}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="rounded-md border border-gray-200 p-4">
                                <h3 className="text-sm font-medium text-gray-600 mb-2">Case Status</h3>
                                <div className="space-y-2">
                                  <div className="grid grid-cols-2">
                                      <span className="text-sm text-gray-600">Reported to Authorities:</span>
                                      <span className="text-sm text-gray-900">{r.reportedToAuthorities}</span>
                                  </div>
                                  <div className="grid grid-cols-2">
                                      <span className="text-sm text-gray-600">Action Taken:</span>
                                      <span className="text-sm text-gray-900">{r.actionTaken}</span>
                                  </div>
                                  <div className="grid grid-cols-2">
                                    <span className="text-sm text-gray-600">Outcome:</span>
                                    <span className="text-sm text-gray-900">{r.outcomeOfTheCase}</span>
                                  </div>
                                  <div className="grid grid-cols-2">
                                    <span className="text-sm text-gray-600">Criminal Status:</span>
                                    <span className="text-sm flex items-center gap-1 text-gray-900">
                                      {getStatusIcon(r.criminalStatus)}
                                      {r.criminalStatus}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2">
                                    <span className="text-sm text-gray-600">Recurrence:</span>
                                    <span className="text-sm text-gray-900">{r.recurrence}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="parties" className="mt-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="rounded-md border border-gray-200 p-4">
                                <h3 className="text-sm font-medium text-gray-600 mb-2">Victim Information</h3>
                                <div className="space-y-2">
                                  <div className="grid grid-cols-2">
                                    <span className="text-sm text-gray-600">Age:</span>
                                    <span className="text-sm text-gray-900">{r.victimAge}</span>
                                  </div>
                                  <div className="grid grid-cols-2">
                                    <span className="text-sm text-gray-600">Gender:</span>
                                    <span className="text-sm text-gray-900">{r.victimGender}</span>
                                  </div>
                                  <div className="grid grid-cols-2">
                                    <span className="text-sm text-gray-600">Relationship to Perpetrator:</span>
                                    <span className="text-sm text-gray-900">{r.victimRelationshipToPerpetrator}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="rounded-md border border-gray-200 p-4">
                                <h3 className="text-sm font-medium text-gray-600 mb-2">Perpetrator Information</h3>
                                <div className="space-y-2">
                                  <div className="grid grid-cols-2">
                                    <span className="text-sm text-gray-600">Age:</span>
                                    <span className="text-sm text-gray-900">{r.perpetratorAge}</span>
                                  </div>
                                  <div className="grid grid-cols-2">
                                    <span className="text-sm text-gray-600">Gender:</span>
                                    <span className="text-sm text-gray-900">{r.perpetratorGender}</span>
                                  </div>
                                  <div className="grid grid-cols-2">
                                    <span className="text-sm text-gray-600">Relationship to Victim:</span>
                                    <span className="text-sm text-gray-900">{r.perpetratorRelationshipToVictim}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="document">
                            <Card>
                              <CardHeader>
                                <CardTitle>Original Document</CardTitle>
                                <CardDescription>
                                  View the original document associated with this report. Document ID: {r.documentId}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center justify-center h-96 bg-gray-100 rounded-md">
                                  <FileText className="h-16 w-16 text-gray-400" />
                                  <p className="ml-4 text-gray-600">Document preview not available.</p>
                                </div>
                              </CardContent>
                            </Card>
                          </TabsContent>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No reports found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {editingReport && (
        <Dialog open={!!editingReport} onOpenChange={() => setEditingReport(null)}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Report: {editingReport.caseId}</DialogTitle>
              <DialogDescription>Make changes to the report details below. Click save when you're done.</DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Report Details</TabsTrigger>
                <TabsTrigger value="parties">Involved Parties</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-4">
                <div className="grid max-h-[60vh] gap-6 py-4 overflow-y-auto pr-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="caseId">Case ID</Label>
                      <Input id="caseId" name="caseId" value={editingReport.caseId} onChange={handleEditChange} />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="incidentDate">Incident Date</Label>
                      <Input id="incidentDate" name="incidentDate" value={editingReport.incidentDate} onChange={handleEditChange} />
                    </div>
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="reportDate">Report Date</Label>
                      <Input id="reportDate" name="reportDate" value={editingReport.reportDate} onChange={handleEditChange} />
                    </div>
                  <div className="space-y-2">
                    <Label htmlFor="incidentLocation">Incident Location</Label>
                    <Input id="incidentLocation" name="incidentLocation" value={editingReport.incidentLocation} onChange={handleEditChange} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="typeOfViolence">Type of Violence</Label>
                      <Input id="typeOfViolence" name="typeOfViolence" value={editingReport.typeOfViolence} onChange={handleEditChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="severityLevel">Severity Level</Label>
                      <Input id="severityLevel" name="severityLevel" value={editingReport.severityLevel} onChange={handleEditChange} />
                    </div>
                  </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                      <Label htmlFor="reportedToAuthorities">Reported to Authorities</Label>
                      <Input id="reportedToAuthorities" name="reportedToAuthorities" value={editingReport.reportedToAuthorities} onChange={handleEditChange} />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="actionTaken">Action Taken</Label>
                      <Input id="actionTaken" name="actionTaken" value={editingReport.actionTaken} onChange={handleEditChange} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="outcomeOfTheCase">Outcome of the Case</Label>
                    <Input id="outcomeOfTheCase" name="outcomeOfTheCase" value={editingReport.outcomeOfTheCase} onChange={handleEditChange} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="criminalStatus">Criminal Status</Label>
                      <Select value={editingReport.criminalStatus} onValueChange={handleStatusChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Criminal charges active">Active Charges</SelectItem>
                          <SelectItem value="Not a Criminal">Not Criminal</SelectItem>
                          <SelectItem value="Unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recurrence">Recurrence</Label>
                      <Input id="recurrence" name="recurrence" value={editingReport.recurrence} onChange={handleEditChange} />
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="parties" className="mt-4">
                 <div className="grid max-h-[60vh] gap-6 py-4 overflow-y-auto pr-4">
                  <Card>
                    <CardHeader><CardTitle>Victim</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="victimAge">Victim Age</Label>
                          <Input id="victimAge" name="victimAge" value={editingReport.victimAge} onChange={handleEditChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="victimGender">Victim Gender</Label>
                          <Input id="victimGender" name="victimGender" value={editingReport.victimGender} onChange={handleEditChange} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="victimRelationshipToPerpetrator">Relationship to Perpetrator</Label>
                        <Input id="victimRelationshipToPerpetrator" name="victimRelationshipToPerpetrator" value={editingReport.victimRelationshipToPerpetrator} onChange={handleEditChange} />
                      </div>
                    </CardContent>
                  </Card>
                   <Card>
                    <CardHeader><CardTitle>Perpetrator</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="perpetratorAge">Perpetrator Age</Label>
                          <Input id="perpetratorAge" name="perpetratorAge" value={editingReport.perpetratorAge} onChange={handleEditChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="perpetratorGender">Perpetrator Gender</Label>
                          <Input id="perpetratorGender" name="perpetratorGender" value={editingReport.perpetratorGender} onChange={handleEditChange} />
                        </div>
                      </div>
                       <div className="space-y-2">
                        <Label htmlFor="perpetratorRelationshipToVictim">Relationship to Victim</Label>
                        <Input id="perpetratorRelationshipToVictim" name="perpetratorRelationshipToVictim" value={editingReport.perpetratorRelationshipToVictim} onChange={handleEditChange} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={() => setEditingReport(null)}>Cancel</Button>
              </DialogClose>
              <Button type="button" onClick={handleSave}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredReports.length)} of {filteredReports.length} reports
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