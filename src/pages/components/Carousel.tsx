import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

interface Task {
  id: string;
  title: string;
  photos?: string[];
  // 添加任務的其他屬性...
}

const Carousel = () => {
  // 明確提供 useState 的類型
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

  // Slider 的設定
  const settings = {
    dots: true,
    infinite: tasks.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    // 這裡可以加上自訂義的箭頭或其他設定
  };

  return (
    <div className="container mx-auto flex items-center">
      <div className="mr-4 flex items-center">
        <div className="mr-2 h-10 w-2 bg-[#00f5a2]"></div>
        <h2 className="text-4xl font-bold">找任務</h2>
        <div className="flex flex-col">
          <p className="text-sm">發掘優質的家政專員！</p>
          <p className="text-sm">讓人手專業靠譜</p>
        </div>
      </div>
      <div className="mx-auto w-1/2">
        <Slider {...settings}>
          {tasks.map((task, index) => (
            <div key={index} className="p-2">
              {task.photos &&
                task.photos.map((photoUrl, photoIndex) => (
                  <div key={photoIndex} className="mb-4">
                    <img
                      src={photoUrl}
                      alt={task.title}
                      className="h-auto w-full object-cover"
                    />
                  </div>
                ))}
              <h3 className="text-center">{task.title}</h3>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Carousel;
