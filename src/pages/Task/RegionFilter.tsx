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
    <>
      <div>
        <div className="mb-4 flex items-center">
          <p className="mr-2 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-400 bg-clip-text text-2xl font-black text-transparent">
            依照地區搜尋
          </p>
          <RegionSelector
            selectedCounty={selectedCounty}
            selectedRegion={selectedRegion}
            onCountyChange={handleCountyChange}
            onRegionChange={handleRegionChange}
          />
          <a
            onClick={handleClearSelected}
            className="cursor-pointer rounded-md bg-gradient-to-r from-indigo-300 to-violet-300 px-4 py-2 text-white"
          >
            Clear selected
          </a>
        </div>
      </div>
    </>
  );
};

export default RegionFilter;
