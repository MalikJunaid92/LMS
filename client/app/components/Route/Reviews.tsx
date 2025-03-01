import Image from "next/image";
import ReviewCard from "../../components/Review/ReviewCard";
import { styles } from "../../styles/style";
import profileImage from "../../../public/assets/Profile.png"; // Correct import
import businessImage from "../../../public/assets/business-img.png"; // Correct import

type Props = {};

export const reviews = [
  {
    name: "John Doe",
    rating: 4.5,
    avatar: profileImage,
    Profession: "Student | University of Education",
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni voluptatem repellendus necessitatibus natus atque nam eos quis minima veritatis earum sunt fugiat, perspiciatis vitae eaque quas laudantium autem, distinctio itaque.",
  },
  {
    name: "John Doe",
    avatar: profileImage,
    rating: 5,
    Profession: "Student | University of Education",
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni voluptatem repellendus necessitatibus natus atque nam eos quis minima veritatis earum sunt fugiat, perspiciatis vitae eaque quas laudantium autem.",
  },
  {
    rating: 3,
    name: "John Doe",
    avatar: profileImage,
    Profession: "Student | University of Education",
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni voluptatem repellendus necessitatibus natus atque nam eos quis minima veritatis earum sunt fugiat.",
  },
  {
    name: "John Doe",
    rating: 4.5,
    avatar: profileImage,
    Profession: "Student | University of Education",
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    name: "John Doe",
    rating: 4,
    avatar: profileImage,
    Profession: "Student | University of Education",
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni voluptatem repellendus necessitatibus natus atque nam eos quis minima veritatis earum sunt fugiat.",
  },
  {
    name: "John Doe",
    rating: 5,
    avatar: profileImage,
    Profession: "Student | University of Education",
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni voluptatem repellendus necessitatibus natus atque nam eos quis minima veritatis earum sunt fugiat.",
  },
];

const Reviews = (props: Props) => {
  return (
    <div className="w-[90%] 800px:w-[85%] m-auto">
      <div className="w-full 800px:flex items-center">
        <div className="800px:w-[50%] w-full">
          <Image src={businessImage} width={800} height={800} alt="business" />
        </div>

        <div className="800px:w-[50%] w-full">
          <h3 className={`${styles.title} 800px:!text-[40px]`}>
            Our Students are <span className="text-gradient"> Our Strength</span>
            <br />
            See What They Say About Us
          </h3>
          <br />
          <p className={styles.label}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minus,
            saepe. Totam libero nesciunt quas labore fuga voluptatem ipsa
            provident officia hic, quasi vel numquam, similique illo.
          </p>
        </div>
        <br />
        <br />
      </div>
      <div className="grid grid-cols-1 gap-[25px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-2 xl:gap-[35px] mb-12 border-0">
        {reviews.map((item, index) => (
          <ReviewCard item={item} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Reviews;
