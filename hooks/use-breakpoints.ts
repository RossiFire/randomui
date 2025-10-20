import useScreenSize from "./use-screen-size";

const MOBILE_WIDTH = 768;
const TABLET_WIDTH = 1024;

export type BreakPoints = {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
}

export const useBreakPoints = (): BreakPoints => {

    const { width } = useScreenSize();
    
    const isMobile = width < MOBILE_WIDTH;
    const isTablet = width >= MOBILE_WIDTH && width < TABLET_WIDTH;
    const isDesktop = width >= TABLET_WIDTH;

    return { isMobile, isTablet, isDesktop };
}