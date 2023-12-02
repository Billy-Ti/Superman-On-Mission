import { Icon } from "@iconify/react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import Header from "../../components/layout/Header";
import { db } from "../../config/firebase";
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

  const [searchQuery, setSearchQuery] = useState("");

  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<
    string[]
  >([]);

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

    // 觸發動畫
    // setAnimationClass("");
    // setTimeout(() => setAnimationClass("animate-fadeIn"), 10);
  }, [tasks, selectedIndexes, serviceType]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const q = query(collection(db, "tasks"));
      const querySnapshot = await getDocs(q);
      const allSuggestions: string[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.categorys && Array.isArray(data.categorys)) {
          allSuggestions.push(...data.categorys);
        }
        if (data.title && typeof data.title === "string") {
          allSuggestions.push(data.title);
        }
      });
      setAutocompleteSuggestions([...new Set(allSuggestions)]); // 移除重複項
    };

    fetchSuggestions();
  }, []);

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

    // 這裡可以加入其他相關邏輯，如基於其他篩選條件進一步過濾任務
  }, [tasks, isUrgentSelected]); // useEffect 依賴於 tasks 和 isUrgentSelected

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

  const handleBackToTask = () => navigate("/");

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedDistrict("");
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      await handleTaskSearch();
    }
  };

  const handleTaskSearch = async (queryParam?: string) => {
    const searchQueryTrimmed = queryParam
      ? queryParam.trim().toLowerCase()
      : searchQuery.trim().toLowerCase();

    if (searchQueryTrimmed) {
      const q = query(
        collection(db, "tasks"),
        where("categorys", "array-contains", searchQueryTrimmed),
        // 可以加其他查詢條件，如 where("title", "==", searchQueryTrimmed) 等
      );
      const querySnapshot = await getDocs(q);
      const foundTasks = querySnapshot.docs.map((doc) => {
        const data = doc.data() as Task;
        return {
          ...data, // 將所有 Task 屬性包含在內
          id: doc.id,
        };
      });

      setFilteredTasks(foundTasks);
    } else {
      console.log("搜尋詞為空，未執行查詢");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!e.target.value) {
      setFilteredTasks(tasks); // 如果輸入框為空，則顯示所有任務
    }
  };

  const renderAutocompleteSuggestions = () => {
    const filteredSuggestions = autocompleteSuggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return filteredSuggestions.map((suggestion) => (
      <div key={suggestion} onClick={() => handleSuggestionClick(suggestion)}>
        {suggestion}
      </div>
    ));
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleTaskSearch(suggestion); // 執行搜索
  };

  return (
    <>
      <Header />

      <div className="container mx-auto max-w-[1280px] px-20 md:max-w-7xl">
        <h3 className="mb-4 mt-10 border-b-8 border-black pb-3 text-4xl font-bold">
          找任務 {`>>`}
          <button onClick={handleBackToTask} type="button" className="text-xl">
            回首頁
          </button>
        </h3>
        <p className="bg-gradient-to-r from-blue-600 to-purple-400 bg-clip-text text-2xl text-transparent">
          依照分類搜尋
        </p>

        <ServiceTypeSelector
          serviceType={serviceType}
          selectedIndexes={selectedIndexes}
          handleServiceTypeClick={handleServiceTypeClick}
        />
        <RegionFilter
          onCountyChange={handleCityChange}
          onRegionChange={handleDistrictChange}
        />

        <div className="relative mb-10 flex items-center">
          <label
            htmlFor="searchTask"
            className="mr-2 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-400 bg-clip-text text-2xl font-black text-transparent"
          >
            試試直接搜尋吧
          </label>
          <div className="relative">
            <input
              id="searchTask"
              placeholder="生活...程式...家教"
              className="rounded-md px-2 py-1 focus:outline-none"
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={() => handleTaskSearch()}
              type="button"
              className="translate-x-[-30px] translate-y-[10px]"
            >
              <Icon icon="ri:search-line" width="30" color="#e0e7ff" />
            </button>
            {searchQuery && (
              <div className="autocomplete-suggestions absolute left-0 w-full cursor-pointer bg-gray-300 px-2">
                {renderAutocompleteSuggestions()}
              </div>
            )}
          </div>
        </div>
        <DisplaySwitchButton
          buttonText="顯示所有急件"
          onToggleUrgent={handleToggleUrgent}
        />
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
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {currentTasks.map((task) => (
              <>
                <div
                  key={task.id}
                  className="border-gradient relative flex grow flex-col rounded-md border-2 border-gray-200 p-4"
                >
                  <div className="flex min-h-[300px] grow items-start gap-2">
                    <div className="border-2 border-gray-300 p-2">
                      {task.photos?.[0] ? (
                        <img
                          src={task.photos[0]}
                          alt="任務"
                          className="h-32 w-32 object-cover"
                        />
                      ) : (
                        <div className="flex h-32 w-32 items-center justify-center bg-gray-300">
                          <Icon
                            icon="bxs:image-alt"
                            className="text-6xl text-gray-600"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex w-full flex-col gap-5 text-left">
                      <h5 className="text-lg font-bold">
                        {task.categorys
                          .map((category) => `#${category}`)
                          .join(" ")}
                      </h5>
                      <p className="text-sm">{task.title}</p>
                      <div className="mt-1 flex items-center">
                        <a
                          href={`https://www.google.com/maps/search/${task.city}${task.district}${task.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          <Icon icon="mdi:location" />
                          {task.city}
                          {task.district}
                          {task.address}
                        </a>
                      </div>
                      {/* <div>
                      <p>任務截止日期 : {task.dueDate}</p>
                    </div> */}
                      {/* <div className="mt-1">
                      <span className="text-lg font-bold">任務狀態 :</span>
                      <span className="ml-2 text-lg font-bold">
                        {task.status || "未知"}
                      </span>
                    </div> */}
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          {task.isUrgent ? (
                            <>
                              <Icon
                                className="absolute right-0 top-[-15px] animate-scale-pulse"
                                icon="bi:fire"
                                color="red"
                                width="40"
                                height="40"
                              />
                            </>
                          ) : (
                            <>
                              <Icon
                                className="absolute right-[-5px] top-[-15px]"
                                icon="bxs:label"
                                color="red"
                                width="40"
                                height="40"
                                rotate={3}
                                hFlip={true}
                                vFlip={true}
                              />
                              <span className="absolute right-[2.5%] top-[-2%] text-lg text-white">
                                T
                              </span>
                              <span className="text-lg font-bold">
                                是否急件&emsp;:
                              </span>
                              <span className="text-lg font-bold">
                                &emsp;否
                              </span>
                            </>
                          )}
                        </div>
                        {/* <div className="flex items-center">
                        {task.isUrgent ? (
                          <>
                            <Icon icon="bi:fire" color="#dc2026" />
                            <span className="text-lg font-bold">
                              是否急件&emsp;:
                            </span>
                            <span className="text-lg font-bold">
                              &emsp;十萬火急
                            </span>
                          </>
                        ) : (
                          <>
                            <Icon icon="lets-icons:flag-finish-fill" />
                            <span className="text-lg font-bold">
                              是否急件&emsp;:
                            </span>
                            <span className="text-lg font-bold">&emsp;否</span>
                          </>
                        )}
                      </div> */}
                        {/* <p>支付 Super Coins : {task.cost}</p> */}
                      </div>
                      <p className="">
                        任務創建日期 :{" "}
                        {new Date(task.createdAt).toLocaleDateString()}
                      </p>{" "}
                    </div>
                  </div>
                  <button
                    onClick={() => handleAcceptTask(task.id)}
                    className="border-blue-sky-300 group relative cursor-pointer overflow-hidden rounded-md border bg-gray-200 from-blue-400 via-blue-300 to-purple-200 bg-clip-text px-6 py-3 text-2xl font-black text-transparent [transform:translateZ(0)] before:absolute before:bottom-0 before:left-0 before:h-full before:w-full before:origin-[100%_100%] before:scale-x-0 before:bg-gradient-to-r before:transition before:duration-500 before:ease-in-out hover:border-0 hover:before:origin-[0_0] hover:before:scale-x-100"
                  >
                    <span className="relative z-0 text-black transition duration-500 ease-in-out group-hover:text-black">
                      查看任務詳情 {">>"}
                    </span>
                  </button>
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
    </>
  );
};

export default AcceptTask;
