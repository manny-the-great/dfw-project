import React, { useState, useEffect } from 'react';
import { logo, facebook, google, xImg } from '../common/common-assets/assets-images'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { get_service_list } from "../utils/thunkApis";
import { getLocalStorageData } from '../utils/local-storage';
const Footer = () => {
	const navigate = useNavigate();
	const cmsData = useSelector((state) => state.users.dashboardContent);
	const footerDescription = cmsData?.cmsData?.find(item => item.type === 8);

	const serviceList = useSelector((state) => state.users.serviceList);

	const dispatch = useDispatch();
	const [isLoader, setIsLoader] = useState(false);

	const fetchData = async () => {
		setIsLoader(true);
		try {
			await dispatch(get_service_list());
		} catch (error) {
			// console.log("Error fetching terms&conditions:", error);
		} finally {
			setIsLoader(false);
		}
	};
	useEffect(() => {
		fetchData();
	}, [dispatch]);

	const handleSelectService = (selectedService) => {
		const userDetails = getLocalStorageData('userData')
		if (!userDetails || userDetails?.otp_verified != 1) {
			navigate(`/login`, { state: { serviceId: selectedService } })
		} else {
			navigate(`/location-errands?serviceId=${selectedService}`)
		}
	}
	return (
		<div className="relative w-full bg-black ">
			<div className="container mx-auto">
				<div className="relative z-10 text-white  py-10  md:flex flex-wrap justify-between">
					<div className="md:w-1/2 flex flex-wrap w-full">
						<div className="w-full xl:w-[70%] px-4">
							<img
								src={logo}
								alt="logo"
								className="w-[132px] mb-5"
							/>
							<div className="space-y-5 leading-relaxed">
								<div className="text-[14px] w-[80%][&_h1]:text-3xl [&_h2]:text-2xl [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1" dangerouslySetInnerHTML={{ __html: footerDescription?.description }}>
								</div>
							</div>
						</div>

						<div className="w-full xl:w-[30%] px-4">
							<h3 className="font-semibold mb-5 lg:mt-10 mt-5 xl:mt-5 text-[20px]">
								Information
							</h3>
							<ul className="space-y-5 text-[14px] ">
								<li className="cursor-pointer" onClick={() => navigate("/about")}>About Us</li>
								
								<li className="cursor-pointer" onClick={() => navigate("/privacy")}>Privacy Policy</li>
								<li className="cursor-pointer" onClick={() => navigate("/terms")}>Terms & Conditions</li>
							</ul>
						</div>
					</div>

					<div className="md:w-1/2 flex flex-wrap w-full">
						<div className="w-full  xl:w-1/2 px-4">
							<h3 className="font-semibold  text-[20px] mt-5 mb-5">
								Other Services
							</h3>
							<ul className="space-y-5 text-[14px]">
								{serviceList && serviceList?.length > 0 ? serviceList.slice(0, 4)?.map((service) => (
									<li key={service.id} className="cursor-pointer" onClick={() => handleSelectService(service?.id)}>{service?.name}</li>
								))
									:
									!isLoader && serviceList?.length <= 0 &&
									<li>No Services Available</li>
								}
							</ul>
						</div>
						<div className="w-full  xl:w-1/2 px-4">
							<h3 className="font-semibold text-[20px] mt-5 mb-5">
								Follow Us
							</h3>
							<div className="space-y-5 lg:col-span-1">
								<div className="flex items-center gap-1 mt-3">
									<img src={facebook} className="w-[38px]" alt="" />
									<img src={xImg} className="w-[38px]" alt="" />
									<img src={google} className="w-[38px]" alt="" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Footer;
