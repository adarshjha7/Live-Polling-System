import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Live Polling System
          </h1>
          <p className="text-xl text-gray-600">
            Create interactive polls and get real-time responses
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link to="/teacher">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <GraduationCap className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Teacher</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  Create polls, manage questions, and view live results from
                  your students.
                </p>
                <Button className="w-full" size="lg">
                  Enter as Teacher
                </Button>
                <div className="mt-4 text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <BarChart3 className="h-4 w-4" />
                    Create and manage polls
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Users className="h-4 w-4" />
                    View real-time responses
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link to="/student">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Student</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  Join polls, submit your answers, and see how others responded
                  real-time.
                </p>
                <Button className="w-full" size="lg">
                  Join as Student
                </Button>
                <div className="mt-4 text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <BarChart3 className="h-4 w-4" />
                    Answer poll questions
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Users className="h-4 w-4" />
                    See live results
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>

        <div className="text-center mt-12">
          <div className="bg-white rounded-lg p-6 shadow-sm max-w-md mx-auto">
            <h3 className="font-semibold text-gray-900 mb-2">How it works</h3>
            <p className="text-sm text-gray-600">
              Teachers create polls with multiple choice questions. Students
              have 60 seconds to respond. Everyone can see live results as they
              come in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
