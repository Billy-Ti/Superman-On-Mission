import { useState } from "react";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import DisplaySwitchButton from "../components/DisplaySwitchButton";
import ReviewContent from "./ReviewContent";
import ReviewNavigation from "./ReviewNavigation";

const ReviewLists: React.FC = () => {
  const [showReviews, setShowReviews] = useState(false);

  const handleToggleDisplay = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowReviews(event.target.checked);
  };

  return (
    <>
      <Header />
      <div className="bg-[#c8dae8]">
        <div className="container mx-auto flex h-[calc(100vh-70px-335px)] w-full max-w-[1280px] items-center justify-center">
          <div className="sm:rounded-md-2xl flex max-w-7xl flex-1 flex-col space-y-5 bg-[#b1cce7] sm:mx-4 sm:my-2 sm:p-6 lg:flex-row lg:space-x-10 lg:space-y-0">
            <ReviewNavigation />
            <div className="flex">
              <DisplaySwitchButton
                onToggleUrgent={handleToggleDisplay}
                buttonText="顯示已給出的評價"
                className="block"
              />
              <ReviewContent showReviews={showReviews} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ReviewLists;
