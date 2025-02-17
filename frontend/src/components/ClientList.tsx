interface propType {
  cliList: { [key: string]: string };
  currClient: { [key: string]: string };
  currSender: (key: string, value: string) => void;
  receiver: { [key: string]: string };
}

export function ClientList({
  cliList,
  currClient,
  currSender,
  receiver,
}: propType) {
  const [firstKey] = Object.keys(currClient);
  return (
    <div className="bg-zinc-900 h-[500px] md:h-3/4  md:min-h-3/4 w-fit border border-zinc-700 rounded-xl px-3 drop-shadow-lg ">
      <div className="mt-5">Clients</div>
      <div className="h-0.5 bg-gradient-to-r from-transparent via-zinc-700 to-transparent w-full mt-2.5  drop-shadow-lg"></div>
      <div
        className="overflow-y-auto h-full rounded-scrollbar no-scroll-buttons pr-4"
        style={{ maxHeight: "calc(100vh - 250px)" }}
      >
        {Object.entries(cliList).map(([key, value]) => {
          if (value && key != firstKey) {
            return (
              <div
                key={key}
                onClick={() => currSender(key, value)}
                className=" md:flex md:justify-start md:gap-2.5 mt-5 transition ease-in duration-300 hover:bg-zinc-600 p-1 rounded-lg cursor-pointer px-2.5 py-2.5"
              >
                <div
                  className={`h-8 w-8  text-black rounded-full flex justify-center items-center font-semibold transition-colors duration-300 ease-in-out
                  ${receiver[key] === value ? "bg-white " : "bg-zinc-700"}`}
                >
                  {value[0].toUpperCase()}
                </div>
                <div
                  className={`flex justify-center items-center transition-colors duration-300 ease-in-out ${
                    receiver[key] === value ? "text-white " : "text-zinc-700"
                  }`}
                >
                  {value[0].toUpperCase() + value.slice(1)}
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
