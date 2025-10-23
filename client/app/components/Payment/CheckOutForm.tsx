"use client";
export const dynamic = "force-dynamic";

import { styles } from "@/app/styles/style";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useCreateOrderMutation } from "@/redux/features/orders/orderApi";
import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import socketIO from "socket.io-client";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] })

type Props = {
  setOpen: any;
  data: any;
  user: any;
};

const CheckOutForm = ({ setOpen, data, user }: Props) => {
  const stripe = useStripe();
  const router = useRouter();
  const elements = useElements();
  const [message, setMessage] = useState<any>("");
  const [loadUser, setLoadUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createOrder, { data: orderData, error }] = useCreateOrderMutation();
  const { } = useLoadUserQuery({ skip: loadUser ? false : true });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    if (error) {
      setMessage(error.message);
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setIsLoading(false);
      createOrder({ courseId: data._id, payment_info: paymentIntent });
    }
  };

  useEffect(() => {
    if (orderData) {
      setLoadUser(true);
      if (socketId) {
        socketId.emit("notification", {
          title: `New Order Received`,
          message: `You have a new order in ${data.name}`,
          userId: user._id,
        });
      }
      router.push(`/course-access/${data._id}`);
    }
    if (error && "data" in error) {
      const errorMessage = error as any;
      toast.error(errorMessage.data.message);
    }
    return () => {
      if (socketId) {
        socketId.disconnect();
      }
    };
  }, [data, error, orderData, user]);

  return (
    <div className="max-h-[500px] overflow-y-auto p-2">
      <form id="payment-form" onSubmit={handleSubmit} className="flex flex-col gap-3">
        <LinkAuthenticationElement id="link-authentication-element" />
        <PaymentElement id="payment-element" />
        <div className="mt-4 sticky bottom-0 bg-white dark:bg-gray-900 py-2">
          <button
            disabled={isLoading || !stripe || !elements}
            id="submit"
            className={`${styles.button} mt-2 !h-[40px] w-full`}
          >
            {isLoading ? "Paying..." : "Pay Now"}
          </button>
        </div>

        {message && (
          <div id="payment-message" className="text-[red] font-Poppins pt-2">
            {message}
          </div>
        )}
      </form>
    </div>
  );

};

export default CheckOutForm;