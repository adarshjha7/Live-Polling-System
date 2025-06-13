import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { Poll, Answer, Student, PollState, PollResult } from "@/types/poll";

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
}

type PollAction =
  | { type: "CREATE_POLL"; payload: Poll }
  | { type: "SUBMIT_ANSWER"; payload: Answer }
  | { type: "REGISTER_STUDENT"; payload: Student }
  | { type: "UPDATE_RESULTS"; payload: PollResult }
  | { type: "LOAD_STATE"; payload: PollState }
  | { type: "EXPIRE_POLL" };

const initialState: PollState = {
  currentPoll: null,
  polls: [],
  answers: [],
  students: [],
  results: null,
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
      return newState;

    case "SUBMIT_ANSWER":
      const updatedAnswers = [...state.answers, action.payload];
      const updatedState = {
        ...state,
        answers: updatedAnswers,
      };

      // Calculate results
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
      return updatedState;

    case "REGISTER_STUDENT":
      const stateWithStudent = {
        ...state,
        students: [...state.students, action.payload],
      };
      localStorage.setItem("pollState", JSON.stringify(stateWithStudent));
      return stateWithStudent;

    case "UPDATE_RESULTS":
      return {
        ...state,
        results: action.payload,
      };

    case "EXPIRE_POLL":
      const expiredState = {
        ...state,
        currentPoll: state.currentPoll
          ? { ...state.currentPoll, isActive: false }
          : null,
      };
      localStorage.setItem("pollState", JSON.stringify(expiredState));
      return expiredState;

    case "LOAD_STATE":
      return action.payload;

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
        dispatch({ type: "LOAD_STATE", payload: parsedState });
      } catch (error) {
        console.error("Error loading saved state:", error);
      }
    }
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

    // Check if all students have answered
    const currentPollAnswers = state.answers.filter(
      (answer) => answer.pollId === state.currentPoll!.id,
    );
    return (
      currentPollAnswers.length === state.students.length &&
      state.students.length > 0
    );
  };

  const getTimeRemaining = (): number => {
    if (!state.currentPoll || !state.currentPoll.isActive) return 0;
    const remaining = Math.max(0, state.currentPoll.expiresAt - Date.now());
    return Math.ceil(remaining / 1000);
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
