import Image from "next/image";
import { useRouter } from "next/router";

type LogoProps = {
    redirect?: string | null;
    width?: number;
    height?: number;
    fixedRatio?: boolean;
}

export default function Logo({ redirect=null, width=109.5, height=15.3, fixedRatio=true } : LogoProps) {
    const router = useRouter()

    if (fixedRatio && width !== 109.5) {
        height = (15.3/109.5)*width;
    } 
    else if (fixedRatio && height !== 15.3) {
        width = (109.5/15.3)*height;
    } 
    
    return (
        <>
            <Image onClick={() => {if (redirect !== null) router.push(redirect)}} src={"/TokenLaunch.svg"} width={width} height={height} alt=""/>
        </>
    )
}