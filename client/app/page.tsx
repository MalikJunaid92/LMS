"use client";
import React, { FC, useState } from "react";
import Heading from "./utilis/Heading";
interface Props {}
const Page: FC<Props> = (props) => {
  return (
    <div>
      <Heading
        title="ELearning"
        description="ELearning is a platform for students to learn and get help from teachers"
        keywords="Programming,MERN,Redux,Machine Learning"
      />
    </div>
  );
};

export default Page;
