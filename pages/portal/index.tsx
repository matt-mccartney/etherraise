import Navbar from "@/components/Navbar/Navbar";
import { BrowserProvider, ethers, formatEther, parseEther } from "ethers";
import {
  createContext,
  Dispatch,
  ForwardRefExoticComponent,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import TokenRaise from "@/contracts/TokenRaise.json";
import { Campaign as CampaignType } from "@/library/types/Campaign";
import { useWeb3 } from "@/components/Web3Auth/Web3Context";
import CampaignRow from "@/components/CampaignRow/CampaignRow";
import {
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import NotConnected from "@/components/NotConnected/NotConnected";

type SortCategory =
  | "Deadline"
  | "Campaign Name"
  | "Funds Raised"
  | "Goal Completion";
type SortContextType = {
  category: string | null;
  currentSort: number;
  setCurrentSort: Dispatch<SetStateAction<number>>;
  setCategory: Dispatch<SetStateAction<SortCategory | null>>;
};
const SortContext = createContext<SortContextType>({
  category: null,
  currentSort: 0,
  setCategory: () => {},
  setCurrentSort: () => {},
});

const chevronMap: Record<number, ForwardRefExoticComponent<any>> = {
  2: ChevronUpDownIcon,
  0: ChevronUpIcon,
  1: ChevronDownIcon,
};

function SortCategory({ title }: { title: SortCategory }) {
  const { category, setCategory, currentSort, setCurrentSort } =
    useContext(SortContext);
  const [currSort, setCurrSort] = useState<number>(2);

  useEffect(() => {
    if (category !== title) {
      setCurrSort(2);
    }
  }, [category]);

  const cycleSort = () => {
    const newSort = (currSort + 1) % 2;
    setCategory(title);
    setCurrentSort(newSort);
    setCurrSort(newSort);
  };
  const Icon = chevronMap[currSort];
  return (
    <div
      className="flex flex-row gap-[4px] items-center select-none"
      onClick={cycleSort}
    >
      <Icon className={currSort === 2 ? "w-4 h-4" : "w-4 h-2"} />
      <p className="-mb-[2px]">{title}</p>
    </div>
  );
}

export default function Portal() {
  let { connection } = useWeb3();
  const [campaigns, setCampaigns] = useState<CampaignType[]>([]);
  const [category, setCategory] = useState<SortCategory | null>(null);
  const [currentSort, setCurrentSort] = useState<number>(0);

  useEffect(() => {
    let fetchCampaigns = async () => {
      if (!window.ethereum || connection === "" || connection === null) return;
      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const tokenRaise = new ethers.Contract(
          TokenRaise.address,
          TokenRaise.abi,
          signer
        );
        return tokenRaise.getCampaignsByUser(String(connection));
      } catch (err) {
        return [];
      }
    };

    fetchCampaigns().then((x) => setCampaigns(x));
  }, [connection]);

  const sortCampaigns = (category: SortCategory | null) => {
    if (!category) return campaigns;
    return [...campaigns].sort((a, b) => {
      switch (category) {
        case "Campaign Name":
          return b.title.localeCompare(a.title);
        case "Deadline":
          return Number(a.deadline) - Number(b.deadline);
        case "Funds Raised":
          return (
            Number(formatEther(a.currentFundsRaised)) -
            Number(formatEther(b.currentFundsRaised))
          );
        case "Goal Completion":
          return (
            Number(a.currentFundsRaised / a.fundingGoal) -
            Number(b.currentFundsRaised / b.fundingGoal)
          );
        default:
          return 0;
      }
    });
  };

  return (
    <>
      <SortContext.Provider
        value={{ category, setCategory, currentSort, setCurrentSort }}
      >
        <Navbar />
        <div className="p-12">
          <h1 className="font-md text-lg text-white mb-4">My Campaigns</h1>
          <div className="w-full p-2 border-b border-white/10 mb-2 text-white text-[10px] tracking-widest uppercase font-extralight grid gap-2 grid-cols-5">
            <SortCategory title="Campaign Name" />
            <SortCategory title="Deadline" />
            <SortCategory title="Funds Raised" />
            <SortCategory title="Goal Completion" />
          </div>
          <div className="flex flex-col gap-2">
            {(currentSort === 1
              ? sortCampaigns(category).toReversed()
              : sortCampaigns(category)
            )?.map((campaign, index) => (
              <CampaignRow campaign={campaign} key={index} />
            ))}
          </div>
        </div>
      </SortContext.Provider>
      <NotConnected />
    </>
  );
}
