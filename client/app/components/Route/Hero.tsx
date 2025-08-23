/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { HiSparkles } from "react-icons/hi";
import { FiTrendingUp, FiUsers, FiBookOpen } from "react-icons/fi";
import Loader from "../Loader/Loader";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { styles } from "@/app/styles/style";

type Props = {};

const Hero: FC<Props> = (props) => {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetHeroDataQuery("Banner", {
    refetchOnMountOrArgChange: true,
  });
  const router = useRouter();

  const handleSearch = (e: any) => {
    if (search === "") {
      return;
    } else {
      router.push(`/courses?title=${search}`);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={`${styles.heroContainer} w-full min-h-screen flex items-center relative`}>
          {/* Enhanced Background Animation */}
          <div className="absolute top-[100px] 1000px:top-[unset] 1500px:h-[700px] 1500px:w-[700px] 1100px:h-[600px] 1100px:w-[600px] h-[40vh] left-5 w-[40vh] hero_animation rounded-[50%] 1100px:left-8 1500px:left-14 opacity-80"></div>
          
          {/* Additional decorative elements */}
          <div className="absolute top-20 right-20 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse hidden 1000px:block"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-15 animate-bounce hidden 1000px:block"></div>
          
          <div className="1000px:flex items-center w-full max-w-7xl mx-auto px-4">
            {/* Image Section */}
            <div className="1000px:w-[40%] flex justify-center items-center pt-[70px] 1000px:pt-[0] z-10 relative">
              <div className="relative">
                {data?.layout?.banner?.image?.url ? (
                  <Image
                    src={data?.layout?.banner?.image?.url}
                    width={500}
                    height={500}
                    alt="Hero Banner"
                    className="object-contain 1100px:max-w-[90%] w-[90%] 1500px:max-w-[85%] h-[auto] z-[10] drop-shadow-2xl"
                  />
                ) : (
                  <Image
                    src={require("../../../public/assets/hero-banner-1.png")}
                    width={500}
                    height={500}
                    alt="Hero Banner"
                    className="object-contain 1100px:max-w-[90%] w-[90%] 1500px:max-w-[85%] h-[auto] z-[10] drop-shadow-2xl"
                  />
                )}
                {/* Floating icons around the image */}
                <div className="absolute -top-5 -right-5 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hidden 1000px:block">
                  <HiSparkles className="text-yellow-500 text-2xl" />
                </div>
                <div className="absolute -bottom-5 -left-5 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hidden 1000px:block">
                  <FiTrendingUp className="text-green-500 text-2xl" />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="1000px:w-[60%] flex flex-col items-center 1000px:items-start 1000px:mt-[0px] text-center 1000px:text-left mt-[100px] z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                <HiSparkles className="text-yellow-400 text-sm" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  #1 Online Learning Platform
                </span>
              </div>

              {/* Main Title */}
              <h1 className={`${styles.modernTitle} px-3 w-full 1500px:w-[80%] 1100px:w-[90%] mb-6 fade-in-up`}>
                {data?.layout?.banner?.title
                  ? data.layout.banner.title
                  : "Transform Your Future with Expert-Led Online Courses"}
              </h1>

              {/* Subtitle */}
              <p className={`${styles.modernSubtitle} px-3 1500px:w-[75%] 1100px:w-[85%] mb-8 fade-in-up`} style={{animationDelay: '0.2s'}}>
                {data?.layout?.banner?.subTitle
                  ? data?.layout?.banner?.subTitle
                  : "Join over 500,000 learners worldwide and master new skills with our comprehensive online courses taught by industry experts."}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mb-8 fade-in-up" style={{animationDelay: '0.4s'}}>
                <div className="flex items-center gap-2">
                  <FiUsers className="text-blue-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">500K+ Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiBookOpen className="text-purple-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">20K+ Courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiTrendingUp className="text-green-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">98% Success Rate</span>
                </div>
              </div>

              {/* Enhanced Search Bar */}
              <div className="modern-search 1500px:w-[75%] 1100px:w-[85%] w-[90%] h-[60px] relative mb-8 fade-in-up" style={{animationDelay: '0.6s'}}>
                <input
                  type="search"
                  placeholder="What do you want to learn today?"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-full px-6 pr-16 text-[16px] font-medium rounded-16 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-700 dark:text-gray-200"
                />
                <button
                  className="modern-search-button absolute right-2 top-2 bottom-2 px-6 flex items-center justify-center"
                  onClick={handleSearch}
                >
                  <BiSearch className="text-white text-xl" />
                </button>
              </div>

              {/* Social Proof */}
              <div className="1500px:w-[75%] 1100px:w-[85%] w-[90%] flex flex-col sm:flex-row items-center gap-4 fade-in-up" style={{animationDelay: '0.8s'}}>
                <div className="flex items-center">
                  <Image
                    src={require("../../../public/assets/client-1.jpg")}
                    alt="Student"
                    className="rounded-full w-12 h-12 border-2 border-white shadow-lg"
                  />
                  <Image
                    src={require("../../../public/assets/client-2.jpg")}
                    alt="Student"
                    className="rounded-full w-12 h-12 border-2 border-white shadow-lg ml-[-12px]"
                  />
                  <Image
                    src={require("../../../public/assets/client-3.jpg")}
                    alt="Student"
                    className="rounded-full w-12 h-12 border-2 border-white shadow-lg ml-[-12px]"
                  />
                  <div className="rounded-full w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm ml-[-12px] border-2 border-white shadow-lg">
                    +99
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    Join <span className="font-bold text-purple-600">500,000+</span> learners already transforming their careers.{" "}
                    <Link
                      href="/courses"
                      className="text-purple-600 hover:text-purple-700 font-semibold underline decoration-2 underline-offset-2 transition-colors"
                    >
                      Start Learning Today
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;