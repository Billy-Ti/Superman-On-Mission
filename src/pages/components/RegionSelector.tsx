import { useEffect, useRef, useState } from "react";
import countyToRegion from "../components/TaiwanRegion";

interface RegionSelectorProps {
  selectedCounty: string;
  selectedRegion: string;
  onCountyChange: (county: string) => void;
  onRegionChange: (region: string) => void;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({
  selectedCounty,
  selectedRegion,
  onCountyChange,
  onRegionChange,
}) => {
  const [isCountyOpen, setIsCountyOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (wrapperRef.current && !wrapperRef.current.contains(target)) {
        setIsCountyOpen(false);
        setIsRegionOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div ref={wrapperRef} className="flex space-x-2 mb-2 sm:mb-0">
      <div className="relative">
        <div
          className="cursor-pointer rounded border px-4 py-2 font-semibold"
          onClick={() => setIsCountyOpen(!isCountyOpen)}
        >
          {selectedCounty || "選擇縣市"}
          {""}
          <span className="ml-2">▼</span>
        </div>
        {isCountyOpen && (
          <div className="absolute left-0 z-10 mt-1 max-h-80 w-40 overflow-auto rounded border bg-white font-semibold shadow-lg">
            {[
              "台北市",
              "新北市",
              "桃園市",
              "台中市",
              "台南市",
              "高雄市",
              "基隆市",
              "新竹市",
              "新竹縣",
              "苗栗縣",
              "彰化縣",
              "南投縣",
              "雲林縣",
              "嘉義市",
              "嘉義縣",
              "屏東縣",
              "宜蘭縣",
              "花蓮縣",
              "台東縣",
            ].map((county) => (
              <div
                key={county}
                className="cursor-pointer px-4 py-1 hover:bg-blue-100"
                onClick={() => {
                  onCountyChange(county);
                  setIsCountyOpen(false);
                  setIsRegionOpen(true);
                }}
              >
                {county}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCounty && (
        <div className="relative">
          <div
            className="mr-2 cursor-pointer rounded border px-4 py-2 font-semibold"
            onClick={() => setIsRegionOpen(!isRegionOpen)}
          >
            {selectedRegion || "選擇地區"}
            {""}
            <span className="ml-2">▼</span>
          </div>
          {isRegionOpen && (
            <div className="absolute left-0 z-10 mt-1 max-h-80 w-40 overflow-auto rounded border bg-white font-semibold shadow-lg">
              {countyToRegion[selectedCounty]?.map((region) => (
                <div
                  key={region}
                  className="cursor-pointer px-4 py-1 font-semibold hover:bg-blue-100"
                  onClick={() => {
                    onRegionChange(region);
                    setIsRegionOpen(false);
                  }}
                >
                  {region}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RegionSelector;
