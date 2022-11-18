import { Transition } from "@headlessui/react";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { completeInitialAuthLoading } from "./slices/authSlice";
import { auth } from "./firebase";
import Spinner from "./components/Spinner";

const App = () => {
  const isInitialAuthLoadingCompleted = useAppSelector(
    (state) => state.auth.isInitialAuthLoadingCompleted
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!isInitialAuthLoadingCompleted) {
        dispatch(completeInitialAuthLoading());
      }

      if (user) {
        // signed in
      } else {
        // signed out
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch, isInitialAuthLoadingCompleted]);

  return (
    <>
      <Outlet />
      {createPortal(
        <Transition
          className={
            "absolute inset-0 flex items-center justify-center bg-black/25"
          }
          show={!isInitialAuthLoadingCompleted}
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Spinner className="h-8 w-8" />
        </Transition>,
        document.getElementById("portal") as HTMLElement
      )}
    </>
  );
};

export default App;
