import { styles } from "@/app/styles/style";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import Loader from "../../Loader/Loader";
import { useEditLayoutMutation, useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";

type Props = {};

const EditCategories = (props: Props) => {
  const [categories, setCategories] = useState<any[]>([]);
  
  const { data, isLoading, refetch } = useGetHeroDataQuery("Category", {  // FIXED: Use "Category" instead of "Categories"
    refetchOnMountOrArgChange: true,
  });

  const [editLayout, { isSuccess: layoutSuccess, error }] = useEditLayoutMutation();

  useEffect(() => {
    if (data?.layout?.categories) {
      setCategories(data.layout.categories);
    }

    if (layoutSuccess) {
      refetch();
      toast.success("Categories updated successfully");
    }

    if (error && "data" in error) {
      toast.error((error as any).data.message);
    }
  }, [data, error, layoutSuccess, refetch]);

  const handleCategoryChange = (id: string, value: string) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category._id === id ? { ...category, title: value } : category
      )
    );
  };

  const newCategoryHandler = () => {
    if (categories.some((c) => c.title.trim() === "")) {
      toast.error("Please enter a title before adding a new category");
      return;
    }

    setCategories((prevCategories) => [
      ...prevCategories,
      { _id: Math.random().toString(), title: "" },
    ]);
  };

  const editCategoriesHandler = async () => {
    if (categories.some((c) => c.title.trim() === "")) {
      toast.error("Category title cannot be empty");
      return;
    }

    const payload = {
      type: "Category",  // FIXED: Use "Category"
      categories: categories.map((cat) => ({
        _id: cat._id || null,
        title: cat.title,
      })),
    };

    await editLayout(payload);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-[120px] text-center">
          <h1 className={`${styles.title}`}>All Categories</h1>
          {categories.map((item) => (
            <div className="p-3" key={item._id}>
              <div className="flex items-center w-full justify-center">
                <input
                  className={`${styles.input} !w-[unset] !border-none !text-[20px]`}
                  value={item.title}
                  onChange={(e) => handleCategoryChange(item._id, e.target.value)}
                  placeholder="Enter category title..."
                />
                <AiOutlineDelete
                  className="dark:text-white text-black text-[18px] cursor-pointer"
                  onClick={() =>
                    setCategories((prevCategories) =>
                      prevCategories.filter((i) => i._id !== item._id)
                    )
                  }
                />
              </div>
            </div>
          ))}
          <br />
          <div className="w-full flex justify-center">
            <IoMdAddCircleOutline
              className="dark:text-white text-black text-[25px] cursor-pointer"
              onClick={newCategoryHandler}
            />
          </div>
          <button
            className={`${styles.button} !w-[100px] !min-h-[40px] !h-[40px] ${
              categories.length === 0 || categories.some((c) => c.title.trim() === "")
                ? "!cursor-not-allowed"
                : "!cursor-pointer !bg-[#42d383]"
            } !rounded absolute bottom-12 right-12`}
            onClick={editCategoriesHandler}
          >
            Save
          </button>
        </div>
      )}
    </>
  );
};

export default EditCategories;
