import { Icon } from "@iconify/react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import { db } from "../../config/firebase";
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
  photos?: string[]; // photos是可選的字串陣列的 URL，有可能任務資訊中沒有上傳圖片
  accepted?: boolean;
  createdAt: string;
}

const AcceptTask = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  // 新增一個狀態來儲存用戶選擇的服務類型
  const [currentPage, setCurrentPage] = useState(1);
  // 目前設定每頁只會有兩則任務 useState(2);
  const [tasksPerPage] = useState(3);
  // 選擇地區、縣市的狀態
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [isUrgentSelected, setIsUrgentSelected] = useState(false);

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
      const q = query(collection(db, "tasks"));
      const querySnapshot = await getDocs(q);
      const tasksData = querySnapshot.docs
        .map((doc) => {
          const data = doc.data() as Task;
          return {
            ...data,
            id: doc.id,
          };
        })
        .filter((task) => !task.accepted); // 只保留那些未被接受的任務

      setTasks(tasksData);
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

  // 排序任務
  useEffect(() => {
    const fetchTasks = async () => {
      const tasksCollectionRef = collection(db, "tasks");
      const q = query(tasksCollectionRef, orderBy("createdAt", "desc")); // 使用 orderBy 進行降序排序
      const querySnapshot = await getDocs(q);

      const tasksData = querySnapshot.docs
        .map((doc) => {
          const data = doc.data() as Task; // 確保映射所有 Task 屬性
          return {
            ...data,
            id: doc.id,
          };
        })
        .filter((task) => !task.accepted); // 只保留未被接受的任務

      setTasks(tasksData);
    };

    fetchTasks();
  }, [currentPage]);

  useEffect(() => {
    // 篩選任務
    const filtered = tasks.filter((task) => {
      return (
        (!selectedCity || task.city === selectedCity) &&
        (!selectedDistrict || task.district === selectedDistrict)
      );
    });

    setFilteredTasks(filtered);
  }, [selectedCity, selectedDistrict, tasks]); // 注意這裡是依賴 tasks，而非 tasksData

  useEffect(() => {
    // 根據 isUrgentSelected 的值來過濾任務
    const filteredTasks = isUrgentSelected
      ? tasks.filter((task) => task.isUrgent) // 若 isUrgentSelected 為 true，則只顯示標記為急件的任務
      : tasks; // 若 isUrgentSelected 為 false，則顯示所有任務
    setFilteredTasks(filteredTasks); // 更新 filteredTasks 狀態
  }, [tasks, isUrgentSelected]);

  // 獲取當前頁的任務
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  // 更改頁碼
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
      <Header />
      <Carousel />
      <div className="container mx-auto max-w-[1280px] px-4 pb-10 md:max-w-7xl lg:px-20">
        <div className="mb-4">
          <div className="mb-4 flex items-center font-semibold">
            <span className="mr-2 h-8 w-2 bg-[#368DCF]"></span>
            <p className="text-2xl">依照分類搜尋</p>
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
          className="mb-4 justify-end"
        />
        {currentTasks.length === 0 ? (
          <div className="mb-10 text-center">
            <p className="text-xl">目前還沒有可接的任務...</p>
          </div>
        ) : (
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currentTasks.map((task) => (
              <>
                <div
                  key={task.id}
                  className="border-gradient relative flex grow flex-col rounded-md border-2 border-gray-200 p-4 bg-gray-100"
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
                      <p className="text-center font-semibold text-2xl">{task.title}</p>
                      <div className="mt-1 flex grow items-center font-semibold">
                        <a
                          href={`https://www.google.com/maps/search/${task.city}${task.district}${task.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex grow items-center"
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
                          <>{index > 0 ? `、${category}` : category}</>
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

                              {/* <span className="text-lg font-bold">
                                是否急件&emsp;:
                              </span>
                              <span className="text-lg font-bold">
                                &emsp;否
                              </span> */}
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
                          className="mr-1  flex-shrink-0"
                          icon="fluent-mdl2:date-time"
                          width="20"
                          height="20"
                        />
                        截止日期 : {task.dueDate}
                      </p>
                      <button
                        onClick={() => handleAcceptTask(task.id)}
                        type="button"
                        className="transition-border-b duration-all-100 rounded-lg border-b-4 border-b-gray-400 px-6 py-3 font-semibold text-black transition ease-in-out hover:border-b-transparent hover:bg-[#368DCF] hover:text-white"
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
              </>
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
    </>
  );
};

export default AcceptTask;
