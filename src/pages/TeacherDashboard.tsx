import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PollCreator } from "@/components/poll/PollCreator";
import { PollResults } from "@/components/poll/PollResults";
import { Timer } from "@/components/poll/Timer";
import { ChatPopup } from "@/components/poll/ChatPopup";
import { usePoll } from "@/context/PollContext";
import {
  ArrowLeft,
  Users,
  BarChart3,
  Clock,
  UserX,
  History,
} from "lucide-react";

export default function TeacherDashboard() {
  const { state, kickStudent, refreshState } = usePoll();
  const [activeTab, setActiveTab] = useState("create");

  const currentPoll = state.currentPoll;
  const hasActivePoll = currentPoll && currentPoll.isActive;
  const activeStudents = state.students.filter((s) => !s.isKicked);

  // Auto-refresh state every 3 seconds to see new students and responses
  useEffect(() => {
    const interval = setInterval(() => {
      refreshState();
    }, 3000);

    return () => clearInterval(interval);
  }, [refreshState]);

  const handleKickStudent = (studentId: string) => {
    kickStudent(studentId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {activeStudents.length} Students Online
                </span>
              </div>
              {hasActivePoll && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Poll Active
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {hasActivePoll && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">
                Current Active Poll
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-blue-900">
                    {currentPoll.question}
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    {currentPoll.options.length} options •{" "}
                    {
                      state.answers.filter((a) => a.pollId === currentPoll.id)
                        .length
                    }{" "}
                    responses
                  </p>
                </div>
                <div className="text-right">
                  <Timer />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Create Poll
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Live Results
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="mt-8">
            <PollCreator />
          </TabsContent>

          <TabsContent value="results" className="mt-8">
            <PollResults />
          </TabsContent>
        </Tabs>

        {state.students.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Active Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {state.students.map((student) => {
                  const hasAnsweredCurrent =
                    currentPoll &&
                    state.answers.some(
                      (a) =>
                        a.pollId === currentPoll.id &&
                        a.studentId === student.id,
                    );

                  return (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <span className="font-medium">{student.name}</span>
                      {hasActivePoll && (
                        <Badge
                          variant={hasAnsweredCurrent ? "default" : "secondary"}
                        >
                          {hasAnsweredCurrent ? "Answered" : "Waiting"}
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
