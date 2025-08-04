"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUp, Bot, FileText } from "lucide-react"

type Prediction = {
  caseId: string
  caseSummary: string
  suggestedAction: string
}

const hardcodedPredictions: Prediction[] = [
  {
    caseId: "BR 1082/25",
    caseSummary: "This case involves a reported incident of domestic violence that occurred on February 26, 2025, in Galle, Sri Lanka. The victim alleges physical assault by her husband, resulting in significant injuries. The suspect has been arrested, and CCTV footage was obtained.",
    suggestedAction: "Likely to be referred to court on charges of domestic violence and grievous bodily harm. Bail may be denied initially. CCTV footage will be crucial evidence, and a protection order for the victim is probable. Conviction could lead to imprisonment or a substantial fine.",
  },
  {
    caseId: "WCIB 367/04",
    caseSummary: "A theft case where the suspect was caught with stolen goods. The suspect has a prior criminal history of similar offenses.",
    suggestedAction: "Charge with theft and consider prior offenses for sentencing. Verify ownership of recovered items.",
  },
  {
    caseId: "MCR/122/25",
    caseSummary: "A traffic accident involving a drunk driver. The driver was found to be over the legal alcohol limit.",
    suggestedAction: "Charge with driving under the influence and reckless driving. Collect breathalyzer and witness reports.",
  },
]

export default function PredictionsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Case Summary and Suggested Predictions</CardTitle>
        <CardDescription>AI-powered predictions and summaries for active cases.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><FileText className="inline-block mr-2 h-4 w-4" />Case ID</TableHead>
              <TableHead><Bot className="inline-block mr-2 h-4 w-4" />Case Summary</TableHead>
              <TableHead><ArrowUp className="inline-block mr-2 h-4 w-4" />Suggested Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hardcodedPredictions.map((prediction) => (
              <TableRow key={prediction.caseId}>
                <TableCell className="font-medium">{prediction.caseId}</TableCell>
                <TableCell>{prediction.caseSummary}</TableCell>
                <TableCell>{prediction.suggestedAction}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}