/* eslint-disable @next/next/no-img-element */
"use client";
export const dynamic = "force-dynamic";

import { styles } from "@/app/styles/style";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineCamera } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import Loader from "../../Loader/Loader";
import { useEditLayoutMutation, useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";

type Props = {};

const EditHero = (props: Props) => {
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const { data, refetch } = useGetHeroDataQuery("Banner", {
    refetchOnMountOrArgChange: true,
  });

  const [editLayout, { isLoading, isSuccess, error }] = useEditLayoutMutation();

  useEffect(() => {
    if (data?.layout?.banner) {
      setTitle(data.layout.banner.title || "");
      setSubtitle(data.layout.banner.subtitle || "");
      setImage(data.layout.banner.image?.url || null);
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("Hero updated successfully!");
    }
  }, [isSuccess, refetch]);

  useEffect(() => {
    if (error && "data" in error) {
      const errorData = error as any;
      toast.error(errorData?.data?.message || "An error occurred");
    }
  }, [error]);

  const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    await editLayout({
      type: "Banner",
      image: image || "",
      title,
      subtitle,
    });
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full flex flex-col items-center 1000px:flex-row">
          {/* Image Container */}
          <div className="relative flex items-center justify-center w-[50vh] h-[50vh] 1100px:w-[500px] 1100px:h-[500px] 1500px:w-[700px] 1500px:h-[700px]">
            {image && (
              <label htmlFor="banner" className="absolute top-4 right-4 z-20">
                <CiEdit className="dark:text-white text-black text-[24px] cursor-pointer" />
              </label>
            )}
            <div className="relative flex items-center justify-center w-full h-full">
              {image ? (
                <img
                  src={image}
                  alt="Hero Banner"
                  className="object-contain w-[90%] max-w-[90%] 1500px:max-w-[85%] h-auto z-10"
                />
              ) : (
                <label
                  htmlFor="banner"
                  className="absolute bottom-4 right-4 z-20 cursor-pointer"
                >
                  <AiOutlineCamera className="dark:text-white text-black text-[18px]" />
                </label>
              )}
              <input
                type="file"
                id="banner"
                accept="image/*"
                onChange={handleUpdate}
                className="hidden"
              />
            </div>
          </div>

          {/* Text & Button Container */}
          <div className="w-full 1000px:w-[60%] flex flex-col items-center 1000px:items-start mt-[50px] 1000px:mt-0 text-center 1000px:text-left">
            <textarea
              className="dark:text-white resize-none text-[#000000c7] text-[30px] px-3 w-full 1000px:text-[60px] 1500px:text-[70px] font-[600] font-Josefin py-2 1000px:leading-[75px] outline-none bg-transparent"
              placeholder="Improve Your Online Learning Experience Better Instantly"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              rows={2}
            />
            <textarea
              className="dark:text-[#edfff4] text-[#000000ac] font-Josefin font-[600] text-[18px] 1500px:w-[55%] 1100px:w-[74%] bg-transparent outline-none resize-none mt-4"
              placeholder="We have 40k+ Online courses & 500K+ Online registered student. Find your desired Courses from them."
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              rows={3}
            />
            <button
              className={`${styles.button
                } mt-6 px-6 py-2 rounded bg-gray-300 text-black ${data?.layout?.banner?.title !== title ||
                  data?.layout?.banner?.subtitle !== subtitle ||
                  data?.layout?.banner?.image?.url !== image
                  ? "cursor-pointer bg-[#42d383] hover:bg-[#36b374]"
                  : "cursor-not-allowed opacity-50"
                }`}
              onClick={
                data?.layout?.banner?.title !== title ||
                  data?.layout?.banner?.subtitle !== subtitle ||
                  data?.layout?.banner?.image?.url !== image
                  ? handleEdit
                  : undefined
              }
            >
              Save
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EditHero;
