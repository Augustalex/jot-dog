export function HomeButton() {
  return (
    <a
      href="/"
      className="flex p-2 rounded-lg justify-between items-center floating-shadow bg-white hover:bg-indigo-50 cursor-pointer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#18181b"
      >
        <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
      </svg>
    </a>
  );
}
