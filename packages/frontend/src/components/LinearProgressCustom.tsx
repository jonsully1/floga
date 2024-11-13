import { LinearProgress, linearProgressClasses, styled } from "@mui/material";

export default function LinearProgressCustom({ borderColors }: { borderColors: string[] }) {
  return styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: "#000",
      ...theme.applyStyles("dark", {
        backgroundColor: "#000",
      }),
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundImage: `linear-gradient(90deg, ${borderColors[0]}, ${borderColors[1]})`,
    },
  }));
}
