import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import {
  Poll,
  Answer,
  Student,
  PollState,
  PollResult,
  ChatMessage,
} from "@/types/poll";

interface PollContextType {
  state: PollState;
  createPoll: (question: string, options: string[]) => void;
  submitAnswer: (
    studentId: string,
    studentName: string,
    optionIndex: number,
  ) => void;
  registerStudent: (name: string) => string;
  getStudentById: (id: string) => Student | undefined;
  canCreateNewPoll: () => boolean;
  getTimeRemaining: () => number;
  kickStudent: (studentId: string) => void;
  sendChatMessage: (
    message: string,
    senderType: "teacher" | "student",
    senderName: string,
  ) => void;
  refreshState: () => void;
}

type PollAction =
  | { type: "CREATE_POLL"; payload: Poll }
  | { type: "SUBMIT_ANSWER"; payload: Answer }
  | { type: "REGISTER_STUDENT"; payload: Student }
  | { type: "UPDATE_RESULTS"; payload: PollResult }
  | { type: "LOAD_STATE"; payload: PollState }
  | { type: "EXPIRE_POLL" }
  | { type: "KICK_STUDENT"; payload: string }
  | { type: "SEND_CHAT_MESSAGE"; payload: ChatMessage }
  | { type: "REFRESH_STATE" };

const initialState: PollState = {
  currentPoll: null,
  polls: [],
  answers: [],
  students: [],
  results: null,
  chatMessages: [],
  kickedStudents: [],
};

function pollReducer(state: PollState, action: PollAction): PollState {
  switch (action.type) {
    case "CREATE_POLL":
      const newState = {
        ...state,
        currentPoll: action.payload,
        polls: [...state.polls, action.payload],
        results: null,
      };
      localStorage.setItem("pollState", JSON.stringify(newState));
      // Trigger storage event for cross-tab sync
      window.dispatchEvent(new Event("poll-state-updated"));
      return newState;

    case "SUBMIT_ANSWER":
      const updatedAnswers = [...state.answers, action.payload];
      const updatedState = {
        ...state,
        answers: updatedAnswers,
      };

      // Calculate results immediately
      if (state.currentPoll) {
        const votes = new Array(state.currentPoll.options.length).fill(0);
        const studentAnswers = updatedAnswers.filter(
          (a) => a.pollId === state.currentPoll!.id,
        );

        studentAnswers.forEach((answer) => {
          votes[answer.optionIndex]++;
        });

        updatedState.results = {
          pollId: state.currentPoll.id,
          question: state.currentPoll.question,
          options: state.currentPoll.options,
          votes,
          totalVotes: studentAnswers.length,
          studentAnswers,
        };
      }

      localStorage.setItem("pollState", JSON.stringify(updatedState));
      window.dispatchEvent(new Event("poll-state-updated"));
      return updatedState;

    case "REGISTER_STUDENT":
      const stateWithStudent = {
        ...state,
        students: [...state.students, action.payload],
      };
      localStorage.setItem("pollState", JSON.stringify(stateWithStudent));
      window.dispatchEvent(new Event("poll-state-updated"));
      return stateWithStudent;

    case "UPDATE_RESULTS":
      const stateWithResults = {
        ...state,
        results: action.payload,
      };
      localStorage.setItem("pollState", JSON.stringify(stateWithResults));
      return stateWithResults;

    case "EXPIRE_POLL":
      const expiredState = {
        ...state,
        currentPoll: state.currentPoll
          ? { ...state.currentPoll, isActive: false }
          : null,
      };
      localStorage.setItem("pollState", JSON.stringify(expiredState));
      window.dispatchEvent(new Event("poll-state-updated"));
      return expiredState;

    case "KICK_STUDENT":
      const kickedState = {
        ...state,
        students: state.students.map((student) =>
          student.id === action.payload
            ? { ...student, isKicked: true }
            : student,
        ),
        kickedStudents: [...state.kickedStudents, action.payload],
      };
      localStorage.setItem("pollState", JSON.stringify(kickedState));
      window.dispatchEvent(new Event("poll-state-updated"));
      return kickedState;

    case "SEND_CHAT_MESSAGE":
      const chatState = {
        ...state,
        chatMessages: [...state.chatMessages, action.payload],
      };
      localStorage.setItem("pollState", JSON.stringify(chatState));
      window.dispatchEvent(new Event("poll-state-updated"));
      return chatState;

    case "LOAD_STATE":
      return action.payload;

    case "REFRESH_STATE":
      // Force reload from localStorage
      const savedState = localStorage.getItem("pollState");
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          // Ensure all required fields exist
          return {
            ...initialState,
            ...parsedState,
            chatMessages: Array.isArray(parsedState.chatMessages)
              ? parsedState.chatMessages
              : [],
            kickedStudents: Array.isArray(parsedState.kickedStudents)
              ? parsedState.kickedStudents
              : [],
            students: Array.isArray(parsedState.students)
              ? parsedState.students.map((student: any) => ({
                  ...student,
                  isKicked: student.isKicked || false,
                }))
              : [],
          };
        } catch (error) {
          console.error("Error loading saved state:", error);
        }
      }
      return state;

    default:
      return state;
  }
}

const PollContext = createContext<PollContextType | undefined>(undefined);

export function PollProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(pollReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("pollState");
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // Ensure all required fields exist and provide defaults for new fields
        const completeState = {
          ...initialState,
          ...parsedState,
          chatMessages: Array.isArray(parsedState.chatMessages)
            ? parsedState.chatMessages
            : [],
          kickedStudents: Array.isArray(parsedState.kickedStudents)
            ? parsedState.kickedStudents
            : [],
          // Ensure students have isKicked property
          students: Array.isArray(parsedState.students)
            ? parsedState.students.map((student: any) => ({
                ...student,
                isKicked: student.isKicked || false,
              }))
            : [],
        };
        dispatch({ type: "LOAD_STATE", payload: completeState });
      } catch (error) {
        console.error("Error loading saved state:", error);
        // If there's an error parsing, start fresh
        localStorage.removeItem("pollState");
      }
    }
  }, []);

  // Listen for cross-tab state updates
  useEffect(() => {
    const handleStorageUpdate = () => {
      dispatch({ type: "REFRESH_STATE" });
    };

    window.addEventListener("poll-state-updated", handleStorageUpdate);
    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.removeEventListener("poll-state-updated", handleStorageUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  // Timer for current poll
  useEffect(() => {
    if (state.currentPoll && state.currentPoll.isActive) {
      const interval = setInterval(() => {
        const now = Date.now();
        if (now >= state.currentPoll!.expiresAt) {
          dispatch({ type: "EXPIRE_POLL" });
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [state.currentPoll]);

  // Auto-update results when poll is active
  useEffect(() => {
    if (
      state.currentPoll &&
      state.currentPoll.options &&
      Array.isArray(state.answers) &&
      state.answers.length > 0
    ) {
      const votes = new Array(state.currentPoll.options.length).fill(0);
      const studentAnswers = state.answers.filter(
        (a) => a.pollId === state.currentPoll!.id,
      );

      studentAnswers.forEach((answer) => {
        if (answer.optionIndex >= 0 && answer.optionIndex < votes.length) {
          votes[answer.optionIndex]++;
        }
      });

      const newResults: PollResult = {
        pollId: state.currentPoll.id,
        question: state.currentPoll.question,
        options: state.currentPoll.options,
        votes,
        totalVotes: studentAnswers.length,
        studentAnswers,
      };

      if (JSON.stringify(newResults) !== JSON.stringify(state.results)) {
        dispatch({ type: "UPDATE_RESULTS", payload: newResults });
      }
    }
  }, [state.currentPoll, state.answers]);

  const createPoll = (question: string, options: string[]) => {
    const poll: Poll = {
      id: Date.now().toString(),
      question,
      options,
      createdAt: Date.now(),
      expiresAt: Date.now() + 60000, // 60 seconds
      isActive: true,
    };
    dispatch({ type: "CREATE_POLL", payload: poll });
  };

  const submitAnswer = (
    studentId: string,
    studentName: string,
    optionIndex: number,
  ) => {
    if (!state.currentPoll) return;

    const answer: Answer = {
      studentId,
      studentName,
      pollId: state.currentPoll.id,
      optionIndex,
      answeredAt: Date.now(),
    };
    dispatch({ type: "SUBMIT_ANSWER", payload: answer });
  };

  const registerStudent = (name: string): string => {
    const studentId =
      Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const student: Student = {
      id: studentId,
      name,
      joinedAt: Date.now(),
      isKicked: false,
    };
    dispatch({ type: "REGISTER_STUDENT", payload: student });

    // Store student ID in sessionStorage (unique per tab)
    sessionStorage.setItem("studentId", studentId);
    sessionStorage.setItem("studentName", name);

    return studentId;
  };

  const getStudentById = (id: string): Student | undefined => {
    return state.students.find((student) => student.id === id);
  };

  const canCreateNewPoll = (): boolean => {
    if (!state.currentPoll) return true;
    if (!state.currentPoll.isActive) return true;

    // Check if all active students have answered
    const students = Array.isArray(state.students) ? state.students : [];
    const answers = Array.isArray(state.answers) ? state.answers : [];

    const activeStudents = students.filter((s) => !s.isKicked);
    const currentPollAnswers = answers.filter(
      (answer) => answer.pollId === state.currentPoll!.id,
    );
    return (
      currentPollAnswers.length === activeStudents.length &&
      activeStudents.length > 0
    );
  };

  const getTimeRemaining = (): number => {
    if (!state.currentPoll || !state.currentPoll.isActive) return 0;
    const remaining = Math.max(0, state.currentPoll.expiresAt - Date.now());
    return Math.ceil(remaining / 1000);
  };

  const kickStudent = (studentId: string) => {
    dispatch({ type: "KICK_STUDENT", payload: studentId });
  };

  const sendChatMessage = (
    message: string,
    senderType: "teacher" | "student",
    senderName: string,
  ) => {
    const chatMessage: ChatMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      message,
      senderType,
      senderName,
      timestamp: Date.now(),
    };
    dispatch({ type: "SEND_CHAT_MESSAGE", payload: chatMessage });
  };

  const refreshState = () => {
    dispatch({ type: "REFRESH_STATE" });
  };

  return (
    <PollContext.Provider
      value={{
        state,
        createPoll,
        submitAnswer,
        registerStudent,
        getStudentById,
        canCreateNewPoll,
        getTimeRemaining,
        kickStudent,
        sendChatMessage,
        refreshState,
      }}
    >
      {children}
    </PollContext.Provider>
  );
}

export function usePoll() {
  const context = useContext(PollContext);
  if (context === undefined) {
    throw new Error("usePoll must be used within a PollProvider");
  }
  return context;
}
