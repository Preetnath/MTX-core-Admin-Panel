import { type Menu } from "@/stores/menuSlice";

const menu: Array<Menu | "divider"> = [

  //new
  {
    icon: "Home",
    pathname: "/dashboard",
    title: "Dashboard",
  },
  {
    icon: "Users",
    pathname: "/dashboard/users",
    title: "Users",
  },
  {
    icon: "Users",
    pathname: "/dashboard/brokers",
    title: "Brokers",
  },
  {
    icon: "Activity",
    pathname: "/dashboard/symbols",
    title: "Symbols",
  },
  {
    icon: "CreditCard",
    pathname: "/dashboard/deposit",
    title: "Deposit",
  },
  {
    icon: "Settings",
    pathname: "/dashboard/system-setting",
    title: "System Setting",
  }
];

export default menu;
