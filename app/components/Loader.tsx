import ClipLoader from "react-spinners/ClipLoader";

const Loader = ({ size = 70, color = "#36d7b7" }) => (
  <div className="flex justify-center items-center h-screen">
    <ClipLoader size={size} color={color} />
  </div>
);

export default Loader;
