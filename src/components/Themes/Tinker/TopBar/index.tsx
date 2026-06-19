import Lucide from "@/components/Base/Lucide";
import Breadcrumb from "@/components/Base/Breadcrumb";
import { Menu } from "@/components/Base/Headless";
import _ from "lodash";
import { UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Main() {

  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <>
      {/* BEGIN: Top Bar */}
      <div className="relative z-[51] flex h-[67px] items-center border-b border-slate-200">
        {/* BEGIN: Breadcrumb */}
        <Breadcrumb className="hidden mr-auto -intro-x sm:flex">
          <Breadcrumb.Link to="/">Application</Breadcrumb.Link>
          <Breadcrumb.Link to="/" active={true}>
            Dashboard
          </Breadcrumb.Link>
        </Breadcrumb>
        {/* END: Breadcrumb */}
        {/* BEGIN: Account Menu */}
        <Menu>
          <Menu.Button className="w-8 h-8 flex justify-center border-2 border-gray-300 items-center overflow-hidden rounded-full shadow-lg image-fit zoom-in intro-x">
            <UserIcon className="w-[70%] h-[70%] text-gray-600" />
          </Menu.Button>
          <Menu.Items className="w-44 mt-px text-white bg-primary">
            <Menu.Header className="font-normal">
              <div className="font-medium">Admin</div>
              <div className="text-xs text-white/70 dark:text-slate-500">
                admin@admin.com
              </div>
            </Menu.Header>
            <Menu.Divider className="bg-white/[0.08]" />
            <Menu.Item onClick={handleLogout} className="hover:bg-white/5 text-red-400">
              <Lucide icon="LogOut" className="w-4 h-4 mr-2" /> Logout
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
      {/* END: Top Bar */}
    </>
  );
}

export default Main;
