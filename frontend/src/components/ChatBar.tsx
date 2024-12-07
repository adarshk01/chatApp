interface propType {
  currUser: string;
}

export function ChatBar({ currUser }: propType) {
  return (
    // <div className="bg-zinc-900 h-3/4 w-fit border border-zinc-700 rounded-xl px-5">
    //   <div className="flex  mt-5 gap-2.5 justify-start">
    //     <div className="h-7 w-7 bg-zinc-700 flex justify-center items-center rounded-full">
    //       U
    //     </div>
    //     <div className="mt-0.5">User</div>
    //   </div>
    //   <div className="h-0.5 bg-gradient-to-r from-transparent via-zinc-700 to-transparent w-full mt-2.5"></div>
    //   <div className="flex items-end flex-grow">
    //     <div>Type</div>
    //   </div>
    // </div>

    <div className="bg-zinc-900 h-3/4 w-fit border border-zinc-700 rounded-xl px-5 flex flex-col drop-shadow-lg">
      <div className="flex mt-5 gap-2.5 justify-start">
        <div className="h-7 w-7 bg-zinc-700 flex justify-center items-center rounded-full">
          U
        </div>
        <div className="mt-0.5">User</div>
      </div>
      <div className="h-0.5 bg-gradient-to-r from-transparent via-zinc-700 to-transparent w-full mt-2.5"></div>
      <div className="flex-grow flex items-end w-72 mb-4 gap-1.5">
        <input
          className=" bg-zinc-700 p-1.5 text-sm rounded-2xl pl-3 w-full"
          type="text"
          placeholder="Type..."
        />
        <div className=" h-8 w-8 bg-zinc-700 rounded-full flex justify-center items-center p-1.5 cursor-pointer">
          <svg
            height="24"
            viewBox="0 0 48 48"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            className="-rotate-45  "
          >
            <path
              d="M4.02 42l41.98-18-41.98-18-.02 14 30 4-30 4z"
              fill="white"
            />
            <path d="M0 0h48v48h-48z" fill="none" />
          </svg>
        </div>
      </div>
    </div>
  );
}
