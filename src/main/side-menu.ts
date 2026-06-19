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
  }
];

export default menu;
