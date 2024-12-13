interface propType {
  cliList: { [key: string]: string };
  currClient: { [key: string]: string };
  currSender: (c: string) => void;
  receiver: string;
}

export function ClientList({
  cliList,
  currClient,
  currSender,
  receiver,
}: propType) {
  const [firstKey] = Object.keys(currClient);
  return (
    <div className="bg-zinc-900 h-3/4 w-fit border border-zinc-700 rounded-xl px-3 drop-shadow-lg">
      <div className="mt-5">Clients</div>
      <div className="h-0.5 bg-gradient-to-r from-transparent via-zinc-700 to-transparent w-full mt-2.5  drop-shadow-lg"></div>
      <div className=" ">
        {Object.entries(cliList).map(([key, value]) => {
          if (value && key != firstKey) {
            return (
              <div key={key} className=" flex justify-center">
                <div
                  className={`h-10 w-10 bg-white text-black rounded-full flex justify-center items-center mt-5 font-semibold cursor-pointer 
                  ${receiver == value ? "bg-lime-400" : ""}`}
                  onClick={() => currSender(value)}
                >
                  {value[0].toUpperCase()}
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
