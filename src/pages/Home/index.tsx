import Header from "../../components/layout/Header";
import HomePainPoints from "./HomePainPoints";
import HomeSlogan from "./HomeSlogan";
import HomeSolutionList from "./HomeSolutionList";
import HomeTaskCount from "./HomeTaskCount";
import HomeTaskStep from "./HomeTaskStep";
const Home = () => {
  return (
    <>
      <div className="container mx-auto max-w-[1280px] px-4 pt-4 md:px-20">
        <Header />
        <HomeSlogan />
        <HomePainPoints />
        <HomeSolutionList />
        <HomeTaskCount />
        <HomeTaskStep />
        {/* <HomeTaskHero /> */}
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default Home;
