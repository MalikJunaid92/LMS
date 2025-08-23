import { useEffect, useState } from "react";
import CourseCard from "../Course/CourseCard";
import { useGetUserAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { styles } from "../../styles/style";
import { HiSparkles } from "react-icons/hi";
import { FiBookOpen, FiUsers, FiTrendingUp } from "react-icons/fi";

type Props = {};

const Courses = (props: Props) => {
  const [courses, setCourses] = useState<any[]>([]);
  const { data, isLoading } = useGetUserAllCoursesQuery({});
  
  useEffect(() => {
    setCourses(data?.courses);
  }, [data]);

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
      <div className={`w-[90%] 800px:w-[80%] m-auto`}>
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <HiSparkles className="text-yellow-400 text-sm" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Featured Courses
            </span>
          </div>
          
          <h1 className={`${styles.modernTitle} !text-[28px] sm:!text-[36px] lg:!text-[44px] mb-6`}>
            Expand Your Career <span className="gradient-text">Opportunity</span>{" "}
            <br />
            With Our Expert Courses
          </h1>
          
          <p className={`${styles.modernSubtitle} max-w-3xl mx-auto mb-8`}>
            Choose from our comprehensive collection of courses designed by industry experts. 
            Learn at your own pace and transform your career with hands-on projects and real-world applications.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
              <FiBookOpen className="text-blue-500 text-xl" />
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">20K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Courses</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
              <FiUsers className="text-purple-500 text-xl" />
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">500K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Students</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
              <FiTrendingUp className="text-green-500 text-xl" />
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">98%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Courses Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="modern-card h-64 animate-pulse">
                <div className="bg-gray-300 dark:bg-gray-600 h-40 rounded-lg mb-4"></div>
                <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-[25px] md:grid-cols-2 md:gap-[30px] lg:grid-cols-3 lg:gap-[30px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12">
            {courses &&
              courses.map((item: any, index: number) => (
                <div key={index} className="fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <CourseCard item={item} />
                </div>
              ))}
          </div>
        )}
        
        {(!courses || courses.length === 0) && !isLoading && (
          <div className="text-center py-12">
            <div className="modern-card p-8 max-w-md mx-auto">
              <FiBookOpen className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Courses Available
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our amazing courses are coming soon. Stay tuned for updates!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;