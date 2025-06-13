import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StudentNameModalProps {
  isOpen: boolean;
  onSubmit: (name: string) => void;
}

export function StudentNameModal({ isOpen, onSubmit }: StudentNameModalProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Welcome Student!</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="student-name">Enter your name</Label>
            <Input
              id="student-name"
              placeholder="Your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2"
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full" disabled={!name.trim()}>
            Join Poll
          </Button>
        </form>
        <p className="text-sm text-gray-600 text-center">
          Your name will be saved for this browser tab only.
        </p>
      </DialogContent>
    </Dialog>
  );
}
