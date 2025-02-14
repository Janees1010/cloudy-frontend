import ClipLoader from "react-spinners/ClipLoader";

const Loader = ({ size = 50, color = "#4A90E2" }) => (
  <div className="flex justify-center  items-center h-[100vh]">
    <ClipLoader size={size} color={color} />
  </div>
);

export default Loader;
