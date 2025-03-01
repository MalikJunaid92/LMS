"use client";

import { useState } from "react";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header";
import About from "./About";
import Heading from "../utilis/Heading";

type Props = {};

const Page = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(2);
  const [route, setRoute] = useState("Login");

  return (
    <div>
      <Heading
        title="About us - ELearning"
        description="ELearning is a learning management system for helping programmers"
        keywords="programming,MERN"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <About />
      <Footer />
    </div>
  );
};

export default Page;