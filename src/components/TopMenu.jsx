import { Link } from "react-router-dom";

function TopMenu() {
  return (
    <div>
      <p className="bg-black text-white px-[20px] pt-[5px] text-center">
        App is built with ❤ by{" "}
        <a href="https://amanpareek.in?ref=kirana" className="underline">
          Aman Pareek
        </a>
      </p>

      <div className="flex px-[20px] my-[10px] justify-between">
        <Link to="/">
          <img src="logo.png" width={90} height={58} />
        </Link>
        <Link to="/user-details">
          <img src="user.png" width={60} height={60} />
        </Link>
      </div>
    </div>
  );
}

export default TopMenu;
