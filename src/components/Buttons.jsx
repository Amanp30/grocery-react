export function AppBtn({ children, onClick, icon, type = "green" }) {
  const colorClasses = {
    green: "bg-[#008000] hover:bg-[#006400]", // Darker shade on hover
    red: "bg-[#B90000] hover:bg-[#900000]", // Darker shade on hover
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center h-12 gap-2 ${
        colorClasses[type] || colorClasses.green
      } text-white px-4 py-2 rounded-md transition duration-200`}
    >
      {icon && <img src={icon} alt="icon" className="w-8 h-8" />}
      <span className="font-semibold">{children}</span>
    </button>
  );
}
