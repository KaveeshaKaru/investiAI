"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export default function DashboardStats() {
  const processingData = [
    { name: "Mon", documents: 12 },
    { name: "Tue", documents: 19 },
    { name: "Wed", documents: 15 },
    { name: "Thu", documents: 27 },
    { name: "Fri", documents: 21 },
    { name: "Sat", documents: 8 },
    { name: "Sun", documents: 5 },
  ]

  const documentTypeData = [
    { name: "Police Reports", value: 35 },
    { name: "Witness Statements", value: 25 },
    { name: "Court Orders", value: 15 },
    { name: "Evidence Logs", value: 20 },
    { name: "Other", value: 5 },
  ]

  const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#6b7280"]

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-600">Total Documents</CardDescription>
            <CardTitle className="text-3xl text-gray-900">1,284</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-green-600">+12% from last month</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-600">Processed Today</CardDescription>
            <CardTitle className="text-3xl text-gray-900">27</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-green-600">+5 from yesterday</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-600">Entities Extracted</CardDescription>
            <CardTitle className="text-3xl text-gray-900">8,392</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-green-600">+8% from last month</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-600">Processing Time</CardDescription>
            <CardTitle className="text-3xl text-gray-900">1.8s</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-green-600">-0.3s from last week</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Documents Processed</CardTitle>
            <CardDescription className="text-gray-600">Number of documents processed per day</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="week">
              <div className="flex items-center justify-between">
                <TabsList className="bg-gray-100">
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="week" className="mt-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={processingData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "0.375rem",
                        }}
                        itemStyle={{ color: "#111827" }}
                        labelStyle={{ color: "#111827" }}
                      />
                      <Bar dataKey="documents" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="month" className="mt-4">
                <div className="h-[300px] flex items-center justify-center text-gray-600">
                  Month data visualization will appear here
                </div>
              </TabsContent>
              <TabsContent value="year" className="mt-4">
                <div className="h-[300px] flex items-center justify-center text-gray-600">
                  Year data visualization will appear here
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Document Types</CardTitle>
            <CardDescription className="text-gray-600">Distribution of processed document types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={documentTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {documentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "0.375rem" }}
                    itemStyle={{ color: "#111827" }}
                    labelStyle={{ color: "#111827" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Processing Performance</CardTitle>
          <CardDescription className="text-gray-600">
            System performance metrics for document processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium text-gray-600">OCR Accuracy</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">98.7%</span>
                <span className="text-xs text-green-600">+0.5%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 rounded-full bg-blue-600" style={{ width: "98.7%" }}></div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium text-gray-600">Entity Recognition</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">94.2%</span>
                <span className="text-xs text-green-600">+1.2%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 rounded-full bg-purple-600" style={{ width: "94.2%" }}></div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium text-gray-600">Processing Speed</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">1.8s</span>
                <span className="text-xs text-green-600">-0.3s</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 rounded-full bg-green-600" style={{ width: "85%" }}></div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium text-gray-600">System Uptime</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">99.9%</span>
                <span className="text-xs text-green-600">+0.1%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 rounded-full bg-amber-600" style={{ width: "99.9%" }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
