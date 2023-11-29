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
  return (
    <>
      <select
        className="rounded mr-3 flex items-center border bg-gray-200 p-2"
        name="county"
        id="county"
        value={selectedCounty}
        onChange={(e) => onCountyChange(e.target.value)}
      >
        <option value="">請選擇任務縣市</option>
        <option value="台北市">台北市</option>
        <option value="新北市">新北市</option>
        <option value="桃園市">桃園市</option>
        <option value="台中市">台中市</option>
        <option value="台南市">台南市</option>
        <option value="高雄市">高雄市</option>
        <option value="基隆市">基隆市</option>
        <option value="新竹市">新竹市</option>
        <option value="新竹縣">新竹縣</option>
        <option value="苗栗縣">苗栗縣</option>
        <option value="彰化縣">彰化縣</option>
        <option value="南投縣">南投縣</option>
        <option value="雲林縣">雲林縣</option>
        <option value="嘉義市">嘉義市</option>
        <option value="嘉義縣">嘉義縣</option>
        <option value="屏東縣">屏東縣</option>
        <option value="宜蘭縣">宜蘭縣</option>
        <option value="花蓮縣">花蓮縣</option>
        <option value="台東縣">台東縣</option>
      </select>
      {selectedCounty && (
        <div className="mr-3 flex items-center">
          <select
            value={selectedRegion}
            className="rounded flex items-center border bg-gray-200 p-2"
            name="region"
            id="region"
            onChange={(e) => onRegionChange(e.target.value)}
          >
            <option value="">請選擇任務地區</option>
            {countyToRegion[selectedCounty]?.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  );
};

export default RegionSelector;
