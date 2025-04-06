export default function Header() {
  const token = localStorage.getItem("token");

  const onClickLogout = () => {
    if (window.confirm("Вы уверенны, что хотите выйти?")) {
      window.localStorage.removeItem("token");
      window.location.href = "/sign_in";
    }
  };
  return (
    <>
      {token && (
        <div className="flex flex-row-reverse rounded m-2 ">
          <button onClick={onClickLogout} className="px-5 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition cursor-pointer">
            Выйти
          </button>
        </div>
      )}
    </>
  );
}
