










// 'use client';

// import React, { useState, useMemo, useCallback, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Card, CardContent } from '@/components/ui/card';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
// import { Button } from '@/components/ui/button';
// import { Calendar } from '@/components/ui/calendar';
// import { CalendarIcon, Filter, X } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import {
//   format as dateFormat,
//   isWithinInterval,
//   parseISO,
//   startOfWeek,
//   endOfWeek,
//   addWeeks,
// } from 'date-fns';
// import * as Tooltip from '@radix-ui/react-tooltip';
// import { Line, Pie } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   LineElement,
//   PointElement,
//   LinearScale,
//   CategoryScale,
//   ArcElement,
//   Tooltip as ChartTooltip,
//   Legend,
// } from 'chart.js';
// import { fetchMarketingOverview } from '@/modules/marketing/slices/MarketingOverviewSlice';

// ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, ArcElement, ChartTooltip, Legend);

// const SkeletonCard = () => (
//   <Card className="shadow-sm border border-gray-100">
//     <div className="p-4">
//       <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
//       <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
//     </div>
//   </Card>
// );

// const SkeletonChart = () => (
//   <Card className="shadow-sm border border-gray-100">
//     <div className="p-4">
//       <div className="h-4 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
//       <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
//     </div>
//   </Card>
// );

// export default function MarketingOverview() {
//   const dispatch = useDispatch();
//   const { overviewData, status } = useSelector((state) => state.marketingOverview);

//   const currentYear = new Date().getFullYear().toString();
//   const [yearFilter, setYearFilter] = useState(currentYear);
//   const [monthFilter, setMonthFilter] = useState('all');
//   const [weekFilter, setWeekFilter] = useState('all');
//   const [dateRange, setDateRange] = useState({ from: null, to: null });

//   const years = Array.from({ length: 11 }, (_, i) => (parseInt(currentYear) - 10 + i).toString());

//   const months = [
//     { value: 'all', label: 'All Months' },
//     { value: '1', label: 'January' },
//     { value: '2', label: 'February' },
//     { value: '3', label: 'March' },
//     { value: '4', label: 'April' },
//     { value: '5', label: 'May' },
//     { value: '6', label: 'June' },
//     { value: '7', label: 'July' },
//     { value: '8', label: 'August' },
//     { value: '9', label: 'September' },
//     { value: '10', label: 'October' },
//     { value: '11', label: 'November' },
//     { value: '12', label: 'December' },
//   ];

//   const weeks = useMemo(() => {
//     const weekOptions = [{ value: 'all', label: 'All Weeks' }];
//     if (monthFilter === 'all') return weekOptions;

//     const year = parseInt(yearFilter);
//     const month = parseInt(monthFilter) - 1;
//     const startDate = new Date(year, month, 1);
//     let currentWeekStart = startOfWeek(startDate, { weekStartsOn: 1 });
//     const endDate = new Date(year, month + 1, 0);

//     let weekNumber = 1;
//     while (currentWeekStart <= endDate) {
//       const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
//       weekOptions.push({
//         value: weekNumber.toString(),
//         label: `Week ${weekNumber} (${dateFormat(currentWeekStart, 'MMM dd')} - ${dateFormat(
//           weekEnd <= endDate ? weekEnd : endDate,
//           'MMM dd'
//         )})`,
//       });
//       currentWeekStart = addWeeks(currentWeekStart, 1);
//       weekNumber++;
//     }
//     return weekOptions;
//   }, [yearFilter, monthFilter]);

//   const isFilterActive =
//     yearFilter !== currentYear ||
//     monthFilter !== 'all' ||
//     weekFilter !== 'all' ||
//     (dateRange.from && dateRange.to);

//   const clearFilters = useCallback(() => {
//     setYearFilter(currentYear);
//     setMonthFilter('all');
//     setWeekFilter('all');
//     setDateRange({ from: null, to: null });
//   }, [currentYear]);

//   // Dynamic title based on current filters
//   const dynamicPeriodTitle = useMemo(() => {
//     if (dateRange.from && dateRange.to) {
//       return `${dateFormat(dateRange.from, 'MMM dd, yyyy')} – ${dateFormat(dateRange.to, 'MMM dd, yyyy')}`;
//     }

//     if (weekFilter !== 'all' && monthFilter !== 'all') {
//       const selectedWeek = weeks.find(w => w.value === weekFilter);
//       return selectedWeek ? selectedWeek.label : yearFilter;
//     }

//     if (monthFilter !== 'all') {
//       const selectedMonth = months.find(m => m.value === monthFilter);
//       return `${selectedMonth?.label} ${yearFilter}`;
//     }

//     return yearFilter;
//   }, [yearFilter, monthFilter, weekFilter, dateRange, weeks, months]);

//   useEffect(() => {
//     dispatch(fetchMarketingOverview(yearFilter));
//   }, [dispatch, yearFilter]);

//   const filteredLeadSources = useMemo(() => {
//     if (!overviewData?.leadSources) return [];

//     return overviewData.leadSources
//       .filter((item) => {
//         const itemDate = parseISO(item.date);
//         const itemYear = itemDate.getFullYear().toString();

//         if (itemYear !== yearFilter) return false;
//         if (monthFilter !== 'all' && itemDate.getMonth() + 1 !== parseInt(monthFilter)) return false;

//         if (weekFilter !== 'all' && monthFilter !== 'all') {
//           const year = parseInt(yearFilter);
//           const month = parseInt(monthFilter) - 1;
//           const weekNum = parseInt(weekFilter);
//           const weekStart = addWeeks(startOfWeek(new Date(year, month, 1), { weekStartsOn: 1 }), weekNum - 1);
//           const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
//           if (!isWithinInterval(itemDate, { start: weekStart, end: weekEnd })) return false;
//         }

//         if (dateRange.from && dateRange.to && !isWithinInterval(itemDate, { start: dateRange.from, end: dateRange.to })) return false;

//         return true;
//       })
//       .sort((a, b) => b.value - a.value)
//       .slice(0, 10);
//   }, [overviewData?.leadSources, yearFilter, monthFilter, weekFilter, dateRange]);

//   const filteredLeadTrend = useMemo(() => {
//     if (!overviewData?.leadTrend) return [];

//     return overviewData.leadTrend
//       .filter((item) => {
//         const itemDate = parseISO(item.date);
//         const itemYear = itemDate.getFullYear().toString();

//         if (itemYear !== yearFilter) return false;
//         if (monthFilter !== 'all' && itemDate.getMonth() + 1 !== parseInt(monthFilter)) return false;

//         if (weekFilter !== 'all' && monthFilter !== 'all') {
//           const year = parseInt(yearFilter);
//           const month = parseInt(monthFilter) - 1;
//           const weekNum = parseInt(weekFilter);
//           const weekStart = addWeeks(startOfWeek(new Date(year, month, 1), { weekStartsOn: 1 }), weekNum - 1);
//           const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
//           if (!isWithinInterval(itemDate, { start: weekStart, end: weekEnd })) return false;
//         }

//         if (dateRange.from && dateRange.to && !isWithinInterval(itemDate, { start: dateRange.from, end: dateRange.to })) return false;

//         return true;
//       })
//       .sort((a, b) => new Date(a.date) - new Date(b.date));
//   }, [overviewData?.leadTrend, yearFilter, monthFilter, weekFilter, dateRange]);

//   const statistics = useMemo(() => {
//     return overviewData?.statistics || [];
//   }, [overviewData?.statistics]);

//   const hasLeadSources = filteredLeadSources.length > 0;
//   const hasLeadTrend = filteredLeadTrend.length > 0;

//   const leadSourceChartData = {
//     labels: hasLeadSources ? filteredLeadSources.map((s) => s.name) : ['No Data'],
//     datasets: [
//       {
//         data: hasLeadSources ? filteredLeadSources.map((s) => s.value) : [1],
//         backgroundColor: hasLeadSources
//           ? ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#3b82f6', '#6b7280', '#d97706', '#06b6d4']
//           : ['#e5e7eb'],
//         borderColor: '#ffffff',
//         borderWidth: 2,
//       },
//     ],
//   };

//   const leadTrendChartData = {
//     labels: hasLeadTrend
//       ? filteredLeadTrend.map((t) => t.day || dateFormat(parseISO(t.date), 'MMM dd'))
//       : ['No Data'],
//     datasets: [
//       {
//         label: 'New Contacts',
//         data: hasLeadTrend ? filteredLeadTrend.map((t) => t.leads) : [0],
//         borderColor: '#10b981',
//         backgroundColor: '#10b981',
//         fill: false,
//         tension: 0.4,
//         pointBackgroundColor: '#10b981',
//         pointBorderColor: '#ffffff',
//         pointBorderWidth: 2,
//         pointRadius: 4,
//       },
//     ],
//   };

//   const commonTooltipOptions = {
//     backgroundColor: '#1f2937',
//     titleColor: '#ffffff',
//     bodyColor: '#ffffff',
//     borderColor: '#4b5563',
//     borderWidth: 1,
//     cornerRadius: 8,
//     displayColors: true,
//   };

//   const pieOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'bottom',
//         display: hasLeadSources,
//         labels: {
//           color: '#374151',
//           font: { size: 14 },
//           padding: 20,
//         },
//       },
//       tooltip: {
//         enabled: true,
//         ...commonTooltipOptions,
//         callbacks: {
//           label: (context) => {
//             if (!hasLeadSources) return 'No data available';
//             const value = context.parsed;
//             const total = context.dataset.data.reduce((a, b) => a + b, 0);
//             const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
//             return `${context.label}: ${value} (${percentage}%)`;
//           },
//         },
//       },
//     },
//   };

//   const lineOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         enabled: true,
//         ...commonTooltipOptions,
//         mode: 'index',
//         intersect: false,
//         callbacks: {
//           title: (context) => context[0]?.label || 'No Data',
//           label: (context) => `New Contacts: ${context.parsed.y || 0}`,
//         },
//       },
//     },
//     scales: {
//       x: { grid: { display: false }, ticks: { color: '#374151' } },
//       y: { grid: { color: '#e5e7eb' }, ticks: { color: '#374151', beginAtZero: true } },
//     },
//     interaction: { mode: 'nearest', axis: 'x', intersect: false },
//   };

//   const resetDateRange = () => setDateRange({ from: null, to: null });

//   return (
//     <Tooltip.Provider>
//       <div className="min-h-screen bg-gray-50">
//         <Card className="min-h-screen overflow-hidden shadow-lg border-0 bg-white">
//           <div className="bg-gradient-to-r from-teal-600 to-cyan-500 text-white p-6 sm:p-8">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h2 className="text-xl sm:text-3xl md:text-4xl font-bold">
//                   Marketing Overview {dynamicPeriodTitle !== currentYear && `– ${dynamicPeriodTitle}`}
//                 </h2>
//                 <p className="text-sm text-teal-100 mt-2">Snapshot of your marketing and contact performance</p>
//               </div>
//               {isFilterActive && (
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="bg-white hover:bg-gray-100 text-gray-600 border-gray-200 rounded-full h-10 w-10 flex items-center justify-center"
//                   onClick={clearFilters}
//                   title="Clear Filters"
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               )}
//             </div>
//           </div>

//           <CardContent className="p-4 sm:p-6 md:p-8">
//             {status === 'loading' ? (
//               <div className="space-y-8">
//                 <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-100 rounded-lg shadow-sm">
//                   {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
//                 </div>
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
//                   <SkeletonChart />
//                   <SkeletonChart />
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <div className="w-full flex flex-col sm:flex-wrap sm:flex-row gap-3 sm:gap-4 mb-8 p-4 bg-gray-100 rounded-lg shadow-sm items-stretch justify-between">
//                   {[
//                     { label: 'Filter by Year', icon: <Filter className="h-4 w-4 text-teal-600" />, content: (
//                       <Select value={yearFilter} onValueChange={setYearFilter}>
//                         <SelectTrigger className="w-full bg-white border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 h-10">
//                           <SelectValue placeholder="Select Year" />
//                         </SelectTrigger>
//                         <SelectContent className="bg-white border-gray-300">
//                           {years.map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}
//                         </SelectContent>
//                       </Select>
//                     )},
//                     { label: 'Filter by Month', icon: <Filter className="h-4 w-4 text-teal-600" />, content: (
//                       <Select value={monthFilter} onValueChange={setMonthFilter}>
//                         <SelectTrigger className="w-full bg-white border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 h-10">
//                           <SelectValue placeholder="Select Month" />
//                         </SelectTrigger>
//                         <SelectContent className="bg-white border-gray-300">
//                           {months.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
//                         </SelectContent>
//                       </Select>
//                     )},
//                     { label: 'Filter by Week', icon: <Filter className="h-4 w-4 text-teal-600" />, content: (
//                       <Select value={weekFilter} onValueChange={setWeekFilter} disabled={monthFilter === 'all'}>
//                         <SelectTrigger className="w-full bg-white border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 h-10">
//                           <SelectValue placeholder="All Weeks" />
//                         </SelectTrigger>
//                         <SelectContent className="bg-white border-gray-300">
//                           {weeks.map((w) => <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>)}
//                         </SelectContent>
//                       </Select>
//                     )},
//                     { label: 'Date Range', icon: <CalendarIcon className="h-4 w-4 text-teal-600" />, content: (
//                       <div className="relative">
//                         <Popover>
//                           <PopoverTrigger asChild>
//                             <Button
//                               variant="outline"
//                               className={cn(
//                                 'w-full justify-start text-left font-normal bg-white border-gray-300 hover:bg-gray-50 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 px-3 py-1 h-10',
//                                 !dateRange.from && 'text-gray-500'
//                               )}
//                             >
//                               <CalendarIcon className="mr-2 h-4 w-4 text-teal-600" />
//                               {dateRange.from && dateRange.to ? (
//                                 <span className="truncate">
//                                   {`${dateFormat(dateRange.from, 'MMM dd')} - ${dateFormat(dateRange.to, 'MMM dd, yyyy')}`}
//                                 </span>
//                               ) : (
//                                 'Select Date Range'
//                               )}
//                             </Button>
//                           </PopoverTrigger>
//                           <PopoverContent className="w-auto p-0 bg-white border-gray-300" align="start">
//                             <Calendar mode="range" selected={dateRange} onSelect={setDateRange} initialFocus />
//                           </PopoverContent>
//                         </Popover>
//                         {dateRange.from && (
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="absolute right-1 top-1/2 -translate-y-1/2 bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200 rounded-full h-6 w-6"
//                             onClick={resetDateRange}
//                           >
//                             <X className="h-3 w-3" />
//                           </Button>
//                         )}
//                       </div>
//                     )},
//                   ].map((field, idx) => (
//                     <div
//                       key={idx}
//                       className="flex flex-col flex-1 min-w-[240px] sm:min-w-[200px] md:min-w-[250px] bg-gray-50 rounded-lg p-2 justify-between"
//                     >
//                       <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
//                         {field.icon}
//                         <span>{field.label}</span>
//                       </div>
//                       {field.content}
//                     </div>
//                   ))}
//                 </div>

//                 <div className="mb-8">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h3>
//                   <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
//                     {statistics.map((stat, idx) => (
//                       <Tooltip.Root key={idx}>
//                         <Tooltip.Trigger asChild>
//                           <Card className="shadow-sm border border-gray-100 hover:shadow-md transition-all bg-white">
//                             <div className="p-4">
//                               <h4 className="text-xs font-medium text-gray-500">{stat.title}</h4>
//                               <p className="text-2xl font-semibold text-gray-900 mt-2">
//                                 {stat.value}
//                               </p>
//                             </div>
//                           </Card>
//                         </Tooltip.Trigger>
//                         <Tooltip.Portal>
//                           <Tooltip.Content className="bg-gray-700 text-white text-sm rounded-md px-2 py-1 shadow-lg" sideOffset={5}>
//                             {stat.title}
//                             <Tooltip.Arrow className="fill-gray-700" />
//                           </Tooltip.Content>
//                         </Tooltip.Portal>
//                       </Tooltip.Root>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   <Card className="shadow-sm border border-gray-100 bg-white">
//                     <div className="p-4">
//                       <h3 className="text-base font-semibold text-gray-800">Lead Source Distribution</h3>
//                       <div className="h-72 mt-4">
//                         <Pie data={leadSourceChartData} options={pieOptions} />
//                       </div>
//                     </div>
//                   </Card>

//                   <Card className="shadow-sm border border-gray-100 bg-white">
//                     <div className="p-4">
//                       <h3 className="text-base font-semibold text-gray-800">New Contacts Over Time</h3>
//                       <div className="h-72 mt-4">
//                         <Line data={leadTrendChartData} options={lineOptions} />
//                       </div>
//                     </div>
//                   </Card>
//                 </div>
//               </>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </Tooltip.Provider>
//   );
// }





'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  format as dateFormat,
  isWithinInterval,
  parseISO,
} from 'date-fns';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { fetchMarketingOverview } from '@/modules/marketing/slices/MarketingOverviewSlice';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, ArcElement, ChartTooltip, Legend);

const SkeletonCard = () => (
  <Card className="shadow-sm border border-gray-100">
    <div className="p-4">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
      <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
    </div>
  </Card>
);

const SkeletonChart = () => (
  <Card className="shadow-sm border border-gray-100">
    <div className="p-4">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
      <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
    </div>
  </Card>
);

export default function MarketingOverview() {
  const dispatch = useDispatch();
  const { overviewData, status } = useSelector((state) => state.marketingOverview);

  const currentYear = new Date().getFullYear().toString();
  const [yearFilter, setYearFilter] = useState(currentYear);
  const [monthFilter, setMonthFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const years = Array.from({ length: 11 }, (_, i) => (parseInt(currentYear) - 10 + i).toString());

  const months = [
    { value: 'all', label: 'All Months' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  // Compute applied date range (start & end) based on priority
  const appliedDateRange = useMemo(() => {
    // 1. Custom date range has highest priority
    if (dateRange.from && dateRange.to) {
      return {
        start: dateFormat(dateRange.from, 'yyyy-MM-dd'),
        end: dateFormat(dateRange.to, 'yyyy-MM-dd'),
      };
    }

    // 2. Month selected
    if (monthFilter !== 'all') {
      const year = parseInt(yearFilter);
      const month = parseInt(monthFilter) - 1;
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0); // last day of month
      return {
        start: dateFormat(start, 'yyyy-MM-dd'),
        end: dateFormat(end, 'yyyy-MM-dd'),
      };
    }

    // 3. Only year → full year
    const year = parseInt(yearFilter);
    return {
      start: `${year}-01-01`,
      end: `${year}-12-31`,
    };
  }, [yearFilter, monthFilter, dateRange]);

  // Dispatch API call whenever applied date range changes
  useEffect(() => {
    dispatch(fetchMarketingOverview({
      startDate: appliedDateRange.start,
      endDate: appliedDateRange.end,
    }));
  }, [dispatch, appliedDateRange]);

  // Dynamic title
  const dynamicPeriodTitle = useMemo(() => {
    if (dateRange.from && dateRange.to) {
      return `${dateFormat(dateRange.from, 'MMM dd, yyyy')} – ${dateFormat(dateRange.to, 'MMM dd, yyyy')}`;
    }
    if (monthFilter !== 'all') {
      const selectedMonth = months.find(m => m.value === monthFilter);
      return `${selectedMonth?.label} ${yearFilter}`;
    }
    return yearFilter;
  }, [yearFilter, monthFilter, dateRange]);

  const isFilterActive =
    yearFilter !== currentYear ||
    monthFilter !== 'all' ||
    (dateRange.from && dateRange.to);

  const clearFilters = useCallback(() => {
    setYearFilter(currentYear);
    setMonthFilter('all');
    setDateRange({ from: null, to: null });
  }, [currentYear]);

  // Client-side filtering using the same date range
  const filteredLeadSources = useMemo(() => {
    if (!overviewData?.leadSources) return [];

    const start = new Date(appliedDateRange.start);
    const end = new Date(appliedDateRange.end);

    return overviewData.leadSources
      .filter((item) => {
        const itemDate = parseISO(item.date);
        return isWithinInterval(itemDate, { start, end });
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [overviewData?.leadSources, appliedDateRange]);

  const filteredLeadTrend = useMemo(() => {
    if (!overviewData?.leadTrend) return [];

    const start = new Date(appliedDateRange.start);
    const end = new Date(appliedDateRange.end);

    return overviewData.leadTrend
      .filter((item) => {
        const itemDate = parseISO(item.date);
        return isWithinInterval(itemDate, { start, end });
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [overviewData?.leadTrend, appliedDateRange]);

  const statistics = useMemo(() => overviewData?.statistics || [], [overviewData?.statistics]);

  const hasLeadSources = filteredLeadSources.length > 0;
  const hasLeadTrend = filteredLeadTrend.length > 0;

  const leadSourceChartData = {
    labels: hasLeadSources ? filteredLeadSources.map((s) => s.name) : ['No Data'],
    datasets: [{
      data: hasLeadSources ? filteredLeadSources.map((s) => s.value) : [1],
      backgroundColor: hasLeadSources
        ? ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#3b82f6', '#6b7280', '#d97706', '#06b6d4']
        : ['#e5e7eb'],
      borderColor: '#ffffff',
      borderWidth: 2,
    }],
  };

  const leadTrendChartData = {
    labels: hasLeadTrend
      ? filteredLeadTrend.map((t) => t.day || dateFormat(parseISO(t.date), 'MMM dd'))
      : ['No Data'],
    datasets: [{
      label: 'New Contacts',
      data: hasLeadTrend ? filteredLeadTrend.map((t) => t.leads) : [0],
      borderColor: '#10b981',
      backgroundColor: '#10b981',
      fill: false,
      tension: 0.4,
      pointBackgroundColor: '#10b981',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 4,
    }],
  };

  const commonTooltipOptions = {
    backgroundColor: '#1f2937',
    titleColor: '#ffffff',
    bodyColor: '#ffffff',
    borderColor: '#4b5563',
    borderWidth: 1,
    cornerRadius: 8,
    displayColors: true,
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', display: hasLeadSources, labels: { color: '#374151', font: { size: 14 }, padding: 20 } },
      tooltip: {
        enabled: true,
        ...commonTooltipOptions,
        callbacks: {
          label: (context) => {
            if (!hasLeadSources) return 'No data available';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        ...commonTooltipOptions,
        mode: 'index',
        intersect: false,
        callbacks: {
          title: (context) => context[0]?.label || 'No Data',
          label: (context) => `New Contacts: ${context.parsed.y || 0}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#374151' } },
      y: { grid: { color: '#e5e7eb' }, ticks: { color: '#374151', beginAtZero: true } },
    },
    interaction: { mode: 'nearest', axis: 'x', intersect: false },
  };

  const resetDateRange = () => setDateRange({ from: null, to: null });

  return (
    <Tooltip.Provider>
      <div className="min-h-screen bg-gray-50">
        <Card className="min-h-screen overflow-hidden shadow-lg border-0 bg-white">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-500 text-white p-6 sm:p-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl sm:text-3xl md:text-4xl font-bold">
                  Marketing Overview {dynamicPeriodTitle !== currentYear && `– ${dynamicPeriodTitle}`}
                </h2>
                <p className="text-sm text-teal-100 mt-2">Snapshot of your marketing and contact performance</p>
              </div>
              {isFilterActive && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-white hover:bg-gray-100 text-gray-600 border-gray-200 rounded-full h-10 w-10 flex items-center justify-center"
                  onClick={clearFilters}
                  title="Clear Filters"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <CardContent className="p-4 sm:p-6 md:p-8">
            {status === 'loading' ? (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-100 rounded-lg shadow-sm">
                  {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                  <SkeletonChart />
                  <SkeletonChart />
                </div>
              </div>
            ) : (
              <>
                <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 p-4 bg-gray-100 rounded-lg shadow-sm items-stretch">
                  {[
                    { label: 'Filter by Year', icon: <Filter className="h-4 w-4 text-teal-600" />, content: (
                      <Select value={yearFilter} onValueChange={setYearFilter}>
                        <SelectTrigger className="w-full bg-white border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 h-10">
                          <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )},
                    { label: 'Filter by Month', icon: <Filter className="h-4 w-4 text-teal-600" />, content: (
                      <Select value={monthFilter} onValueChange={setMonthFilter}>
                        <SelectTrigger className="w-full bg-white border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 h-10">
                          <SelectValue placeholder="All Months" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )},
                    { label: 'Date Range', icon: <CalendarIcon className="h-4 w-4 text-teal-600" />, content: (
                      <div className="relative">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full justify-start text-left font-normal bg-white border-gray-300 hover:bg-gray-50 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 px-3 py-1 h-10',
                                !dateRange.from && 'text-gray-500'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 text-teal-600" />
                              {dateRange.from && dateRange.to ? (
                                <span className="truncate">
                                  {`${dateFormat(dateRange.from, 'MMM dd')} - ${dateFormat(dateRange.to, 'MMM dd, yyyy')}`}
                                </span>
                              ) : (
                                'Select Date Range'
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="range" selected={dateRange} onSelect={setDateRange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        {dateRange.from && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 -translate-y-1/2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full h-6 w-6"
                            onClick={resetDateRange}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    )},
                  ].map((field, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col flex-1 min-w-[200px] bg-gray-50 rounded-lg p-2"
                    >
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        {field.icon}
                        <span>{field.label}</span>
                      </div>
                      {field.content}
                    </div>
                  ))}
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {statistics.map((stat, idx) => (
                      <Tooltip.Root key={idx}>
                        <Tooltip.Trigger asChild>
                          <Card className="shadow-sm border border-gray-100 hover:shadow-md transition-all bg-white">
                            <div className="p-4">
                              <h4 className="text-xs font-medium text-gray-500">{stat.title}</h4>
                              <p className="text-2xl font-semibold text-gray-900 mt-2">{stat.value}</p>
                            </div>
                          </Card>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content className="bg-gray-700 text-white text-sm rounded-md px-2 py-1 shadow-lg" sideOffset={5}>
                            {stat.title}
                            <Tooltip.Arrow className="fill-gray-700" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="shadow-sm border border-gray-100 bg-white">
                    <div className="p-4">
                      <h3 className="text-base font-semibold text-gray-800">Lead Source Distribution</h3>
                      <div className="h-72 mt-4">
                        <Pie data={leadSourceChartData} options={pieOptions} />
                      </div>
                    </div>
                  </Card>

                  <Card className="shadow-sm border border-gray-100 bg-white">
                    <div className="p-4">
                      <h3 className="text-base font-semibold text-gray-800">New Contacts Over Time</h3>
                      <div className="h-72 mt-4">
                        <Line data={leadTrendChartData} options={lineOptions} />
                      </div>
                    </div>
                  </Card>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Tooltip.Provider>
  );
}