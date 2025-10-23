"use client";
export const dynamic = "force-dynamic";

import { FC, useState } from "react";
import { useSelector } from "react-redux";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header";
import Profile from "../components/Profile/Profile";
import Protected from "../hooks/useProtected";
import Heading from "../utilis/Heading";

type Props = {};

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(5);
  const [route, setRoute] = useState("Login");
  const { user } = useSelector((state: any) => state.auth);

  return (
    <div className="min-h-screen">
      <Protected>
        <Heading
          title={`${user?.name ?? "Profile"} Profile -ELearning`}
          description="ELearning is a platform for students to learn and get help from teachers"
          keywords="Programming, MERN, Typescript, Redux"
        />
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />
        <Profile user={user} />
        <Footer />
      </Protected>
    </div>
  );
};

export default Page;