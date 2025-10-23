"use client";
export const dynamic = "force-dynamic";


import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utilis/CoursePlayer";
import Ratings from "@/app/utilis/Ratings";
import {
  useAddAnswerInQuestionMutation,
  useAddNewQuestionMutation,
  useAddReplyToReviewMutation,
  useAddReviewInCourseMutation,
  useGetCourseDetailsQuery,
} from "@/redux/features/courses/coursesApi";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { AiFillStar, AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineStar } from "react-icons/ai";
import { BiMessage } from "react-icons/bi";
import { VscVerifiedFilled } from "react-icons/vsc";
import socketIO from "socket.io-client";
import { format } from "timeago.js";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";

type Props = {
  data: any[] | undefined; // array of content items
  id: string;
  activeVideo: number;
  setActiveVideo: (activeVideo: number) => void;
  user?: any;
  refetch?: () => void;
};

const CourseContentMedia = ({
  data,
  id,
  activeVideo,
  setActiveVideo,
  user,
  refetch,
}: Props) => {
  // Early guard: don't render if there's no content yet
  if (!data || !Array.isArray(data) || data.length === 0 || typeof activeVideo !== "number") {
    return <p className="text-center text-gray-400">No content available</p>;
  }

  // ensure activeVideo is in bounds
  const safeActiveVideo = Math.min(Math.max(0, activeVideo), data.length - 1);

  const [activeBar, setactiveBar] = useState(0);
  const [question, setQuestion] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(1);
  const [answer, setAnswer] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [reply, setReply] = useState("");
  const [reviewId, setReviewId] = useState("");
  const [isReviewReply, setIsReviewReply] = useState(false);

  // socket ref to persist instance across renders
  const socketRef = useRef<any | null>(null);

  // API hooks
  const [addNewQuestion, { isSuccess, error, isLoading: questionCreationLoading }] = useAddNewQuestionMutation();
  const { data: courseData, refetch: courseRefetch } = useGetCourseDetailsQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  const [addAnswerInQuestion, { isSuccess: answerSuccess, error: answerError, isLoading: answerCreationLoading }] =
    useAddAnswerInQuestionMutation();

  const course = courseData?.course;

  const [addReviewInCourse, { isSuccess: reviewSuccess, error: reviewError, isLoading: reviewCreationLoading }] =
    useAddReviewInCourseMutation();

  const [addReplyInReview, { isSuccess: replySuccess, error: replyError, isLoading: replyCreationLoading }] =
    useAddReplyToReviewMutation();

  // whether current user already left a review
  const isReviewExists = Boolean(course?.reviews?.find((item: any) => item?.user?._id === user?._id));

  // set up socket on client only, and cleanup on unmount
  useEffect(() => {
    if (typeof window === "undefined") return;

    // create socket only once
    if (!socketRef.current) {
      try {
        socketRef.current = socketIO(ENDPOINT, { transports: ["websocket"] });
      } catch (err) {
        // ignore socket init errors in dev if endpoint not set
        socketRef.current = null;
        // console.warn("Socket init failed:", err);
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
    // we intentionally do not add socketRef to deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handle side effects for API results and errors
  useEffect(() => {
    // helper to emit notification (safe)
    const emitNotification = (payload: any) => {
      if (socketRef.current && typeof socketRef.current.emit === "function") {
        socketRef.current.emit("notification", payload);
      }
    };

    if (isSuccess) {
      setQuestion("");
      refetch?.();
      // safe data access
      const title = data?.[safeActiveVideo]?.title ?? "new content";
      emitNotification({
        title: `New Question Received`,
        message: `You have a new question in ${title}`,
        userId: user?._id,
      });
    }

    if (answerSuccess) {
      setAnswer("");
      refetch?.();
      if (user?.role !== "admin") {
        const title = data?.[safeActiveVideo]?.title ?? "new content";
        emitNotification({
          title: `New Reply Received`,
          message: `You have a new reply in ${title}`,
          userId: user?._id,
        });
      }
    }

    if (error && "data" in (error as any)) {
      const errorMessage = error as any;
      toast.error(errorMessage.data?.message || "Something went wrong");
    }

    if (answerError && "data" in (answerError as any)) {
      const errorMessage = answerError as any;
      toast.error(errorMessage.data?.message || "Error creating answer");
    }

    if (reviewSuccess) {
      setReview("");
      setRating(1);
      courseRefetch?.();
      toast.success("Review added");
    }

    if (reviewError && "data" in (reviewError as any)) {
      const err = reviewError as any;
      toast.error(err.data?.message || "Error adding review");
    }

    if (replySuccess) {
      setReply("");
      courseRefetch?.();
      toast.success("Reply added");
    }

    if (replyError && "data" in (replyError as any)) {
      const err = replyError as any;
      toast.error(err.data?.message || "Error adding reply");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isSuccess,
    error,
    answerSuccess,
    answerError,
    reviewSuccess,
    reviewError,
    replySuccess,
    replyError,
    refetch,
    safeActiveVideo,
    data,
    user?.role,
    user?._id,
    courseRefetch,
  ]);

  const handleQuestion = () => {
    if (!question || question.trim().length === 0) {
      toast.error("Question can't be empty");
      return;
    }
    const contentId = data?.[safeActiveVideo]?._id;
    if (!contentId) {
      toast.error("Unable to find content id");
      return;
    }
    addNewQuestion({
      question: question.trim(),
      courseId: id,
      contentId,
    });
  };

  const handleAnswerSubmit = () => {
    const contentId = data?.[safeActiveVideo]?._id;
    if (!contentId || !questionId) {
      toast.error("Missing content/question id");
      return;
    }
    if (!answer || answer.trim().length === 0) {
      toast.error("Answer can't be empty");
      return;
    }
    addAnswerInQuestion({
      answer: answer.trim(),
      courseId: id,
      contentId,
      questionId,
    });
  };

  const handleReviewSubmit = async () => {
    if (!review || review.trim().length === 0) {
      toast.error("Review can't be empty");
      return;
    }
    addReviewInCourse({ review: review.trim(), rating, courseId: id });
  };

  const handleReviewReplySubmit = () => {
    if (replyCreationLoading) return;
    if (!reply || reply.trim().length === 0) {
      toast.error("Reply can't be empty");
      return;
    }
    if (!reviewId) {
      toast.error("Missing review id");
      return;
    }
    addReplyInReview({ comment: reply.trim(), courseId: id, reviewId });
  };

  // rendering uses safe accessors
  const current = data?.[safeActiveVideo];

  return (
    <div className="w-[95%] 800px:w-[86%] py-4 m-auto">
      <CoursePlayer title={current?.title} videoUrl={current?.videoUrl} />

      <div className="w-full flex items-center justify-between my-3">
        <div
          className={`${styles.button} text-white !w-[unset] !min-h-[40px] !py-[unset] ${safeActiveVideo === 0 ? "!cursor-no-drop opacity-[.8]" : ""
            }`}
          onClick={() => setActiveVideo(safeActiveVideo === 0 ? 0 : safeActiveVideo - 1)}
        >
          <AiOutlineArrowLeft className="mr-2" />
          Prev Lesson
        </div>

        <div
          className={`${styles.button} !w-[unset] text-white !min-h-[40px] !py-[unset] ${data && data.length - 1 === safeActiveVideo ? "!cursor-no-drop opacity-[.8]" : ""
            }`}
          onClick={() =>
            setActiveVideo(data && data.length - 1 === safeActiveVideo ? safeActiveVideo : safeActiveVideo + 1)
          }
        >
          Next Lesson
          <AiOutlineArrowRight className="ml-2" />
        </div>
      </div>

      <h1 className="pt-2 text-[25px] font-[600] dark:text-white text-black ">
        {current?.title ?? "Untitled lesson"}
      </h1>

      <br />

      <div className="w-full p-4 flex items-center justify-between bg-slate-500 bg-opacity-20 backdrop-blur rounded shadow-inner">
        {["Overview", "Resources", "Q&A", "Reviews"].map((text, index) => (
          <h5
            key={text}
            className={`800px:text-[20px] cursor-pointer ${activeBar === index ? "text-red-500" : "dark:text-white text-black"}`}
            onClick={() => setactiveBar(index)}
          >
            {text}
          </h5>
        ))}
      </div>

      <br />

      {activeBar === 0 && (
        <p className="text-[18px] whitespace-pre-line mb-3 dark:text-white text-black">
          {current?.description ?? "No description available"}
        </p>
      )}

      {activeBar === 1 && (
        <div>
          {current?.links?.map((item: any, index: number) => (
            <div className="mb-5" key={index}>
              <h2 className="800px:text-[20px] 800px:inline-block dark:text-white text-black">{item.title ? `${item.title} :` : ""}</h2>
              <a className="inline-block text-[#4395c4] 800px:text-[20px] 800px:pl-2" href={item.url}>
                {item.url}
              </a>
            </div>
          )) ?? <p className="text-gray-500">No resources</p>}
        </div>
      )}

      {activeBar === 2 && (
        <>
          <div className="flex w-full">
            <Image
              src={user?.avatar?.url ?? "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"}
              width={50}
              height={50}
              alt="avatar"
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              cols={40}
              rows={5}
              placeholder="Write your question..."
              className="outline-none bg-transparent ml-3 border dark:text-white text-black border-[#0000001d] dark:border-[#ffffff57] 800px:w-full p-2 rounded w-[90%] 800px:text-[18px] font-Poppins"
            />
          </div>

          <div className="w-full flex justify-end">
            <div
              className={`${styles.button} !w-[120px] !h-[40px] text-[18px] mt-5 ${questionCreationLoading ? "cursor-not-allowed" : ""}`}
              onClick={questionCreationLoading ? () => { } : handleQuestion}
            >
              Submit
            </div>
          </div>

          <br />
          <div className="w-full h-[1px] bg-[#ffffff3b]" />
          <div>
            <CommentReply
              data={data}
              activeVideo={safeActiveVideo}
              answer={answer}
              setAnswer={setAnswer}
              handleAnswerSubmit={handleAnswerSubmit}
              questionId={questionId}
              setQuestionId={setQuestionId}
              answerCreationLoading={answerCreationLoading}
            />
          </div>
        </>
      )}

      {activeBar === 3 && (
        <div className="w-full">
          {!isReviewExists && (
            <>
              <div className="flex w-full">
                <Image
                  src={user?.avatar?.url ?? "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"}
                  width={50}
                  height={50}
                  alt="avatar"
                  className="w-[50px] h-[50px] rounded-full object-cover"
                />
                <div className="w-full">
                  <h5 className="pl-3 text-[20px] font-[500] dark:text-white text-black ">
                    Give a Rating <span className="text-red-500">*</span>
                  </h5>
                  <div className="flex w-full ml-2 pb-3">
                    {[1, 2, 3, 4, 5].map((i) =>
                      rating >= i ? (
                        <AiFillStar key={i} className="mr-1 cursor-pointer" size={25} onClick={() => setRating(i)} />
                      ) : (
                        <AiOutlineStar key={i} className="mr-1 cursor-pointer" size={25} onClick={() => setRating(i)} />
                      )
                    )}
                  </div>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    cols={40}
                    rows={5}
                    placeholder="Write your comment..."
                    className="outline-none bg-transparent 800px:ml-3 dark:text-white text-black border border-[#00000027] dark:border-[#ffffff57] w-[95%] 800px:w-full p-2 rounded text-[18px] font-Poppins"
                  />
                </div>
              </div>

              <div className="w-full flex justify-end">
                <div
                  className={`${styles.button} !w-[120px] !h-[40px] text-[18px] mt-5 800px:mr-0 mr-2 ${reviewCreationLoading ? "cursor-no-drop" : ""}`}
                  onClick={reviewCreationLoading ? () => { } : handleReviewSubmit}
                >
                  Submit
                </div>
              </div>
            </>
          )}

          <br />
          <div className="w-full h-[1px] bg-[#ffffff3b]" />
          <div className="w-full">
            {(course?.reviews ? [...course.reviews].reverse() : []).map((item: any) => (
              <div className="w-full my-5 dark:text-white text-black" key={item._id ?? Math.random()}>
                <div className="w-full flex">
                  <div>
                    <Image
                      src={item?.user?.avatar?.url ?? "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"}
                      width={50}
                      height={50}
                      alt="avatar"
                      className="w-[50px] h-[50px] rounded-full object-cover"
                    />
                  </div>

                  <div className="ml-2">
                    <h1 className="text-[18px]">{item?.user?.name ?? "Unknown"}</h1>
                    <Ratings rating={item?.rating ?? 0} />
                    <p>{item?.comment}</p>
                    <small className="text-[#0000009e] dark:text-[#ffffff83]">{item?.createdAt ? format(item.createdAt) : ""} •</small>
                  </div>
                </div>

                {user?.role === "admin" && Array.isArray(item?.commentReplies) && item.commentReplies.length === 0 && (
                  <span
                    className={`${styles.label} !ml-10 cursor-pointer`}
                    onClick={() => {
                      setIsReviewReply(true);
                      setReviewId(item._id);
                    }}
                  >
                    Add Reply
                  </span>
                )}

                {isReviewReply && reviewId === item._id && (
                  <div className="w-full flex relative">
                    <input
                      type="text"
                      placeholder="Enter your reply..."
                      value={reply}
                      onChange={(e: any) => setReply(e.target.value)}
                      className="block 800px:ml-12 mt-2 outline-none bg-transparent border-b border-[#000] dark:border-[#fff] p-[5px] w-[95%]"
                    />
                    <button type="submit" className="absolute right-0 bottom-1" onClick={handleReviewReplySubmit}>
                      Submit
                    </button>
                  </div>
                )}

                {(item?.commentReplies ?? []).map((i: any) => (
                  <div className="w-full flex 800px:ml-16 my-5" key={i._id ?? Math.random()}>
                    <div className="w-[50px] h-[50px]">
                      <Image
                        src={i?.user?.avatar?.url ?? "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"}
                        width={50}
                        height={50}
                        alt="avatar"
                        className="w-[50px] h-[50px] rounded-full object-cover"
                      />
                    </div>
                    <div className="pl-2">
                      <div className="flex items-center">
                        <h5 className="text-[20px]">{i?.user?.name ?? "Unknown"}</h5>{" "}
                        <VscVerifiedFilled className="text-[#0095F6] ml-2 text-[20px]" />
                      </div>
                      <p>{i?.comment}</p>
                      <small className="text-[#ffffff83]">{i?.createdAt ? format(i.createdAt) : ""} •</small>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CommentReply = ({
  data,
  activeVideo,
  answer,
  setAnswer,
  handleAnswerSubmit,
  questionId,
  setQuestionId,
  answerCreationLoading,
}: any) => {
  const current = data?.[activeVideo];
  if (!current) return null;
  const questions = Array.isArray(current.questions) ? current.questions : [];
  return (
    <div className="w-full my-3">
      {questions.map((item: any, index: number) => (
        <CommentItem
          key={item._id ?? index}
          data={data}
          activeVideo={activeVideo}
          item={item}
          index={index}
          answer={answer}
          setAnswer={setAnswer}
          questionId={questionId}
          setQuestionId={setQuestionId}
          handleAnswerSubmit={handleAnswerSubmit}
          answerCreationLoading={answerCreationLoading}
        />
      ))}
    </div>
  );
};

const CommentItem = ({
  questionId,
  setQuestionId,
  item,
  answer,
  setAnswer,
  handleAnswerSubmit,
  answerCreationLoading,
}: any) => {
  const [replyActive, setreplyActive] = useState(false);
  const replies = Array.isArray(item?.questionReplies) ? item.questionReplies : [];

  return (
    <div className="my-4">
      <div className="flex mb-2">
        <div>
          <Image
            src={item?.user?.avatar?.url ?? "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"}
            width={50}
            height={50}
            alt="avatar"
            className="w-[50px] h-[50px] rounded-full object-cover"
          />
        </div>
        <div className="pl-3 dark:text-white text-black">
          <h5 className="text-[20px]">{item?.user?.name ?? "Unknown"}</h5>
          <p>{item?.question}</p>
          <small className="text-[#000000b8] dark:text-[#ffffff83]">{item?.createdAt ? format(item.createdAt) : ""} •</small>
        </div>
      </div>

      <div className="w-full flex">
        <span
          className="800px:pl-16 text-[#000000b8] dark:text-[#ffffff83] cursor-pointer mr-2"
          onClick={() => {
            setreplyActive(!replyActive);
            setQuestionId(item?._id);
          }}
        >
          {!replyActive ? (replies.length !== 0 ? "All Replies" : "Add Reply") : "Hide Replies"}
        </span>

        <BiMessage size={20} className="dark:text-[#ffffff83] cursor-pointer text-[#000000b8]" />
        <span className="pl-1 mt-[-4px] cursor-pointer text-[#000000b8] dark:text-[#ffffff83]">{replies.length}</span>
      </div>

      {replyActive && questionId === item?._id && (
        <>
          {replies.map((r: any) => (
            <div className="w-full flex 800px:ml-16 my-5 text-black dark:text-white" key={r._id ?? Math.random()}>
              <div>
                <Image
                  src={r?.user?.avatar?.url ?? "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"}
                  width={50}
                  height={50}
                  alt="avatar"
                  className="w-[50px] h-[50px] rounded-full object-cover"
                />
              </div>
              <div className="pl-3">
                <div className="flex items-center">
                  <h5 className="text-[20px]">{r?.user?.name ?? "Unknown"}</h5>{" "}
                  {r?.user?.role === "admin" && <VscVerifiedFilled className="text-[#0095F6] ml-2 text-[20px]" />}
                </div>
                <p>{r?.answer}</p>
                <small className="text-[#ffffff83]">{r?.createdAt ? format(r.createdAt) : ""} •</small>
              </div>
            </div>
          ))}

          <div className="w-full flex relative dark:text-white text-black">
            <input
              type="text"
              placeholder="Enter your answer..."
              value={answer}
              onChange={(e: any) => setAnswer(e.target.value)}
              className={`block 800px:ml-12 mt-2 outline-none bg-transparent border-b border-[#00000027] dark:text-white text-black dark:border-[#fff] p-[5px] w-[95%] ${answer === "" || (answerCreationLoading && "cursor-not-allowed")
                }`}
            />
            <button
              type="submit"
              className="absolute right-0 bottom-1"
              onClick={handleAnswerSubmit}
              disabled={answer === "" || answerCreationLoading}
            >
              Submit
            </button>
          </div>

          <br />
        </>
      )}
    </div>
  );
};

export default CourseContentMedia;
