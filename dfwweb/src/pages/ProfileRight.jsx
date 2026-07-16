
import { profile2 } from '../common/common-assets/assets-images';
const ProfileRight = ({ userDetails }) => {
	return (
		<div className=' w-full shadow-sm border-[1px] border-[#CECECE] rounded-[18px] py-5 lg:w-[70%]'>

			<div className='w-full xl:mt-0  flex flex-col md:flex-row items-start justify-around px-0 py-2'>

				<div className='w-full md:w-[50%] px-10'>
					<p className='text-[20px] font-semibold'>My Profile</p>
					<form action="" className='flex flex-col gap-3 py-5 w-full'>
						<div className="flex flex-col gap-1 w-full">
							<label className="text-[14px] xl:text-[16px]  font-bold">
								Name
							</label>
							<input
								type="text"
								value={userDetails?.name}
								className=" text-[12px] rounded-[10px] font-normal focus:outline-none sm:text-[12px] xl:text-[14px] text-black  bg-white w-full"
								name=""
								id=""
								placeholder="Enter your Email"
								disabled />
						</div>

						<div className="flex flex-col gap-1 w-full">
							<label className="text-[14px] xl:text-[16px]  font-bold">
								Email
							</label>
							<input
								type="text"
								value={userDetails?.email}
								className=" text-[12px] rounded-[10px] font-normal focus:outline-none sm:text-[12px] xl:text-[14px] text-black  bg-white w-full"
								name=""
								id=""
								placeholder="Enter your Email"
								disabled />
						</div>

						<div className="flex flex-col gap-1 w-full">
							<label className="text-[14px] xl:text-[16px]  font-bold">
								Phone Number
							</label>
							<input
								type="text"
								value={`+${userDetails?.country_code} ${userDetails?.phone_no}`}
								className=" text-[12px] rounded-[10px] font-normal focus:outline-none sm:text-[12px] xl:text-[14px] text-black  bg-white w-full"
								name=""
								id=""
								placeholder="Enter your Email"
								disabled />
						</div>
					</form>
				</div>
				<div className=' h-full flex items-center justify-center mx-5'><img src={profile2} className=' w-[370px] md:w-[410px] mt-0  sm:mt-3 ' alt="" />
				</div>
			</div>
		</div>

	)
}

export default ProfileRight
