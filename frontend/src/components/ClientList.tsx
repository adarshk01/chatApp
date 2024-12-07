interface propType {
  cliList: string[];
}

export function ClientList({ cliList }: propType) {
  return (
    <div className="bg-zinc-900 h-3/4 w-fit border border-zinc-700 rounded-xl px-3 drop-shadow-lg">
      <div className="mt-5">Clients</div>
      <div className="h-0.5 bg-gradient-to-r from-transparent via-zinc-700 to-transparent w-full mt-2.5  drop-shadow-lg"></div>
      <div className=" ">
        {cliList.map(function (i, index) {
          return (
            <div key={index} className=" flex justify-center">
              <div className="h-10 w-10 bg-white text-black rounded-full flex justify-center items-center mt-5 font-semibold cursor-pointer">
                {i}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
