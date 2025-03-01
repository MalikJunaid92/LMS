import CourseDetailsPage from "../../components/Course/CourseDetailsPage";

interface PageProps {
  params: { id: string };
}

const Page = async ({ params }: PageProps) => {
  const { id } = params; // Ensure params is correctly structured

  return (
    <div>
      <CourseDetailsPage id={id} />
    </div>
  );
};

export default Page;
