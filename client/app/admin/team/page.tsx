"use client";

import AdminDashboardHero from "@/app/components/Admin/AdminDashboardHero";
import AdminSidebar from "@/app/components/Admin/Sidebar/AdminSidebar";
import { AdminProtected } from "@/app/hooks/adminProtected";
import AllUsers from "../../components/Admin/Users/AllUsers";
import Heading from "@/app/utilis/Heading";


type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title="ELearning Admin"
          description="ELearning is a platform for students to learn and get help from teachers"
          keywords="Programming, MERN, Redux,AI/ML"
        />
        <div className="flex h-screen">
          <div className="1500px:w-1/6 w-1/5">
            <AdminSidebar />
          </div>
          <div className="w-[85%]">
            <AdminDashboardHero />
            <AllUsers isTeam={true} />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;