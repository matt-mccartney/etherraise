import { Campaign as CampaignType } from "@/library/types/Campaign";
import Campaign from "../Campaign/Campaign";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import tw from "tailwind-styled-components";
import React, { useEffect, useRef, useState } from "react";

const CarouselBtn = tw.button<any>`transition-all h-full p-3 hover:bg-white/5 bg-white/[.025] border border-white/5 rounded-full text-white/50 hover:text-white mt-1`;

export default function CampaignCarousel({
  children,
  title = null,
}: {
  title?: string | null;
  children: any;
}) {
  const items = useRef<HTMLDivElement>(null);
  const [needsScroll, setNeedsScroll] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setNeedsScroll(
        items.current
          ? items.current.scrollWidth - items.current.clientWidth > 0
          : false
      );
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [children, window]);

  const scroll = (dir: "right" | "left") => {
    if (items.current) {
      const scrollAmount = items.current.clientWidth;
      items.current.scrollBy({
        left: dir == "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {title && (
        <>
          <h1 className="ml-12 text-white text-3xl font-medium mb-4">
            Popular Projects
          </h1>
        </>
      )}
      <div className="flex flex-row gap-2 items-center w-full">
        <CarouselBtn
          className={!needsScroll ? `opacity-0` : ``}
          onClick={() => scroll("left")}
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </CarouselBtn>
        <div
          ref={items}
          className="no-scrollbar flex flex-row gap-4 snap-x snap-proximity overflow-x-scroll grow"
        >
          {children}
        </div>
        <CarouselBtn
          className={!needsScroll ? `opacity-0` : ``}
          onClick={() => scroll("right")}
        >
          <ChevronRightIcon className="w-4 h-4" />
        </CarouselBtn>
      </div>
    </>
  );
}
