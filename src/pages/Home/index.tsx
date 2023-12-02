import Header from "../../components/layout/Header";
import HomePainPoints from "./HomePainPoints";
import HomeSlogan from "./HomeSlogan";
import HomeSolutionList from "./HomeSolutionList";
import HomeTaskCount from "./HomeTaskCount";
import HomeTaskHero from "./HomeTaskHero";
import HomeTaskStep from "./HomeTaskStep";
import HomeTaskHeroCard from "./HomeTaskHeroCard";
const Home = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto max-w-[1280px] px-4 pt-4 md:px-20">
        <HomeSlogan />
        <HomePainPoints />
        <HomeSolutionList />
        <HomeTaskCount />
        <HomeTaskStep />
        <HomeTaskHero />
        <HomeTaskHeroCard />
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default Home;
