"use client";
import { useSelector } from "react-redux";

export default function userAuth() {
  const { user } = useSelector((state: any) => state.auth);
  return !!user;
}
