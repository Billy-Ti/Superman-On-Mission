import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import HomeEndingButton from "./HomeEndingButton";
import HomePainPoints from "./HomePainPoints";
import HomeSlogan from "./HomeSlogan";
import HomeSolutionList from "./HomeSolutionList";
import HomeTaskCount from "./HomeTaskCount";
import HomeTaskHero from "./HomeTaskHero";
import HomeTaskHeroCard from "./HomeTaskHeroCard";
import HomeTaskStep from "./HomeTaskStep";
const Home = () => {
  return (
    <>
      <Header />
      {/* <div className="container mx-auto max-w-[1280px] px-4 pt-4 md:px-20"> */}
        <HomeSlogan />
        <HomePainPoints />
        <HomeSolutionList />
        <HomeTaskCount />
        <HomeTaskStep />
        <HomeTaskHero />
        <HomeTaskHeroCard />
        <HomeEndingButton />
        <Footer />
      {/* </div> */}
    </>
  );
};

export default Home;
