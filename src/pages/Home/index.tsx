import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import EvaluationsGrid from "./HomeEvaluationsGrid";
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
      <EvaluationsGrid />
      <Footer />
    </>
  );
};

export default Home;
