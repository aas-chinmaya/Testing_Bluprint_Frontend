



"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask } from "@/modules/project-management/task/slices/taskSlice";
import { fetchTeamByProjectId } from "@/modules/project-management/team/slices/teamSlice";
import { Plus, User, Flag, CalendarIcon, Info, X, Loader } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const priorityConfig = {
  Low: { color: "bg-emerald-100 text-emerald-800", badge: "Low" },
  Medium: { color: "bg-amber-100 text-amber-800", badge: "Medium" },
  High: { color: "bg-rose-100 text-rose-800", badge: "High" },
};

const getInitials = (name = "") =>
  name.trim().split(" ").filter(Boolean).map((n) => n[0]).join("").toUpperCase().slice(0, 2);

const CreateTaskModal = ({ onTaskAssingn, projectId, project, onClose, isOpen }) => {
  const dispatch = useDispatch();
  const { currentUser } = useCurrentUser();
  const { teamsByProject: teams, status: teamStatus } = useSelector((state) => state.team);
  const { status: taskStatus, error: taskError } = useSelector((state) => state.task);

  const prevOpenRef = useRef(isOpen);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    projectId: projectId || "",
    projectName: project?.data?.name || "",
    teamId: "",
    assignedTo: [],
    assignedBy: "",
  });

  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [memberOpen, setMemberOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Reset form when modal truly opens
  useEffect(() => {
    const justOpened = isOpen && !prevOpenRef.current;
    if (justOpened) {
      setFormData({
        title: "",
        description: "",
        priority: "Medium",
        projectId: projectId || "",
        projectName: project?.data?.name || "",
        teamId: "",
        assignedTo: [],
        assignedBy: "",
      });
      setSelectedAssignees([]);
      setErrors({});
      setSelectedTeam(null);
      setSelectedDateTime(null);
      setMemberSearchQuery("");
      setMemberOpen(false);
    }
    prevOpenRef.current = isOpen;
  }, [isOpen, projectId, project?.data?.name]);

  useEffect(() => {
    if (projectId && !isInitialized && isOpen) {
      dispatch(fetchTeamByProjectId(projectId));
      setIsInitialized(true);
    }
  }, [dispatch, projectId, isInitialized, isOpen]);

  const handleTeamSelect = useCallback((value) => {
    const team = teams.find(t => t.teamId === value);
    setSelectedTeam(team);
    setFormData(prev => ({
      ...prev,
      teamId: value,
      assignedBy: team?.teamLeadName || "Unknown",
      assignedTo: [],
    }));
    setSelectedAssignees([]);
  }, [teams]);

  const availableMembers = useMemo(() => {
    if (!selectedTeam?.teamMembers) return [];
    const q = memberSearchQuery.toLowerCase();
    return selectedTeam.teamMembers
      .filter(m => 
        m.memberName.toLowerCase().includes(q) &&
        !selectedAssignees.some(a => a.memberId === m.memberId)
      )
      .map(m => ({
        memberId: m.memberId,
        memberName: m.memberName,
        role: m.role || "Member",
      }));
  }, [selectedTeam, memberSearchQuery, selectedAssignees]);

  const toggleAssignee = useCallback((member) => {
    setSelectedAssignees(prev => {
      const exists = prev.some(a => a.memberId === member.memberId);
      const newList = exists
        ? prev.filter(a => a.memberId !== member.memberId)
        : [...prev, member];

      setFormData(f => ({ ...f, assignedTo: newList }));
      return newList;
    });
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.priority) newErrors.priority = "Priority is required";
    if (!selectedDateTime) newErrors.deadline = "Deadline is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!selectedTeam) newErrors.team = "Team selection is required";
    if (selectedAssignees.length === 0) newErrors.assignedTo = "Assign at least one member";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, selectedDateTime, selectedTeam, selectedAssignees]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill all required fields");
      return;
    }

    const deadlineISO = selectedDateTime ? selectedDateTime.toISOString() : null;

    const payload = {
      ...formData,
      projectId: selectedTeam?.projectId || projectId,
      projectName: selectedTeam?.projectName || project?.data?.name || "N/A",
      teamId: selectedTeam?.teamId,
      deadline: deadlineISO,
      assignedTo: formData.assignedTo,
      assignedBy: formData.assignedBy,
      // ← ONLY ADDED THIS (exact same format as subtask)
      actionedBy: {
        note: "Task Created !",
        performedBy: currentUser?.name || currentUser?.email || "Unknown User",
        timestamp: new Date().toISOString(),
      },
    };

    try {
      await dispatch(createTask(payload)).unwrap();
      onTaskAssingn?.();
      toast.success("Task assigned successfully!");
      onClose();
    } catch (err) {
      toast.error(taskError || "Failed to assign task");
    }
  }, [validate, formData, selectedDateTime, selectedTeam, dispatch, projectId, project, taskError, onTaskAssingn, onClose, currentUser]);

  const displayDateTime = selectedDateTime
    ? format(selectedDateTime, "MMM dd, yyyy 'at' HH:mm")
    : "Select date & time";

  const isSaveEnabled =
    formData.title.trim() &&
    formData.description.trim() &&
    selectedDateTime &&
    selectedTeam &&
    selectedAssignees.length > 0;

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-full h-[100vh] max-h-[100vh] sm:max-w-6xl sm:max-h-[85vh] bg-white shadow-lg border border-gray-200 rounded-lg text-black p-2">
        <DialogHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 border-b border-gray-200 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-base sm:text-lg font-bold text-gray-800 flex items-center">
              <Plus className="mr-2 h-4 w-4 text-blue-500" />
              Assign New Task
            </DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100 rounded-full h-7 w-7">
                <X className="h-3 w-3" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(85vh-60px)]">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Title */}
            <div className="w-full">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Plus className="h-4 w-4 text-blue-500 mr-2" />Title <span className="text-red-500 ml-1">*</span>
              </label>
           
                 <Textarea
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    title: e.target.value.slice(0, 150),
                  }))
                }
                className="w-full bg-white border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 p-3"
                placeholder="Enter subtask title..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.title.length} / 150 characters
              </p>
              {errors.title && <p className="text-red-500 text-xs mt-1 flex items-center"><X className="h-3 w-3 mr-1" /> {errors.title}</p>}
            </div>

            {/* Priority & Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Flag className="h-4 w-4 text-blue-500 mr-2" /> Priority
                </label>
                <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                  <SelectTrigger className="w-full h-10">
                    <SelectValue>
                      <span className={cn("px-2 py-1 rounded-full text-xs font-medium", priorityConfig[formData.priority]?.color)}>
                        {priorityConfig[formData.priority]?.badge}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorityConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <span className={cn("px-2 py-1 rounded-full text-xs font-medium", config.color)}>
                          {config.badge}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CalendarIcon className="h-4 w-4 text-blue-500 mr-2" /> Deadline <span className="text-red-500 ml-1">*</span>
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-between h-10 text-sm", !selectedDateTime && "text-gray-500")}>
                      {displayDateTime}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <Calendar mode="single" selected={selectedDateTime} onSelect={setSelectedDateTime} initialFocus className="rounded-lg" />
                    <div className="p-3 border-t flex items-center gap-2">
                      <input
                        type="time"
                        value={selectedDateTime ? format(selectedDateTime, "HH:mm") : ""}
                        onChange={(e) => {
                          if (selectedDateTime) {
                            const [h, m] = e.target.value.split(":");
                            const newDt = new Date(selectedDateTime);
                            newDt.setHours(parseInt(h), parseInt(m));
                            setSelectedDateTime(newDt);
                          }
                        }}
                        className="h-10 border rounded px-3 text-sm w-full"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                {errors.deadline && <p className="text-red-500 text-xs mt-1 flex items-center"><X className="h-3 w-3 mr-1" /> {errors.deadline}</p>}
              </div>
            </div>

            {/* Team */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 text-blue-500 mr-2" /> Team <span className="text-red-500 ml-1">*</span>
              </label>
              <Select value={selectedTeam?.teamId || ""} onValueChange={handleTeamSelect}>
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder={teamStatus === "loading" ? "Loading teams..." : "Select team"} />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.teamId} value={team.teamId}>{team.teamName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.team && <p className="text-red-500 text-xs mt-1 flex items-center"><X className="h-3 w-3 mr-1" /> {errors.team}</p>}
            </div>

            {/* Assign To */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 text-blue-500 mr-2" /> Assign To <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex flex-wrap gap-3 items-center">
                
                <Popover open={memberOpen} onOpenChange={setMemberOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" disabled={!selectedTeam} className="h-12 w-full justify-between text-sm">
                      {selectedAssignees.length === 0 ? "Select team members..." : `${selectedAssignees.length} selected`}
                      <User className="h-4 w-4 text-gray-500 ml-auto" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search members..." value={memberSearchQuery} onValueChange={setMemberSearchQuery} />
                      <CommandEmpty>No members found</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {availableMembers.map((m) => (
                          <CommandItem key={m.memberId} onSelect={() => toggleAssignee(m)}>
                            <Avatar className="h-8 w-8 mr-3">
                              <AvatarFallback className="text-xs bg-teal-600 text-white">
                                {getInitials(m.memberName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{m.memberName}</div>
                              <div className="text-xs text-gray-500">{m.role}</div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {selectedAssignees.map((person) => (
                  <div key={person.memberId} className="relative group">
                    <Avatar className="h-10 w-10 ring-4 ring-white border-2 border-white cursor-pointer hover:z-10 transition-all hover:scale-110">
                      <AvatarFallback className="bg-teal-600 text-white text-sm font-bold">
                        {getInitials(person.memberName)}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      type="button"
                      onClick={() => toggleAssignee(person)}
                      className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

              </div>
              {errors.assignedTo && <p className="text-red-500 text-xs mt-1 flex items-center"><X className="h-3 w-3 mr-1" /> {errors.assignedTo}</p>}
            </div>

            {/* Description */}
            <div className="w-full">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Info className="h-4 w-4 text-blue-500 mr-2" /> Description <span className="text-red-500 ml-1">*</span>
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full h-40 sm:h-48 md:h-52 bg-white border border-gray-300 rounded-lg text-sm resize-vertical focus:ring-2 focus:ring-blue-200 focus:border-blue-500 p-3"
                placeholder="Enter detailed task description..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.description.length} characters
              </p>
              {errors.description && <p className="text-red-500 text-xs mt-1 flex items-center"><X className="h-3 w-3 mr-1" /> {errors.description}</p>}
            </div>

            {taskError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm flex items-center">
                  <X className="h-4 w-4 mr-2" /> {taskError}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isSaveEnabled || taskStatus === "loading"}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {taskStatus === "loading" ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Assigning Task...
                  </>
                ) : (
                  "Assign Task"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskModal;