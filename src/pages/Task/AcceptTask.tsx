import { Icon } from "@iconify/react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import Footer from "../../layout/Footer";
import Header from "../../layout/Header";
import { db } from "../../utils/firebase";
import Carousel from "../components/Carousel";
import DisplaySwitchButton from "../components/DisplaySwitchButton";
import ServiceTypeSelector from "../components/ServiceTypeSelectorProps";
import RegionFilter from "./RegionFilter";

interface Task {
  id: string;
  cost: number;
  dueDate: string;
  isUrgent: boolean;
  title: string;
  status: string;
  city: string;
  district: string;
  address: string;
  categorys: string[];
  photos?: string[];
  accepted?: boolean;
  createdAt: string;
}

const AcceptTask = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(3);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [isUrgentSelected, setIsUrgentSelected] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleAcceptTask = async (taskId: string) => {
    navigate(`/acceptDetail/${taskId}`);
  };

  const handleToggleUrgent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsUrgentSelected(event.target.checked);
  };

  const [serviceType] = useState<string[]>([
    "生活服務",
    "履歷撰寫",
    "專業顧問",
    "社群貼文",
    "程式開發",
    "專題製作",
    "翻譯寫作",
    "影像服務",
    "其他",
  ]);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, "tasks"),
          where("accepted", "==", false),
        );
        const querySnapshot = await getDocs(q);
        const tasksData = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as Task),
          id: doc.id,
        }));

        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [currentPage]);

  useEffect(() => {
    const selectedServiceTypes = selectedIndexes.map(
      (index) => serviceType[index],
    );
    const newFilteredTasks =
      selectedIndexes.length > 0
        ? tasks.filter((task) =>
            task.categorys.some((category) =>
              selectedServiceTypes.includes(category),
            ),
          )
        : tasks;
    setFilteredTasks(newFilteredTasks);
  }, [tasks, selectedIndexes, serviceType]);

  useEffect(() => {
    const fetchTasks = async () => {
      const tasksCollectionRef = collection(db, "tasks");
      const q = query(tasksCollectionRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const tasksData = querySnapshot.docs
        .map((doc) => {
          const data = doc.data() as Task;
          return {
            ...data,
            id: doc.id,
          };
        })
        .filter((task) => !task.accepted);

      setTasks(tasksData);
    };

    fetchTasks();
  }, [currentPage]);

  useEffect(() => {
    const filtered = tasks.filter((task) => {
      return (
        (!selectedCity || task.city === selectedCity) &&
        (!selectedDistrict || task.district === selectedDistrict)
      );
    });

    setFilteredTasks(filtered);
  }, [selectedCity, selectedDistrict, tasks]);

  useEffect(() => {
    const filteredTasks = isUrgentSelected
      ? tasks.filter((task) => task.isUrgent)
      : tasks;
    setFilteredTasks(filteredTasks);
  }, [tasks, isUrgentSelected]);
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>資料載入中...</p>
      </div>
    );
  }
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleServiceTypeClick = (index: number) => {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter((i) => i !== index));
    } else {
      setSelectedIndexes([...selectedIndexes, index]);
    }
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedDistrict("");
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
  };
  return (
    <>
      <div className="bg-[url('/home_pain_point.png')] bg-cover bg-fixed bg-center object-cover">
        <Header />
        <Carousel />
        <div className="container mx-auto max-w-[1280px] px-4 pb-10 md:max-w-7xl lg:px-20">
          <div className="mb-4">
            <div className="mb-4 flex items-center font-semibold">
              <span className="mr-2 h-8 w-2 bg-[#368DCF]"></span>
              <p className="text-xl md:text-2xl">依照分類搜尋</p>
            </div>
            <ServiceTypeSelector
              serviceType={serviceType}
              selectedIndexes={selectedIndexes}
              handleServiceTypeClick={handleServiceTypeClick}
            />
            <RegionFilter
              onCountyChange={handleCityChange}
              onRegionChange={handleDistrictChange}
            />
            <div className="flex items-center">
              <span className="mr-2 h-8 w-2 bg-[#368DCF]"></span>
              <DisplaySwitchButton
                buttonText="顯示所有急件"
                className="mb-0"
                onToggleUrgent={handleToggleUrgent}
              />
            </div>
          </div>
        </div>
        <div className="container mx-auto max-w-[1280px] px-4 md:max-w-7xl lg:px-20">
          <Pagination
            tasksPerPage={tasksPerPage}
            totalTasks={tasks.length}
            paginate={paginate}
            currentPage={currentPage}
            className="mb-4 justify-center"
          />
          {currentTasks.length === 0 ? (
            <div className="mb-10 flex h-64 flex-col items-center justify-center gap-10 border border-[#368DCF] text-center">
              <p className="text-xl">目前還沒有可接的任務...</p>
              <p className="text-lg font-medium">
                有需要發任務可至
                <span className="text-[#368def]">
                  <Link to="/taskPage">發任務</Link>
                </span>
                開始
              </p>
            </div>
          ) : (
            <div className="mb-4 grid grid-cols-1 gap-4 overflow-visible md:grid-cols-2 lg:grid-cols-3">
              {currentTasks.map((task) => (
                <div
                  key={task.id}
                  className="border-gradient relative flex grow flex-col rounded-md border-2 border-gray-200 bg-white p-4 shadow-xl transition-all duration-300 ease-in-out hover:z-50 hover:scale-105 hover:shadow-2xl"
                >
                  <div className="flex grow flex-col items-start gap-2">
                    <div className="flex h-64 w-full items-center justify-center overflow-hidden rounded-md border-2 border-gray-300">
                      {" "}
                      {task.photos?.[0] ? (
                        <img
                          src={task.photos[0]}
                          alt="任務"
                          className="h-full w-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                        />
                      ) : (
                        <span className="text-center text-lg text-gray-600">
                          無提供圖片
                        </span>
                      )}
                    </div>

                    <div className="flex w-full grow flex-col gap-4 pl-2">
                      <p className="line-clamp-1 grow text-center text-2xl font-semibold">
                        {task.title}
                      </p>
                      <div className="mt-1 flex grow items-center font-semibold">
                        <a
                          href={`https://www.google.com/maps/search/${task.city}${task.district}${task.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex  items-center"
                        >
                          <Icon
                            icon="mdi:location"
                            className="mr-1 flex-shrink-0"
                            width="20"
                            height="20"
                          />
                          {task.city}
                          {task.district}
                          {task.address}
                        </a>
                      </div>
                      <h5 className="inline-flex grow font-semibold">
                        <Icon
                          icon="mdi:tag"
                          width="20"
                          height="20"
                          className="mr-1 flex-shrink-0"
                        />
                        {task.categorys.map((category, index) => (
                          <span key={index}>
                            {index > 0 ? `、${category}` : category}
                          </span>
                        ))}
                      </h5>

                      <div className="flex grow flex-col">
                        <div className="flex items-center">
                          {task.isUrgent ? (
                            <div className="absolute right-0 top-0 h-10 w-10 p-2">
                              <Icon
                                className="absolute inset-0"
                                icon="bxs:label"
                                color="red"
                                width="40"
                                height="40"
                                rotate={3}
                                hFlip={true}
                                vFlip={true}
                              />
                              <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-white">
                                急
                              </span>
                            </div>
                          ) : (
                            <>
                              <div className="absolute right-0 top-0 h-10 w-10 p-2">
                                <Icon
                                  className="absolute inset-0"
                                  icon="bxs:label"
                                  color="#3178C6"
                                  width="40"
                                  height="40"
                                  rotate={3}
                                  hFlip={true}
                                  vFlip={true}
                                />
                                <span className="absolute inset-0 flex items-center justify-center font-semibold text-white">
                                  推
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                        <p className="flex items-center font-semibold">
                          <Icon
                            className="mr-1 flex-shrink-0"
                            icon="tabler:coin-filled"
                            width="20"
                            height="20"
                          />
                          Super Coins : {task.cost}
                        </p>
                      </div>
                      <p className="flex items-center font-semibold">
                        <Icon
                          className="mr-1 flex-shrink-0"
                          icon="fluent-mdl2:date-time"
                          width="20"
                          height="20"
                        />
                        截止日期 : {task.dueDate}
                      </p>
                      <button
                        onClick={() => handleAcceptTask(task.id)}
                        type="button"
                        className="items-center justify-center rounded-md bg-[#368DCF] p-3 text-xl font-medium text-white transition duration-500 ease-in-out hover:bg-[#2b79b4]"
                      >
                        <Icon
                          icon="icon-park:click-tap"
                          className="mr-2 inline-block h-6 w-6 text-black hover:text-white"
                        />
                        查看任務詳情
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Pagination
            tasksPerPage={tasksPerPage}
            totalTasks={tasks.length}
            paginate={paginate}
            currentPage={currentPage}
            className="justify-center"
          />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default AcceptTask;
