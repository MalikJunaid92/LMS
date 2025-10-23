"use client";
export const dynamic = "force-dynamic";

import AdminDashboardHero from "@/app/components/Admin/AdminDashboardHero";
import AdminSidebar from "@/app/components/Admin/Sidebar/AdminSidebar";
import { AdminProtected } from "@/app/hooks/adminProtected";
import EditHero from "../../components/Admin/Customization/EditHero";
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
        <div className="flex min-h-screen">
          <div className="1500px:w-1/6 w-1/5">
            <AdminSidebar />
          </div>
          <div className="w-[85%]">
            <AdminDashboardHero />
            <EditHero />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;