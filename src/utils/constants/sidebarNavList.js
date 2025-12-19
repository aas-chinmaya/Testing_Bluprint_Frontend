














"use client";

import {
  LayoutDashboard,
  Inbox,
  CalendarDays,
  Users,
  ListChecks,
  Bug,
  FolderClosed,
  FileText,
  PhoneCall,
  User,
  Folder,
} from "lucide-react";

/* ============================
 🧠 Icon Map
============================ */
export const iconMap = {
  LayoutDashboard,
  Inbox,
  CalendarDays,
  Users,
  ListChecks,
  Bug,
  FolderClosed,
  FileText,
  PhoneCall,
  User,
  Folder,
};

/* ============================
 👥 Role Groups (UNCHANGED)
============================ */
export const roleGroups = {
  cpcGroup: ["cpc", "Team Lead"],
  employeeGroup: ["employee(regular)"],
};

/* ============================
 🧭 Navigation (4 Categories)
 ROUTES ARE SAME AS ORIGINAL
============================ */
export const fullNav = [
  /* ============================
   📊 Dashboard
  ============================ */
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: "LayoutDashboard",
    alias: "dashboard",
    roles: ["cpcGroup", "employeeGroup"],
  },

  /* ============================
   📞 Leads
  ============================ */
  {
    title: "Leads",
    icon: "Inbox",
    alias: "leads-root",
    roles: ["cpcGroup"],
    items: [
      {
        title: "Overview",
        url: "/marketing/contacts/overview",
        roles: ["cpcGroup", "employeeGroup"],
      },
      {
        title: "Recent Inquiry",
        url: "/marketing/contacts/recent",
        roles: ["cpcGroup", "employeeGroup"],
      },
      {
        title: "All Inquiry",
        url: "/marketing/contacts/all",
        roles: ["cpcGroup", "employeeGroup"],
      },
      {
        title: "Schedule",
        url: "/marketing/schedule",
        roles: ["cpcGroup", "employeeGroup"],
      },
      {
        title: "Quotations",
        url: "/quotation",
        roles: ["cpcGroup", "employeeGroup"],
      },
    ],
  },

  /* ============================
   👥 Client
  ============================ */
  {
    title: "Client",
    icon: "Users",
    alias: "client-root",
    roles: ["cpcGroup", "employeeGroup"],
    items: [
      {
        title: "Clients",
        url: "/client/all",
        roles: ["cpcGroup", "employeeGroup"],
      },
        {
        title: "Brands",
        url: "/client/brands",
        roles: ["cpcGroup", "employeeGroup"],
      },

      // Projects
      {
        title: "Projects",
        url: "/project/all",
        roles: ["cpcGroup"],
      },
    
   

      // Workspace (Client-related)
      {
        title: "Teams",
        url: "/workspace/team/all",
        roles: ["cpcGroup"],
      },
      {
        title: "Tasks",
        url: "/workspace/task/all",
        roles: ["cpcGroup"],
      },
      {
        title: "Issues",
        url: "/workspace/issues/all",
        roles: ["cpcGroup"],
      },

      {
        title: "Projects",
        url: "/workspace/my-projects",
        roles: ["employeeGroup"],
      },
      {
        title: "Tasks",
        url: "/workspace/task/my-tasks",
        roles: ["employeeGroup"],
      },
      {
        title: "Issues",
        url: "/workspace/issues/my-issues",
        roles: ["employeeGroup"],
      },
      {
        title: "Teams",
        url: "/workspace/team/my-teams",
        roles: ["employeeGroup"],
      },
      {
        title: "Payment",
        url: "/finance",
        roles: ["cpcGroup"],
      },
    ],
  },

  /* ============================
   ⚙️ Master (ALL OTHERS)
  ============================ */
  {
    title: "Master",
    icon: "FolderClosed",
    alias: "master-root",
    roles: ["cpcGroup"],
    items: [
      {
        title: "Show Cause",
        url: "/escalation/show-cause",
        roles: ["cpcGroup"],
      },
      {
        title: "Service Catalog",
        url: "/master/services",
        roles: ["cpcGroup"],
      },
      {
        title: "Industry Setup",
        url: "/master/industry",
        roles: ["cpcGroup"],
      },
      {
        title: "Meeting Slots",
        url: "/master/slots",
        roles: ["cpcGroup"],
      },
    ],
  },
];



