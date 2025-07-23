"use client"

import { Eye, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CourtCase, PoliceReport } from "@/lib/types"


type CasesResultProps = {
  cases: CourtCase[]
  policeReports: PoliceReport[]
  docType: "courtOrder" | "policeReport"
}

export default function CasesResult({ cases, policeReports, docType }: CasesResultProps) {
  const getStatusBadge = (status: CourtCase["status"] | PoliceReport["criminalStatus"]) => {
    switch (status) {
      case "closed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Closed</Badge>
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
      case "active":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Active</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const renderCourtOrderRow = (c: CourtCase) => (
    <TableRow key={c.id}>
      <TableCell>{c.caseId}</TableCell>
      <TableCell>{c.courtOrderDate}</TableCell>
      <TableCell>{c.courtLocation}</TableCell>
      <TableCell>{getStatusBadge(c.status)}</TableCell>
      <TableCell>
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
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" /> View Details
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Case Details: {c.caseId}</DialogTitle>
              <DialogDescription>Full details for case {c.caseId}.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="font-semibold">Case ID:</div>
                <div>{c.caseId}</div>
                <div className="font-semibold">Court Order Date:</div>
                <div>{c.courtOrderDate}</div>
                <div className="font-semibold">Court Location:</div>
                <div>{c.courtLocation}</div>
                <div className="font-semibold">Status:</div>
                <div>{getStatusBadge(c.status)}</div>
                <div className="font-semibold">Charge/Offense:</div>
                <div>{c.chargeOffense}</div>
                <div className="font-semibold">Court Ruling:</div>
                <div>{c.courtRuling}</div>
                <div className="font-semibold">Sentence/Fine:</div>
                <div>{c.sentenceFine}</div>
              </div>
              <div className="font-semibold col-span-2">Victim Statement:</div>
              <div className="col-span-2">{c.victimStatement}</div>
            </div>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  )

  const renderPoliceReportRow = (r: PoliceReport) => (
     <TableRow key={r.id}>
      <TableCell>{r.caseId}</TableCell>
      <TableCell>{r.incidentDate}</TableCell>
      <TableCell>{r.incidentLocation}</TableCell>
      <TableCell>{getStatusBadge(r.criminalStatus)}</TableCell>
      <TableCell>
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
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" /> View Details
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Report Details: {r.caseId}</DialogTitle>
              <DialogDescription>Full details for report {r.caseId}.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <div className="grid grid-cols-2 gap-4">
                    <div className="font-semibold">Case ID:</div>
                    <div>{r.caseId}</div>
                    <div className="font-semibold">Incident Date:</div>
                    <div>{r.incidentDate}</div>
                    <div className="font-semibold">Report Date:</div>
                    <div>{r.reportDate}</div>
                    <div className="font-semibold">Location:</div>
                    <div>{r.incidentLocation}</div>
                    <div className="font-semibold">Type of Violence:</div>
                    <div>{r.typeOfViolence}</div>
                     <div className="font-semibold">Criminal Status:</div>
                    <div>{getStatusBadge(r.criminalStatus)}</div>
               </div>
            </div>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Extraction Results</CardTitle>
        <CardDescription>The following data was extracted from the document.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            {docType === "courtOrder" ? (
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Court Order Date</TableHead>
                <TableHead>Court Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            ) : (
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Incident Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Criminal Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            )}
          </TableHeader>
          <TableBody>
            {docType === "courtOrder"
              ? cases.map(renderCourtOrderRow)
              : policeReports.map(renderPoliceReportRow)}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
