import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import ReviewContent from "./ReviewContent";
const ReviewLists: React.FC = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto w-full max-w-[1280px] px-4 py-10 pb-4 md:px-20 md:py-20">
        <div className="flex items-center justify-center">
          <div className="sm:rounded-md-2xl flex max-w-7xl flex-1 flex-col space-y-5 lg:flex-row lg:space-x-10 lg:space-y-0">
            <ReviewContent />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ReviewLists;
