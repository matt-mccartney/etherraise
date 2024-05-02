"use client";
import { Menu, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/solid";
import { ChartPieIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";
import { useWeb3 } from "./Web3Context";
import { useRouter } from "next/navigation";

export default function Web3Menu({ children }: { children: React.ReactNode }) {
  let { setConnection } = useWeb3();
  const router = useRouter();
  return (
    <div className=" text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center gap-2 rounded-md border border-white/10 bg-black/10 px-4 py-2 text-sm font-medium text-white hover:bg-black/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
            {children}
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5 text-violet-200 hover:text-violet-100"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => router.push("/create")}
                    className={`gap-2 flex flex-row items-center ${
                      active ? "bg-violet-500 text-white" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <RocketLaunchIcon aria-hidden="true" className="w-5 h-5" />
                    <p className="-mb-[2px]">Launch Project</p>
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => router.push("/portal")}
                    className={`gap-2 flex flex-row items-center ${
                      active ? "bg-violet-500 text-white" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <ChartPieIcon aria-hidden="true" className="w-5 h-5" />
                    <p className="-mb-[2px]">My Portal</p>
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`gap-2 flex flex-row items-center ${
                      active ? "bg-violet-500 text-white" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    onClick={() => setConnection("")}
                  >
                    <ArrowLeftEndOnRectangleIcon
                      aria-hidden="true"
                      className="w-5 h-5"
                    />
                    <p className="-mb-[2px]">Disconnect</p>
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
