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
  const [editingCase, setEditingCase] = useState<Case | null>(null)

  useEffect(() => {
    const storedCases = localStorage.getItem("cases")
    if (storedCases) {
      setCases(JSON.parse(storedCases))
    }
  }, [])

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editingCase) {
      setEditingCase({
        ...editingCase,
        [e.target.name]: e.target.value,
      })
    }
  }

  const handleStatusChange = (value: string) => {
    if (editingCase) {
      setEditingCase({
        ...editingCase,
        status: value as "closed" | "pending" | "active",
      })
    }
  }

  const handleSave = () => {
    if (editingCase) {
      const updatedCases = cases.map((c) => (c.id === editingCase.id ? editingCase : c))
      setCases(updatedCases)
      localStorage.setItem("cases", JSON.stringify(updatedCases))
      setEditingCase(null)
    }
  }

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
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("courtOrderDate")}>
                  Date
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-700">
                Court Location
              </TableHead>
              <TableHead className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-700">
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("chargeOffense")}>
                  Charge/Offense
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-700">
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("status")}>
                  Status
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200">
            {paginatedCases.length > 0 ? (
              paginatedCases.map((c) => (
                <TableRow key={c.id} className="bg-white hover:bg-gray-50">
                  <TableCell className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      {c.caseId}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                    {new Date(c.courtOrderDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">{c.courtLocation}</TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">{c.chargeOffense}</TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(c.status)}
                      {getStatusBadge(c.status)}
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
                          <DropdownMenuItem onClick={() => setEditingCase(c)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Case
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DialogContent className="sm:max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Case Details: {c.caseId}</DialogTitle>
                          <DialogDescription>
                            Full details for case {c.caseId}, recorded on{" "}
                            {new Date(c.courtOrderDate).toLocaleDateString()}.
                          </DialogDescription>
                        </DialogHeader>
                        <Tabs defaultValue="summary" className="w-full">
                          <TabsList className="bg-gray-100 grid w-full grid-cols-3">
                            <TabsTrigger value="summary">Case Details</TabsTrigger>
                            <TabsTrigger value="parties">Involved Parties</TabsTrigger>
                            <TabsTrigger value="evidence">Evidence & Statements</TabsTrigger>
                            <TabsTrigger value="document">Document</TabsTrigger>
                          </TabsList>

                          <TabsContent value="summary" className="mt-4 space-y-4">
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
                          <TabsContent value="document">
                            <Card>
                              <CardHeader>
                                <CardTitle>Original Document</CardTitle>
                                <CardDescription>
                                  View the original document associated with this case. Document ID: {c.documentId}
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
                  No cases found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {editingCase && (
        <Dialog open={!!editingCase} onOpenChange={() => setEditingCase(null)}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Case: {editingCase.caseId}</DialogTitle>
              <DialogDescription>Make changes to the case details below. Click save when you're done.</DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Case Details</TabsTrigger>
                <TabsTrigger value="parties">Involved Parties</TabsTrigger>
                <TabsTrigger value="evidence">Evidence & Statements</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-4">
                <div className="grid max-h-[60vh] gap-6 py-4 overflow-y-auto pr-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="caseId">Case ID</Label>
                      <Input id="caseId" name="caseId" value={editingCase.caseId} onChange={handleEditChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="courtOrderDate">Order Date</Label>
                      <Input id="courtOrderDate" name="courtOrderDate" value={editingCase.courtOrderDate} onChange={handleEditChange} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="courtLocation">Court Location</Label>
                    <Input id="courtLocation" name="courtLocation" value={editingCase.courtLocation} onChange={handleEditChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chargeOffense">Charge/Offense</Label>
                    <Input id="chargeOffense" name="chargeOffense" value={editingCase.chargeOffense} onChange={handleEditChange} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="courtRuling">Court Ruling</Label>
                      <Input id="courtRuling" name="courtRuling" value={editingCase.courtRuling} onChange={handleEditChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sentenceFine">Sentence/Fine</Label>
                      <Input id="sentenceFine" name="sentenceFine" value={editingCase.sentenceFine} onChange={handleEditChange} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="courtAction">Court Action</Label>
                    <Input id="courtAction" name="courtAction" value={editingCase.courtAction} onChange={handleEditChange} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={editingCase.status} onValueChange={handleStatusChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recurrence">Recurrence</Label>
                      <Input id="recurrence" name="recurrence" value={editingCase.recurrence} onChange={handleEditChange} />
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="parties" className="mt-4">
                <div className="grid max-h-[60vh] gap-6 py-4 overflow-y-auto pr-4">
                  <Card>
                    <CardHeader><CardTitle>Plaintiff</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="plaintiffAge">Plaintiff Age</Label>
                          <Input id="plaintiffAge" name="plaintiffAge" value={editingCase.plaintiffAge} onChange={handleEditChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="plaintiffGender">Plaintiff Gender</Label>
                          <Input id="plaintiffGender" name="plaintiffGender" value={editingCase.plaintiffGender} onChange={handleEditChange} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                   <Card>
                    <CardHeader><CardTitle>Defendant</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="defendantAge">Defendant Age</Label>
                          <Input id="defendantAge" name="defendantAge" value={editingCase.defendantAge} onChange={handleEditChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="defendantGender">Defendant Gender</Label>
                          <Input id="defendantGender" name="defendantGender" value={editingCase.defendantGender} onChange={handleEditChange} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="evidence" className="mt-4">
                 <div className="grid max-h-[60vh] gap-6 py-4 overflow-y-auto pr-4">
                    <div className="space-y-2">
                      <Label htmlFor="victimStatement">Victim's Statement</Label>
                      <Textarea id="victimStatement" name="victimStatement" value={editingCase.victimStatement} onChange={handleEditChange} rows={4}/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="perpetratorStatement">Perpetrator's Statement</Label>
                      <Textarea id="perpetratorStatement" name="perpetratorStatement" value={editingCase.perpetratorStatement} onChange={handleEditChange} rows={4}/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="evidenceSummary">Evidence Summary</Label>
                      <Textarea id="evidenceSummary" name="evidenceSummary" value={editingCase.evidenceSummary} onChange={handleEditChange} rows={4}/>
                    </div>
                  </div>
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <DialogClose asChild>
                 <Button type="button" variant="outline" onClick={() => setEditingCase(null)}>Cancel</Button>
              </DialogClose>
              <Button type="button" onClick={handleSave}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
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
