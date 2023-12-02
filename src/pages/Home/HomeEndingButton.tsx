const HomeEndingButton = () => {
  return (
    <div className="text-center">
      <img className="mx-auto w-1/2" src="/superman_2.png" alt="superman-pic" />
      <p></p>
      <div className="group relative transition duration-1000 hover:duration-200">
        <button className="rounded-full bg-gradient-to-r from-pink-300 to-purple-300 px-6 py-3 text-black  hover:from-purple-300 hover:to-pink-300">
          Join us !
        </button>
      </div>
    </div>
  );
};

export default HomeEndingButton;
