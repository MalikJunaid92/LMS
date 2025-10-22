import CourseDetailsPage from "../../components/Course/CourseDetailsPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params; // ✅ await because it's Promise-based now

  return (
    <div>
      <CourseDetailsPage id={id} />
    </div>
  );
};

export default Page;
