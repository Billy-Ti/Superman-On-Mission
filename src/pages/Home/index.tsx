import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import HomeEndingButton from "./HomeEndingButton";
import HomePainPoints from "./HomePainPoints";
import HomeSlogan from "./HomeSlogan";
import HomeSolutionList from "./HomeSolutionList";
import HomeTaskCount from "./HomeTaskCount";
import HomeTaskHeroCard from "./HomeTaskHeroCard";
import HomeTaskStep from "./HomeTaskStep";
const Home = () => {
  return (
    <>
      <Header />
      <HomeSlogan />
      <HomePainPoints />
      <HomeSolutionList />
      <HomeTaskCount />
      <HomeTaskStep />
      <HomeTaskHeroCard />
      <HomeEndingButton />
      <Footer />
    </>
  );
};

export default Home;
