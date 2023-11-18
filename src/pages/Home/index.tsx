import { Icon } from "@iconify/react";
// import { showAlert } from "../../utils/showAlert";
import { useNavigate } from "react-router-dom";
import TaskButton from "../Task/TaskButton";

const Home = () => {
  // const click = () => {
  //   showAlert("標題", "文本", "success", "center", false);
  // };
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/SignIn");
  };
  return (
    <>
      <div className="container mx-auto">
        <div className="mt-10 flex items-center justify-between">
          <p className="text-center text-xl">Home</p>
          <Icon
            className="cursor-pointer"
            icon="mingcute:user-4-fill"
            color="rgba(0, 0, 255, 0.3333333333333333)"
            width="40"
            height="40"
            onClick={handleSignIn}
          />
        </div>
      </div>
      <TaskButton />
    </>
  );
};

export default Home;
