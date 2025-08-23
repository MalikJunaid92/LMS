import Ratings from "@/app/utilis/Ratings";
import Image from "next/image";
import { FC } from "react";
import { FiMessageCircle } from "react-icons/fi";

type Props = {
  item: any;
};

const ReviewCard: FC<Props> = ({ item }) => {
  return (
    <div className="modern-card h-full p-6 relative overflow-hidden group">
      {/* Decorative quote icon */}
      <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
        <FiMessageCircle className="text-4xl text-purple-600" />
      </div>
      
      {/* Card content */}
      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <Image
              src={item.avatar}
              height={60}
              width={60}
              className="w-[60px] h-[60px] rounded-full object-cover border-2 border-purple-200 dark:border-purple-700"
              alt={item.name}
            />
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h5 className="text-[18px] font-semibold text-gray-900 dark:text-white mb-1">
                  {item.name}
                </h5>
                <p className="text-[14px] text-purple-600 dark:text-purple-400 font-medium">
                  {item.Profession}
                </p>
              </div>
              <div className="flex-shrink-0">
                <Ratings rating={item.rating} />
              </div>
            </div>
          </div>
        </div>
        
        <blockquote className="text-gray-600 dark:text-gray-300 leading-relaxed text-[15px] font-medium relative">
          "{item.comment}"
        </blockquote>
        
        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );
};

export default ReviewCard;