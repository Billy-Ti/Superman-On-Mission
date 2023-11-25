import ReviewContent from "./ReviewContent";
import ReviewNavigation from "./ReviewNavigation";

const ReviewLists = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#c8dae8]">
      <div className="flex max-w-7xl flex-1 flex-col space-y-5 bg-[#b1cce7] sm:mx-4 sm:my-2 sm:rounded-2xl sm:p-6 lg:flex-row lg:space-x-10 lg:space-y-0">
        {/* <!-- Navigation --> */}
        <ReviewNavigation />
        {/* <!-- Content --> */}
        <ReviewContent />
      </div>
    </div>
  );
};

export default ReviewLists;
