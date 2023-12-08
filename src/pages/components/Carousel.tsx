import { Icon } from "@iconify/react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
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
      const tasksCol = collection(getFirestore(), "tasks");
      const taskSnapshot = await getDocs(tasksCol);
      const tasksList: Task[] = taskSnapshot.docs.map((doc) => ({
        ...(doc.data() as Task),
        id: doc.id,
      }));
      setTasks(tasksList);
    };
    fetchTasks();
  }, []);

  // 只顯示前 6 個任務的 dots
  const showDots = true;
  const visibleTasks = tasks.slice(0, 6);
  // Slider 的設定
  const CarouselSetting = {
    dots: showDots,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // 一次要顯示幾張圖片
    slidesToScroll: 1, // 一次滑動要滑動幾張圖片
    autoplay: true, // 自動播放
    autoplaySpeed: 2000, // 自動播放的速率 (毫秒)
    cssEase: "linear", // css 動畫執行過程的速率，不間斷
    centerMode: true, // 代表點完 " 點點" 後圖片會出現在正中間，這會使左右兩側看到其餘一半的圖片
    dotsClass: "slick-dots slick-thumb", // 原本被選中的 "點點" class 叫做 slick-dots，因要設定 "點點" 樣式，怕 class 衝突，所以多加一個自定義的 class 名稱
    responsive: [
      {
        breakpoint: 1280, // 當斷點到 1024，一次顯示 3 張圖片，一次滑動 3 張
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
      // 只為前 10 個任務創建 dots
      if (visibleTasks.length > i) {
        const task = visibleTasks[i];
        // 檢查 task.photos 是否存在且有元素
        if (task.photos && task.photos.length > 0) {
          return (
            <a href="#">
              <img src={task.photos[0]} alt={task.title} />
            </a>
          );
        }
      }
      // 當沒有圖片時顯示預設 icon
      return <Icon icon="bxs:image-alt" className="text-6xl text-gray-600" />;
    },
  };
  return (
    <div className="container mx-auto max-w-[1280px] px-4 md:max-w-7xl lg:px-20">
      <div className="mb-10 items-center lg:mb-20 lg:flex">
        <div className="flex flex-col border-l-[10px] border-l-[#368DCF]">
          <div className="mr-4 flex items-center pl-2">
            <h2 className="text-4xl font-bold leading-normal">找任務</h2>
          </div>
          <div className="flex flex-col pl-2">
            <p className="mb-1 text-xl font-medium leading-normal text-gray-600">
              大顯身手的時候到了！
            </p>
            <p className="text-xl font-medium leading-normal text-gray-600">
              限時推薦
            </p>
          </div>
        </div>
        <div className="mx-auto w-2/3 px-4 md:w-3/4">
          <Slider {...CarouselSetting}>
            {visibleTasks.map((task, index) => (
              <>
                <h3 className="text-center">{task.title}</h3>
                <div
                  key={index}
                  className="flex min-h-[225px] items-center justify-center p-2"
                >
                  {task.photos && task.photos.length > 0 ? (
                    task.photos.map((photoUrl, photoIndex) => (
                      <div key={photoIndex} className="mb-4 text-center">
                        <img
                          src={photoUrl}
                          alt={task.title}
                          className="mx-auto h-52 w-52 rounded-md border-[4px] border-[transparent] object-cover duration-300 [box-shadow:rgb(0_0_0_/_69%)_0px_26px_30px_-10px,rgb(0_0_0_/_20%)_0px_16px_10px_-10px] hover:border-[4px]  hover:border-[rgba(249,249,249,0.8)]"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-xl font-medium">
                      未提供圖片
                    </div>
                  )}
                </div>
              </>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};
export default Carousel;
