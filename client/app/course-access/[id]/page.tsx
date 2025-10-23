"use client";
export const dynamic = "force-dynamic";


import Loader from '@/app/components/Loader/Loader';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import React from 'react';
import CourseContent from "../../components/Course/CourseContent";

type Props = {
    params: Promise<{ id: string }>;
};

const Page = ({ params }: Props) => {
    // ✅ unwrap the params promise
    const resolvedParams = React.use(params);
    const id = resolvedParams.id;

    const { isLoading, error, data } = useLoadUserQuery(undefined, {});
    const router = useRouter();

    useEffect(() => {
        if (!data) return;

        const isPurchased = data.user?.courses?.find((item: any) => item._id === id);

        if (!isPurchased || error) {
            router.push('/');
        }
    }, [data, error, id, router]);

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div>
                    <CourseContent id={id} />
                </div>
            )}
        </>
    );
};

export default Page;
