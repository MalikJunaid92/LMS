"use client";

import Heading from "@/app/utilis/Heading";
import CreateCourse from "../../components/Admin/Course/CreateCourse";
import DashboardHeader from "../../components/Admin/DashboardHeader";
import AdminSidebar from "../../components/Admin/Sidebar/AdminSidebar";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <Heading
        title="ELearning Admin"
        description="ELearning is a platform for students to learn and get help from teachers"
        keywords="Programming, MERN, Redux,AI/ML"
      />
      <div className="flex min-h-screen">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
          <DashboardHeader />
          <CreateCourse />
        </div>
      </div>
    </div>
  );
};

export default page;