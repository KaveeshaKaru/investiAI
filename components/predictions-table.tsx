"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUp, Bot, FileText, Loader2, AlertCircle } from "lucide-react"
import { usePredictions } from "@/hooks/use-predictions"
import ReactMarkdown from "react-markdown"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function PredictionsTable() {
  const { predictions, loading, error } = usePredictions()
  const { toast } = useToast()

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The suggested actions have been copied to your clipboard.",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-gray-600">Failed to load predictions. Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Case Summary and Suggested Predictions</CardTitle>
        <CardDescription>Lexa AI - predictions and summaries for active cases.</CardDescription>
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
            {predictions.length > 0 ? (
              predictions.map((prediction) => (
                <TableRow key={prediction.id}>
                  <TableCell className="font-medium">{prediction.caseId}</TableCell>
                  <TableCell>{prediction.caseSummary}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">View Suggestions</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[950px]">
                        <DialogHeader>
                          <DialogTitle>Suggested Actions for {prediction.caseId}</DialogTitle>
                          <DialogDescription>
                            These are the suggested actions based on the case summary and the available data.
                          </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="prose prose-sm max-h-[60vh] overflow-y-auto p-4">
                          <ReactMarkdown>{prediction.suggestedAction}</ReactMarkdown>
                        </ScrollArea>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => handleCopy(prediction.suggestedAction)}>Copy Suggestions</Button>
                          <DialogClose asChild>
                            <Button>Close</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No predictions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
