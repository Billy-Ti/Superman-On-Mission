import { useState } from "react";
import RegionSelector from "../components/RegionSelector";
interface RegionFilterProps {
  onCountyChange: (city: string) => void;
  onRegionChange: (district: string) => void;
}

const RegionFilter: React.FC<RegionFilterProps> = ({
  onCountyChange,
  onRegionChange,
}) => {
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  const handleCountyChange = (county: string) => {
    setSelectedCounty(county);
    onCountyChange(county);
    setSelectedRegion("");
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    onRegionChange(region);
  };

  const handleClearSelected = () => {
    setSelectedCounty("");
    setSelectedRegion("");
    onCountyChange("");
    onRegionChange("");
  };

  return (
    <div className="mb-20 flex items-center">
      <div className="flex items-center">
        <span className="mr-2 h-8 w-2 bg-[#368DCF]"></span>
        <p className="mr-2 text-2xl font-black">地區搜尋</p>
      </div>

      <RegionSelector
        selectedCounty={selectedCounty}
        selectedRegion={selectedRegion}
        onCountyChange={handleCountyChange}
        onRegionChange={handleRegionChange}
      />
      <a
        onClick={handleClearSelected}
        className="cursor-pointer rounded-md bg-[#368DCF] p-3 py-2 font-medium tracking-widest text-white transition duration-500 ease-in-out backdrop:px-4 hover:bg-[#3178C6]"
      >
        清除所選地區
      </a>
    </div>
  );
};

export default RegionFilter;
