import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { usePoll } from "@/context/PollContext";
import { Timer } from "./Timer";

interface PollQuestionProps {
  studentId: string;
  studentName: string;
  onAnswerSubmitted: () => void;
}

export function PollQuestion({
  studentId,
  studentName,
  onAnswerSubmitted,
}: PollQuestionProps) {
  const { state, submitAnswer } = usePoll();
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentPoll = state.currentPoll;

  useEffect(() => {
    // Only check if student has already answered this specific poll
    if (currentPoll && studentId) {
      const existingAnswer = state.answers.find(
        (answer) =>
          answer.pollId === currentPoll.id && answer.studentId === studentId,
      );
      setIsSubmitted(!!existingAnswer);
    }
  }, [currentPoll?.id, state.answers, studentId]);

  useEffect(() => {
    // Reset selection only when poll ID changes (new poll)
    setSelectedOption("");
    setIsSubmitted(false);
  }, [currentPoll?.id]);

  if (!currentPoll || !currentPoll.isActive) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="text-center py-8">
          <p className="text-gray-600">
            No active poll at the moment. Please wait for the teacher to create
            a new poll.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="text-center py-8">
          <p className="text-green-600 text-lg font-medium">
            Thank you for your response!
          </p>
          <p className="text-gray-600 mt-2">
            You have already answered this poll. You can view the results below.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption) {
      const optionIndex = parseInt(selectedOption);
      submitAnswer(studentId, studentName, optionIndex);
      setIsSubmitted(true);
      onAnswerSubmitted();
    }
  };

  const handleTimeout = () => {
    setIsSubmitted(true);
    onAnswerSubmitted();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <Timer onTimeout={handleTimeout} />
        <CardTitle className="text-center text-xl">
          {currentPoll.question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
            {currentPoll.options.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50"
              >
                <RadioGroupItem
                  value={index.toString()}
                  id={`option-${index}`}
                />
                <Label
                  htmlFor={`option-${index}`}
                  className="text-lg cursor-pointer flex-1"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={!selectedOption}
          >
            Submit Answer
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
