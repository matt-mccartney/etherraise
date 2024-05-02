import tw from "tailwind-styled-components";

export const NavbarContainer = tw.div<any>`p-4 px-8 border-b-2 border-violet-500 bg-white bg-opacity-5 flex flex-row justify-between`
export const NavbarGroup = tw.div<any>`flex flex-row justify-between gap-4`

export const CategoryContainer = tw.div<any>`flex flex-row items-center justify-center gap-4`;
export const Category = tw.a<any>`transition-colors font-light text-white/50 hover:text-white`