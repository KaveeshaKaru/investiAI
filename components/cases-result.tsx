"use client"

import {
  Eye,
  MoreHorizontal,
} from "lucide-react"
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"


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

type CasesResultProps = {
    cases: Case[]
}

export default function CasesResult({ cases }: CasesResultProps) {
    
    const getStatusBadge = (status: Case["status"]) => {
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

  return (
    <Card>
        <CardHeader>
            <CardTitle>Extraction Results</CardTitle>
            <CardDescription>The following data was extracted from the document.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Case ID</TableHead>
                        <TableHead>Court Order Date</TableHead>
                        <TableHead>Court Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {cases.map((c) => (
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
                                        <DialogDescription>
                                            Full details for case {c.caseId}.
                                        </DialogDescription>
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
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>

  )
}
