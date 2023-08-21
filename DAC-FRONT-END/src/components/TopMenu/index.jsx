import { useSelector } from "react-redux";
import { selectUser } from "../../store/authSlice";

const TopBar = () => {
  const { user } = useSelector(selectUser);
  return (
    <div className="w-100 h-[50px] bg-black text-white flex justify-end px-5 items-center">
      <div>
        <p>
          {user.name} {user.lastname}
        </p>
      </div>
    </div>
  );
};

export default TopBar;
