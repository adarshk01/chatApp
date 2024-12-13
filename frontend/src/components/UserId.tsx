import { useState } from "react";

interface propType {
  checkUserName: () => void;
  setCurrUser: (newValue: string) => void;
  setCheckUserName: (newValue: boolean) => void;
}

export function UserId({ setCurrUser, setCheckUserName }: propType) {
  const [tempUser, setTempUser] = useState<string>("");

  return (
    <div className="bg-zinc-800 h-fit w-96  p-7 rounded-lg border border-neutral-600 drop-shadow-lg">
      <div>Enter your username</div>
      <input
        onChange={function (e) {
          setTempUser(e.target.value);
        }}
        type="text"
        placeholder="Enter here"
        className="mt-5 bg-zinc-700 p-1.5 text-sm rounded-2xl pl-3 w-full"
      />
      <div className="flex justify-center">
        <div
          className=" w-fit mt-5 bg-zinc-900 p-1.5 rounded-lg cursor-pointer px-2.5 hover:bg-zinc-950"
          onClick={function () {
            setCurrUser(tempUser);
            setCheckUserName(true);

            // checkUserName
          }}
        >
          Submit
        </div>
      </div>
    </div>
  );
}
