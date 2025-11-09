export const languages: { value: string; name: string }[] = [
  { value: "en", name: "English" },
  { value: "pcm", name: "Pidgin" },
  { value: "yo", name: "Yoruba" },
  { value: "ha", name: "Hausa" },
  { value: "ig", name: "Igbo" },
];

export const roleOptions = [
  {
    id: "vehicle_owner",
    title: "Vehicle Owner",
    description: "For personal car monitoring and maintenance.",
    icon: "user",
    iconImg: "vehicle_owner",
  },
  {
    id: "fleet_manager",
    title: "Fleet Manager",
    description: "To manage and track multiple vehicles.",
    icon: "truck",
    iconImg: "fleet_manager",
  },
  {
    id: "mechanic",
    title: "Mechanic",
    description: "To receive and handle service requests.",
    icon: "tool",
    iconImg: "mechanic",
  },
];

export const services = [
  {
    id: "ENGINE_DIAGNOSTICS",
    name: "Engine diagnostics",
    icon: "🔧",
    iconType: "MaterialIcons",
    iconName: "build",
    color: "#4CAF50",
  },
  {
    id: "AC_REPAIR",
    name: "AC repair",
    icon: "🏪",
    iconType: "MaterialIcons",
    iconName: "ac-unit",
    color: "#2196F3",
  },
  {
    id: "OIL_CHANGE",
    name: "Oil change",
    icon: "⚱️",
    iconType: "MaterialIcons",
    iconName: "opacity",
    color: "#FF9800",
  },
  {
    id: "BRAKE_INSPECTION_AND_REPAIR",
    name: "Brake inspection & repair",
    icon: "⚪",
    iconType: "MaterialIcons",
    iconName: "album",
    color: "#9C27B0",
  },
  {
    id: "TTIRE_SERVICE",
    name: "Tire services",
    icon: "🔧",
    iconType: "MaterialIcons",
    iconName: "donut-small",
    color: "#FF5722",
  },
  {
    id: "ROAD_SIDE_ASSIST_AND_TOWING",
    name: "Road side assist & towing",
    icon: "🚛",
    iconType: "MaterialIcons",
    iconName: "local-shipping",
    color: "#00BCD4",
  },
  {
    id: "COOLING_SYSTEM_REPAIR",
    name: "Cooling system repair",
    icon: "🌡️",
    iconType: "MaterialIcons",
    iconName: "thermostat",
    color: "#E91E63",
  },
  {
    id: "SUSPENSION",
    name: "Suspension",
    icon: "🔧",
    iconType: "MaterialIcons",
    iconName: "settings-input-component",
    color: "#F44336",
  },
  {
    id: "TRANSMISSION_AND_CLUTCH_SERVICES",
    name: "Transmission & clutch services",
    icon: "⚙️",
    iconType: "MaterialIcons",
    iconName: "settings",
    color: "#009688",
  },
  {
    id: "BATTERY_REPLACEMENT_AND_REPAIR",
    name: "Battery replacement & repair",
    icon: "🔋",
    iconType: "MaterialIcons",
    iconName: "battery-full",
    color: "#607D8B",
  },
];
export const experienceOptions = [
  { name: "1 year", value: "1" },
  { name: "2 years", value: "2" },
  { name: "3 years", value: "3" },
  { name: "4-5 years", value: "4-5" },
  { name: "6+ years", value: "6+" },
];

export const jobDetails = {
  id: 1,
  vehicle: "Toyota Corolla 2015",
  jobType: "Brake Repair",
  vin: "9RT6504382I1CCG",
  plateNumber: "9RT6504382I1CCG",
  date: "20th August 2025, 4:05pm",
  status: "Completed",
  description:
    "Replace front brake pads and rotors. Inspect brake lines and fluid levels.",
  timeline: [
    {
      title: "Job Started",
      time: "20th August 2025, 8:00am",
    },
    {
      title: "Job Completed",
      time: "20th August 2025, 4:05pm",
    },
  ],
  costBreakdown: [
    { item: "Front brake pads", amount: 100000 },
    { item: "Front brake rotors", amount: 150000 },
    { item: "Workmanship", amount: 10000 },
  ],
  total: 260000,
  mechanicNotes:
    "Replaced brake pads and rotors. Inspected brake lines and fluid levels. No leaks found. Test drove vehicle to ensure proper brake function.",
};

export const supportAvatars = [
  { initial: "S", color: "#003466" },
  { initial: "M", color: "#2964C2" },
  { initial: "A", color: "#003466" },
  { initial: "P", color: "#2964C2" },
  { initial: "J", color: "#003466" },
];

export const chatData: any[] = [
  // {
  //   id: "1",
  //   name: "Jason Alex",
  //   message: "Okay, thank you",
  //   time: "2 hours ago",
  //   unreadCount: 3,
  //   avatar: "https://i.pravatar.cc/150?img=1",
  // },
  // {
  //   id: "2",
  //   name: "John Bull",
  //   message: "Hi Sarah, how is the going?",
  //   time: "3 hours ago",
  //   unreadCount: 2,
  //   avatar: "https://i.pravatar.cc/150?img=2",
  // },
  // {
  //   id: "3",
  //   name: "Ralph James",
  //   message: "Thank you so much Sarah",
  //   time: "Yesterday",
  //   unreadCount: 0,
  //   avatar: "https://i.pravatar.cc/150?img=3",
  // },
  // {
  //   id: "4",
  //   name: "Rose Peter",
  //   message: "Really? I hope to get a high quality job done",
  //   time: "Monday",
  //   unreadCount: 0,
  //   avatar: "https://i.pravatar.cc/150?img=4",
  // },
];
