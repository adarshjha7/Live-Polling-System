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

          <TabsContent value="history" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Poll History</CardTitle>
              </CardHeader>
              <CardContent>
                {state.polls.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">
                    No polls created yet. Create your first poll to see history
                    here.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {state.polls
                      .slice()
                      .reverse()
                      .map((poll, index) => {
                        const pollAnswers = state.answers.filter(
                          (a) => a.pollId === poll.id,
                        );
                        const votes = new Array(poll.options.length).fill(0);
                        pollAnswers.forEach((answer) => {
                          votes[answer.optionIndex]++;
                        });

                        return (
                          <div
                            key={poll.id}
                            className="p-4 border rounded-lg space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{poll.question}</h3>
                              <Badge
                                variant={
                                  poll.isActive ? "default" : "secondary"
                                }
                              >
                                {poll.isActive ? "Active" : "Completed"}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              Created:{" "}
                              {new Date(poll.createdAt).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">
                              Total Responses: {pollAnswers.length}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              {poll.options.map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  className="flex justify-between p-2 bg-gray-50 rounded"
                                >
                                  <span>{option}</span>
                                  <span className="font-medium">
                                    {votes[optIndex]} votes
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {activeStudents.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Active Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeStudents.map((student) => {
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
                      <div className="flex flex-col">
                        <span className="font-medium">{student.name}</span>
                        <span className="text-xs text-gray-500">
                          Joined:{" "}
                          {new Date(student.joinedAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {hasActivePoll && (
                          <Badge
                            variant={
                              hasAnsweredCurrent ? "default" : "secondary"
                            }
                          >
                            {hasAnsweredCurrent ? "Answered" : "Waiting"}
                          </Badge>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-700"
                            >
                              <UserX className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Kick Student</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove {student.name}{" "}
                                from this polling session? They will no longer
                                be able to participate.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleKickStudent(student.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Kick Student
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chat Popup */}
        <ChatPopup userType="teacher" userName="Teacher" />
      </div>
    </div>
  );
}
