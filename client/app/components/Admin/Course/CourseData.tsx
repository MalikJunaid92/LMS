import { styles } from "@/app/styles/style";
import { AddCircle } from "@mui/icons-material";
import { FC } from "react";
import toast from "react-hot-toast";

type Props = {
  benefits: { title: string }[];
  setBenefits: (benefits: { title: string }[]) => void;
  prerequisites: { title: string }[];
  setPrerequisites: (prerequisites: { title: string }[]) => void;
  active: number;
  setActive: (active: number) => void;
};

const CourseData: FC<Props> = ({
  benefits = [],
  setBenefits,
  prerequisites = [],
  setPrerequisites,
  active,
  setActive,
}) => {
  const handleAddBenefit = () => {
    setBenefits([...benefits, { title: "" }]);
  };

  const handleAddPrerequisites = () => {
    setPrerequisites([...prerequisites, { title: "" }]);
  };

  const prevButton = () => {
    setActive(active - 1);
  };

  const handleOptions = () => {
    if (
      benefits.length > 0 &&
      prerequisites.length > 0 &&
      benefits[benefits.length - 1]?.title.trim() !== "" &&
      prerequisites[prerequisites.length - 1]?.title.trim() !== ""
    ) {
      setActive(active + 1);
    } else {
      toast.error("Please fill all fields");
    }
  };

  return (
    <div className="w-[80%] m-auto mt-24 block">
      <div>
        <label htmlFor="benefits" className={styles.label}>
          What are the benefits for students?
        </label>
        <br />
        {benefits.map((benefit, index) => (
          <div key={index}>
            <input
              type="text"
              required
              name="benefits"
              value={benefit.title}
              placeholder="You will be able to create a full stack application"
              className={`${styles.input} my-2`}
              onChange={(e) => {
                const updatedBenefits = [...benefits];
                updatedBenefits[index] = { ...benefit, title: e.target.value };
                setBenefits(updatedBenefits);
              }}
            />
          </div>
        ))}
        <AddCircle
          style={{ margin: "10px 0px", cursor: "pointer", width: "30px" }}
          onClick={handleAddBenefit}
        />
      </div>

      <div>
        <label htmlFor="prerequisites" className={styles.label}>
          What are the prerequisites for this course?
        </label>
        <br />
        {prerequisites.map((prerequisite, index) => (
          <div key={index}>
            <input
              type="text"
              required
              name="prerequisites"
              value={prerequisite.title}
              placeholder="You need basic knowledge of MERN..."
              className={`${styles.input} my-2`}
              onChange={(e) => {
                const updatedPrerequisites = [...prerequisites];
                updatedPrerequisites[index] = {
                  ...prerequisite,
                  title: e.target.value,
                };
                setPrerequisites(updatedPrerequisites);
              }}
            />
          </div>
        ))}
        <AddCircle
          style={{ margin: "10px 0px", cursor: "pointer", width: "30px" }}
          onClick={handleAddPrerequisites}
        />
      </div>

      <div className="flex w-full items-center justify-between">
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-10 bg-cyan-500 text-white text-center mt-8 rounded cursor-pointer"
          onClick={prevButton}
        >
          Prev
        </div>
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-10 bg-cyan-500 text-white text-center mt-8 rounded cursor-pointer"
          onClick={handleOptions}
        >
          Next
        </div>
      </div>
    </div>
  );
};

export default CourseData;
