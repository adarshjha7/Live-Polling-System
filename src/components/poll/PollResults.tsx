import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { usePoll } from "@/context/PollContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function PollResults() {
  const { state } = usePoll();
  const results = state.results;

  if (
    !results ||
    !results.options ||
    !results.votes ||
    results.totalVotes === 0
  ) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="text-center py-8">
          <p className="text-gray-600">
            No responses yet. Results will appear as students submit their
            answers.
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = results.options.map((option, index) => ({
    option: `Option ${index + 1}`,
    fullOption: option,
    votes: results.votes[index],
    percentage: results.totalVotes
      ? Math.round((results.votes[index] / results.totalVotes) * 100)
      : 0,
  }));

  const maxVotes = Math.max(...results.votes);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Poll Results</CardTitle>
          <p className="text-center text-gray-600">{results.question}</p>
          <p className="text-center text-sm text-gray-500">
            Total Responses: {results.totalVotes}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.options.map((option, index) => {
              const votes = results.votes[index];
              const percentage = results.totalVotes
                ? Math.round((votes / results.totalVotes) * 100)
                : 0;

              return (
                <div
                  key={index}
                  className={`p-4 border rounded-lg ${
                    votes === maxVotes && votes > 0
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{option}</span>
                    <span className="text-sm text-gray-600">
                      {votes} votes ({percentage}%)
                    </span>
                  </div>
                  <Progress
                    value={percentage}
                    className="h-3"
                    style={{
                      background:
                        votes === maxVotes && votes > 0
                          ? "rgb(34 197 94)"
                          : undefined,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Response Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="option"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip
                formatter={(value, name, props) => [
                  `${value} votes`,
                  props.payload.fullOption,
                ]}
                labelFormatter={(label, payload) =>
                  payload && payload[0] ? payload[0].payload.fullOption : label
                }
              />
              <Bar dataKey="votes" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {results.studentAnswers && results.studentAnswers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Student Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.studentAnswers.map((answer, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg bg-gray-50 text-sm"
                >
                  <div className="font-medium text-gray-800">
                    {answer.studentName}
                  </div>
                  <div className="text-gray-600">
                    {results.options[answer.optionIndex]}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(answer.answeredAt).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
