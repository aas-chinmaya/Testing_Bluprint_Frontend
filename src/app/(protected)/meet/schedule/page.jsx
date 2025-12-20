"use client";

import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";

export default function MeetingScheduleTestPage() {
  const handleClick = () => {
    toast.success("Go to contact for meeting schedule");
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 bg-gray-50">
      <h1 className="text-2xl font-semibold text-gray-900">
        Meeting Schedule Test Page
      </h1>

      {/* Schedule Meeting Button */}
      <Button
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
        onClick={handleClick}
      >
        Schedule Meeting
      </Button>

      {/* Toast container */}
      <Toaster richColors position="top-right" />
    </div>
  );
}
