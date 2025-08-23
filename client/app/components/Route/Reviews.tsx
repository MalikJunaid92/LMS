import Image from "next/image";
import ReviewCard from "../../components/Review/ReviewCard";
import { styles } from "../../styles/style";
import { HiSparkles } from "react-icons/hi";
import { FiUsers, FiTrendingUp, FiStar } from "react-icons/fi";
import profileImage from "../../../public/assets/Profile.png"; // Correct import
import businessImage from "../../../public/assets/business-img.png"; // Correct import

type Props = {};

export const reviews = [
  {
    name: "Sarah Johnson",
    rating: 4.8,
    avatar: profileImage,
    Profession: "Data Scientist | Google",
    comment:
      "The courses here are absolutely phenomenal! I landed my dream job at Google after completing the machine learning track. The instructors are world-class and the content is always up-to-date.",
  },
  {
    name: "Michael Chen",
    avatar: profileImage,
    rating: 5,
    Profession: "Full Stack Developer | Microsoft",
    comment:
      "I went from complete beginner to landing a job at Microsoft in just 8 months. The project-based learning approach really helped me build a strong portfolio that impressed my interviewers.",
  },
  {
    rating: 4.9,
    name: "Emily Rodriguez",
    avatar: profileImage,
    Profession: "UX Designer | Apple",
    comment:
      "The design courses transformed my career completely. Now I'm working at Apple and couldn't be happier. The mentorship and feedback were invaluable throughout my journey.",
  },
  {
    name: "David Kim",
    rating: 4.7,
    avatar: profileImage,
    Profession: "DevOps Engineer | Amazon",
    comment:
      "Excellent platform with hands-on projects that mirror real-world scenarios. The cloud computing courses prepared me perfectly for my current role at Amazon.",
  },
  {
    name: "Lisa Thompson",
    rating: 5,
    avatar: profileImage,
    Profession: "Product Manager | Netflix",
    comment:
      "The business and product management courses are top-notch. I gained the skills needed to transition into product management and now lead a team at Netflix.",
  },
  {
    name: "James Wilson",
    rating: 4.6,
    avatar: profileImage,
    Profession: "Cybersecurity Analyst | Tesla",
    comment:
      "Outstanding cybersecurity curriculum with cutting-edge content. The certifications I earned here opened doors to my current position at Tesla.",
  },
];

const Reviews = (props: Props) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
      <div className="w-[90%] 800px:w-[85%] m-auto">
        <div className="w-full 800px:flex items-center mb-16">
          <div className="800px:w-[50%] w-full relative">
            <div className="relative">
              <Image 
                src={businessImage} 
                width={800} 
                height={800} 
                alt="business" 
                className="rounded-2xl shadow-2xl"
              />
              {/* Floating stats cards */}
              <div className="absolute -top-8 -right-8 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 hidden 800px:block">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <FiUsers className="text-blue-600 dark:text-blue-400 text-xl" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">500K+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Happy Students</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-8 -left-8 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 hidden 800px:block">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <FiStar className="text-green-600 dark:text-green-400 text-xl" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">4.9/5</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="800px:w-[50%] w-full 800px:pl-12 mt-8 800px:mt-0">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <HiSparkles className="text-yellow-400 text-sm" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Student Success Stories
              </span>
            </div>
            
            <h3 className={`${styles.modernTitle} !text-[32px] 800px:!text-[40px] !leading-tight mb-6`}>
              Our Students are <span className="gradient-text">Our Strength</span>
              <br />
              See What They Say About Us
            </h3>
            
            <p className={`${styles.modernSubtitle} mb-8`}>
              Join thousands of successful graduates who transformed their careers with our expert-led courses. 
              Real stories from real people who achieved their dreams.
            </p>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <FiTrendingUp className="text-green-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">98% Job Placement Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <FiStar className="text-yellow-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">4.9/5 Student Rating</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 mb-12">
          {reviews.map((item, index) => (
            <div key={index} className="fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
              <ReviewCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
