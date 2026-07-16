import React, { useState, useEffect, lazy, Suspense } from 'react';
import {
  WelcomeSkeleton,
  WorksSkeleton,
  RatingSkeleton,
  TotalSkeleton,
  ContactSkeleton,
} from "../components/SkeletonLoader";
import Banner from './Banner'
const Welcome = lazy(() => import('../components/Welcome'));
const Works = lazy(() => import('../components/Works'));
const Raiting = lazy(() => import('../components/Raiting'));
const Total = lazy(() => import('../components/Total'));
const Contact = lazy(() => import('../components/contact'));
import { useSelector, useDispatch } from "react-redux";
import { get_cms } from '../utils/thunkApis';
import { CustomLoader } from "../utils/react-loader/loader";
import { getLocalStorageData, clearLocalStorage } from '../utils/local-storage';
import { toast } from 'react-hot-toast'

const Index = () => {
  const aboutUs = useSelector((state) => state.users.cms);
  const dashboardContent = useSelector((state) => state.users.dashboardContent);
  const serviceList = useSelector((state) => state.users.serviceList);

  const dispatch = useDispatch();
  const [isLoader, setIsLoader] = useState(false);
  const type = 0;

  useEffect(() => {
    const loginMsg = getLocalStorageData("login");
    const logoutMsg = getLocalStorageData("logout");
    const signupMsg = getLocalStorageData("signup");

    if (loginMsg) {
      toast.success("Login successfully");
      clearLocalStorage("login");
    }
    if (logoutMsg) {
      toast.success("Logout successfully");
      clearLocalStorage("logout");
    }
    if (signupMsg) {
      toast.success("Signup successfully");
      clearLocalStorage("signup");
    }
  }, []);


  const fetchData = async () => {
    setIsLoader(true);
    try {
      await dispatch(get_cms(type));
    } catch (error) {
      // console.log("Error fetching terms&conditions:", error);
    } finally {
      setIsLoader(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [dispatch]);
  return (
    <div>

      {isLoader &&
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <CustomLoader />
        </div>
      }
      <Banner aboutUs={aboutUs} serviceList={serviceList} />
      <Suspense fallback={<WelcomeSkeleton />}>
        <Welcome dashboardContent={dashboardContent} />
      </Suspense>

      <Suspense fallback={<WorksSkeleton />}>
        <Works dashboardContent={dashboardContent} />
      </Suspense>
      <Suspense fallback={<RatingSkeleton />}>
        <Raiting dashboardContent={dashboardContent} />
      </Suspense>

      <Suspense fallback={<TotalSkeleton />}>
        <Total dashboardContent={dashboardContent} />
      </Suspense>

      <Suspense fallback={<ContactSkeleton />}>
        <Contact />
      </Suspense>

    </div>
  )
}

export default Index

