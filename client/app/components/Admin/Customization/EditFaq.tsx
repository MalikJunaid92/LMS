import { styles } from "@/app/styles/style";
import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { HiMinus, HiPlus } from "react-icons/hi";
import { IoMdAddCircleOutline } from "react-icons/io";
import Loader from "../../Loader/Loader";

type Props = {};

const EditFaq = (props: Props) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const { data, isLoading, refetch } = useGetHeroDataQuery("FAQ", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isSuccess, error }] = useEditLayoutMutation();

  useEffect(() => {
    console.log("Fetched Data:", data); // Debugging log to check the API response

    if (data?.layout?.faq && Array.isArray(data.layout.faq)) {
      setQuestions(data.layout.faq);
    }

    if (isSuccess) {
      refetch();
      toast.success("FAQ updated successfully!");
    }

    if (error && "data" in error) {
      const errorData = error as any;
      toast.error(errorData?.data?.message || "Something went wrong!");
    }
  }, [data, error, isSuccess, refetch]);

  const toggleQuestion = (id: any) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q._id === id ? { ...q, active: !q.active } : q))
    );
  };

  const handleQuestionChange = (id: any, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q._id === id ? { ...q, question: value } : q))
    );
  };

  const handleAnswerChange = (id: any, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q._id === id ? { ...q, answer: value } : q))
    );
  };

  const newFaqHandler = () => {
    setQuestions([
      ...questions,
      {
        _id: Math.random().toString(), // Temporary ID for new items
        question: "",
        answer: "",
        active: false,
      },
    ]);
  };

  const areQuestionsUnchanged = (originalQuestions: any[], newQuestions: any[]) => {
    return JSON.stringify(originalQuestions) === JSON.stringify(newQuestions);
  };

  const isAnyQuestionEmpty = (questions: any[]) => {
    return questions.some((q) => !q.question.trim() || !q.answer.trim());
  };

  const handleEdit = async () => {
    if (!questions.length) {
      toast.error("No FAQ data available!");
      return;
    }

    if (!areQuestionsUnchanged(data?.layout?.faq || [], questions) && !isAnyQuestionEmpty(questions)) {
      try {
        await editLayout({
          type: "FAQ",
          faq: questions,
        }).unwrap();
        toast.success("FAQ updated successfully!");
      } catch (err) {
        toast.error((err as any)?.data?.message || "Failed to update FAQ!");
      }
    } else {
      toast.error("No changes detected or some fields are empty!");
    }
  };

  return (
   <>
   {
    isLoading ? (
        <Loader/>
    ):(
        <div className="w-[90%] 800px:w-[80%] m-auto mt-[120px]">
        <div className="mt-12">
          <dl className="space-y-8">
            {questions?.map((q: any) => (
              <div key={q._id} className={`${q._id !== questions[0]?._id && "border-t"} border-gray-200 pt-6`}>
                <dt className="text-lg">
                  <button
                    className="flex items-start dark:text-white text-black justify-between w-full text-left focus:outline-none"
                    onClick={() => toggleQuestion(q._id)}
                  >
                    <input
                      className={`${styles.input} border-none`}
                      value={q.question}
                      onChange={(e) => handleQuestionChange(q._id, e.target.value)}
                      placeholder={"Add your question..."}
                    />
                    <span className="ml-6 flex-shrink-0">{q.active ? <HiMinus className="h-6 w-6" /> : <HiPlus className="h-6 w-6" />}</span>
                  </button>
                </dt>
                {q.active && (
                  <dd className="mt-2 pr-12">
                    <input
                      className={`${styles.input} border-none`}
                      value={q.answer}
                      onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                      placeholder={"Add your answer..."}
                    />
                    <span className="ml-6 flex-shrink-0">
                      <AiOutlineDelete
                        className="dark:text-white text-black text-[18px] cursor-pointer"
                        onClick={() => {
                          setQuestions((prevQuestions) => prevQuestions.filter((item) => item._id !== q._id));
                        }}
                      />
                    </span>
                  </dd>
                )}
              </div>
            ))}
          </dl>
          <br />
          <br />
          <IoMdAddCircleOutline className="dark:text-white text-black text-[25px] cursor-pointer" onClick={newFaqHandler} />
        </div>
        <div
          className={`${
            styles.button
          } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34] 
                ${
                  areQuestionsUnchanged(data?.layout?.faq || [], questions) || isAnyQuestionEmpty(questions)
                    ? "!cursor-not-allowed"
                    : "!cursor-pointer !bg-[#42d383]"
                }
                !rounded fixed bottom-12 right-12`}
          onClick={
            areQuestionsUnchanged(data?.layout?.faq || [], questions) || isAnyQuestionEmpty(questions)
              ? () => null
              : handleEdit
          }
        >
          Save
        </div>
      </div>
    )
   }
   </>
  );
};

export default EditFaq;
