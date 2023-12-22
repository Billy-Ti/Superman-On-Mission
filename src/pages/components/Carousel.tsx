import { Icon } from "@iconify/react";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
interface Task {
  id: string;
  title: string;
  photos?: string[];
}
const Carousel = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    const fetchTasks = async () => {
      const firestore = getFirestore();
      const tasksCol = collection(firestore, "tasks");
      const q = query(tasksCol, where("status", "==", "任務媒合中"));
      const taskSnapshot = await getDocs(q);
      const tasksList: Task[] = taskSnapshot.docs.map((doc) => ({
        ...(doc.data() as Task),
        id: doc.id,
      }));
      setTasks(tasksList);
    };
    fetchTasks();
  }, []);

  const showDots = true;
  const visibleTasks = tasks.slice(0, 6);
  // Slider setting
  const CarouselSetting = {
    dots: showDots,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    centerMode: true,
    dotsClass: "slick-dots slick-thumb",
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: false,
          centerMode: false,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          dots: false,
        },
      },
    ],

    customPaging: (i: number) => {
      if (visibleTasks.length > i) {
        const task = visibleTasks[i];
        if (task.photos && task.photos.length > 0) {
          return (
            <a href="#">
              <img src={task.photos[0]} alt={task.title} />
            </a>
          );
        }
      }
      return <Icon icon="bxs:image-alt" className="text-6xl text-gray-600" />;
    },
  };
  return (
    <div className="container mx-auto max-w-[1280px] px-4 py-10 md:max-w-7xl md:py-20 lg:px-20">
      <div className="mb-10 items-center lg:mb-20">
        <div className="flex flex-col ">
          <div className="mb-4 mr-4 flex items-center border-l-[10px] border-l-[#368DCF] pl-2">
            <h2 className="text-2xl font-bold leading-normal md:text-4xl">
              找任務
            </h2>
          </div>
          <div className="mb-20 flex flex-col pl-2">
            <p className="mb-1 text-lg font-medium leading-normal text-gray-600 md:text-xl">
              大顯身手的時候到了！
            </p>
            <p className="text-lg font-medium leading-normal text-gray-600 md:text-xl">
              限時推薦
            </p>
          </div>
        </div>
        <div className="mx-auto px-4 md:w-full">
          <Slider {...CarouselSetting}>
            {visibleTasks.map((task, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-2"
              >
                <div className="mb-2 h-14 text-center">
                  <h3 className="line-clamp-1 rounded-md bg-[#B3D7FF] p-1 text-lg font-semibold">
                    {task.title}
                  </h3>
                </div>

                <div className="min-h-[225px]">
                  {task.photos && task.photos.length > 0 ? (
                    <div className="mb-4 text-center">
                      <Link
                        title="前往任務資訊"
                        to={`/acceptDetail/${task.id}`}
                        className="mb-4 block text-center"
                      >
                        <img
                          src={task.photos[0]}
                          alt={task.title}
                          className="mx-auto h-52 w-52 rounded-md border-[4px] border-[transparent] object-cover duration-300 [box-shadow:rgb(0_0_0_/_69%)_0px_26px_30px_-10px,rgb(0_0_0_/_20%)_0px_16px_10px_-10px] hover:border-[4px]  hover:border-[rgba(249,249,249,0.8)]"
                        />
                      </Link>
                    </div>
                  ) : (
                    <div className="mx-auto flex h-52 w-52 flex-col items-center justify-center">
                      <p className="font-semibold">無提供圖片</p>
                      <Icon
                        icon="bxs:image-alt"
                        className="h-20 w-20 text-gray-600"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};
export default Carousel;
