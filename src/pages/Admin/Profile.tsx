import SideBar from "./SideBar";

const Profile = () => {
  return (
    <>
      <div className="flex min-h-screen">
        <SideBar />
        <div className="container mx-auto my-32 md:ml-[160px] flex-grow px-4 ">
          <div>
            <div className="relative rounded-lg bg-white shadow sm:mx-auto md:w-1/2 ">
              <div className="flex justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt=""
                  className="absolute -top-20 mx-auto h-32 w-32 transform rounded-full border-4 border-white shadow-md transition duration-200 hover:scale-110"
                />
              </div>
              <div className="mt-16">
                <h1 className="text-center text-3xl font-bold text-gray-900">
                  Pantazi Software
                </h1>
                <p>
                  <span></span>
                </p>
                <div className="my-5 px-6">
                  <a
                    href="#"
                    className="block rounded-lg bg-gray-900 px-6 py-3 text-center font-medium leading-6 text-gray-200 hover:bg-black hover:text-white"
                  >
                    Connect with <span className="font-bold">@pantazisoft</span>
                  </a>
                </div>
                <div className="my-5 flex items-center justify-between px-6">
                  <a
                    href=""
                    className="w-full rounded py-3 text-center text-sm font-medium text-gray-500 transition duration-150 ease-in hover:bg-gray-100 hover:text-gray-900"
                  >
                    Facebook
                  </a>
                  <a
                    href=""
                    className="w-full rounded py-3 text-center text-sm font-medium text-gray-500 transition duration-150 ease-in hover:bg-gray-100 hover:text-gray-900"
                  >
                    Twitter
                  </a>
                  <a
                    href=""
                    className="w-full rounded py-3 text-center text-sm font-medium text-gray-500 transition duration-150 ease-in hover:bg-gray-100 hover:text-gray-900"
                  >
                    Instagram
                  </a>
                  <a
                    href=""
                    className="w-full rounded py-3 text-center text-sm font-medium text-gray-500 transition duration-150 ease-in hover:bg-gray-100 hover:text-gray-900"
                  >
                    Email
                  </a>
                </div>
                <div className="w-full">
                  <h3 className="px-6 text-left font-medium text-gray-900">
                    Recent activites
                  </h3>
                  <div className="mt-5 flex w-full flex-col items-center overflow-hidden text-sm">
                    <a
                      href="#"
                      className="block w-full border-t border-gray-100 py-4 pl-6 pr-3 text-gray-600 transition duration-150 hover:bg-gray-100"
                    >
                      <img
                        src="https://avatars0.githubusercontent.com/u/35900628?v=4"
                        alt=""
                        className="mr-2 inline-block h-6 rounded-full shadow-md"
                      />
                      Updated his status
                      <span className="text-xs text-gray-500">24 min ago</span>
                    </a>
                    <a
                      href="#"
                      className="block w-full border-t border-gray-100 py-4 pl-6 pr-3 text-gray-600 transition duration-150 hover:bg-gray-100"
                    >
                      <img
                        src="https://avatars0.githubusercontent.com/u/35900628?v=4"
                        alt=""
                        className="mr-2 inline-block h-6 rounded-full shadow-md"
                      />
                      Added new profile picture
                      <span className="text-xs text-gray-500">42 min ago</span>
                    </a>
                    <a
                      href="#"
                      className="block w-full border-t border-gray-100 py-4 pl-6 pr-3 text-gray-600 transition duration-150 hover:bg-gray-100"
                    >
                      <img
                        src="https://avatars0.githubusercontent.com/u/35900628?v=4"
                        alt=""
                        className="mr-2 inline-block h-6 rounded-full shadow-md"
                      />
                      Posted new article in{" "}
                      <span className="font-bold">#Web Dev</span>
                      <span className="text-xs text-gray-500">49 min ago</span>
                    </a>
                    <a
                      href="#"
                      className="block w-full border-t border-gray-100 py-4 pl-6 pr-3 text-gray-600 transition duration-150 hover:bg-gray-100"
                    >
                      <img
                        src="https://avatars0.githubusercontent.com/u/35900628?v=4"
                        alt=""
                        className="mr-2 inline-block h-6 rounded-full shadow-md"
                      />
                      Edited website settings
                      <span className="text-xs text-gray-500">1 day ago</span>
                    </a>
                    <a
                      href="#"
                      className="block w-full overflow-hidden border-t border-gray-100 py-4 pl-6 pr-3 text-gray-600 transition duration-150 hover:bg-gray-100"
                    >
                      <img
                        src="https://avatars0.githubusercontent.com/u/35900628?v=4"
                        alt=""
                        className="mr-2 inline-block h-6 rounded-full shadow-md"
                      />
                      Added new rank
                      <span className="text-xs text-gray-500">5 days ago</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
