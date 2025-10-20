import { DM_Sans, Major_Mono_Display } from "next/font/google";

const majorMonoDisplay = Major_Mono_Display({
  subsets: ["latin"],
  weight: ["400"],
});

const majorFont = majorMonoDisplay.className;

const inter = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const interFont = inter.className;

export { majorFont, interFont };