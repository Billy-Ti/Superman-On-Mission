import Header from "../../components/layout/Header";
import HomePainPoints from "./HomePainPoints";
import HomeSlogan from "./HomeSlogan";
const Home = () => {
  return (
    <>
      <div className="container mx-auto px-4 pt-4 md:px-20">
        <Header />
        <HomeSlogan />
        <HomePainPoints />
        {/* <HomeSolution /> */}
        {/* <HomeTaskCount /> */}
        {/* <HomeTaskStep /> */}
        {/* <HomeTaskHero /> */}
        {/* <Footer /> */}
        
      </div>
    </>
  );
};

export default Home;
