import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PollQuestion } from "@/components/poll/PollQuestion";
import { PollResults } from "@/components/poll/PollResults";
import { StudentNameModal } from "@/components/poll/StudentNameModal";
import { ChatPopup } from "@/components/poll/ChatPopup";
import { usePoll } from "@/context/PollContext";
import { ArrowLeft, User, Clock, AlertTriangle } from "lucide-react";

export default function StudentInterface() {
  const { state, registerStudent, refreshState } = usePoll();
  const [studentId, setStudentId] = useState<string>("");
  const [studentName, setStudentName] = useState<string>("");
  const [showNameModal, setShowNameModal] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isKicked, setIsKicked] = useState(false);

  const currentPoll = state.currentPoll;
  const hasActivePoll = currentPoll && currentPoll.isActive;

  // Auto-refresh state every 2 seconds to sync with teacher actions
  useEffect(() => {
    const interval = setInterval(() => {
      refreshState();
    }, 2000);

    return () => clearInterval(interval);
  }, [refreshState]);

  useEffect(() => {
    // Check if student is already registered in this tab
    const savedStudentId = sessionStorage.getItem("studentId");
    const savedStudentName = sessionStorage.getItem("studentName");

    if (savedStudentId && savedStudentName) {
      setStudentId(savedStudentId);
      setStudentName(savedStudentName);
    } else {
      setShowNameModal(true);
    }
  }, []);

  useEffect(() => {
    // Check if student has already answered the current poll
    if (studentId && currentPoll) {
      const hasAnswered = state.answers.some(
        (answer) =>
          answer.pollId === currentPoll.id && answer.studentId === studentId,
      );
      setShowResults(hasAnswered || !currentPoll.isActive);
    } else if (!hasActivePoll) {
      setShowResults(true);
    }
  }, [studentId, currentPoll, state.answers, hasActivePoll]);

  // Check if student has been kicked
  useEffect(() => {
    if (studentId) {
      const student = state.students.find((s) => s.id === studentId);
      if (student && student.isKicked) {
        setIsKicked(true);
      }
    }
  }, [studentId, state.students]);

  const handleNameSubmit = (name: string) => {
    const id = registerStudent(name);
    setStudentId(id);
    setStudentName(name);
    setShowNameModal(false);
  };

  const handleAnswerSubmitted = () => {
    setShowResults(true);
  };

  if (showNameModal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <StudentNameModal isOpen={true} onSubmit={handleNameSubmit} />
      </div>
    );
  }

  if (isKicked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto border-red-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-red-900">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-red-700 mb-4">
              You have been removed from this polling session by the teacher.
            </p>
            <Link to="/">
              <Button className="w-full">Return to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold">Student Interface</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{studentName}</span>
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
        {hasActivePoll && !showResults ? (
          <div className="space-y-8">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-lg text-green-900">
                  New Poll Available!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700">
                  A new poll has been created. Please submit your answer within
                  the time limit.
                </p>
              </CardContent>
            </Card>

            <PollQuestion
              studentId={studentId}
              studentName={studentName}
              onAnswerSubmitted={handleAnswerSubmitted}
            />
          </div>
        ) : (
          <div className="space-y-8">
            {!hasActivePoll && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="text-center py-8">
                  <h3 className="text-lg font-medium text-blue-900 mb-2">
                    Waiting for Poll
                  </h3>
                  <p className="text-blue-700">
                    No active poll at the moment. Please wait for your teacher
                    to create a new poll.
                  </p>
                </CardContent>
              </Card>
            )}

            {state.results && (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Poll Results
                  </h2>
                  {hasActivePoll && (
                    <p className="text-gray-600 mt-2">
                      Thank you for your response! Here are the live results.
                    </p>
                  )}
                </div>
                <PollResults />
              </div>
            )}

            {!state.results && !hasActivePoll && (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-600">
                    No poll results to display yet. Results will appear after
                    you submit an answer or when a poll ends.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-sm">Your Session Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Name:</strong> {studentName}
              </p>
              <p>
                <strong>Student ID:</strong> {studentId}
              </p>
              <p>
                <strong>Tab Session:</strong> Your name is saved only for this
                browser tab
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Chat Popup */}
        <ChatPopup userType="student" userName={studentName} />
      </div>
    </div>
  );
}
