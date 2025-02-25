"use client";

import AdminDashboardHero from "../components/Admin/AdminDashboardHero";
import AdminSidebar from "../components/Admin/Sidebar/AdminSidebar";
import { AdminProtected } from "../hooks/adminProtected";
import Heading from "../utilis/Heading";

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
          <div className="w-full">
            <AdminDashboardHero isDashboard={true} />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;