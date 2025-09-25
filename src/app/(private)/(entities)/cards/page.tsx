import WhiteContainer from "@/components/white-container/WhiteContainer";
import Link from "next/link";

export default function Cards(){
  return(
    <WhiteContainer title="Cartões">
        <Link href={"/cards/new-card"}>Novo</Link>
      {/* <button> */}
      {/* </button> */}
    </WhiteContainer>
  )
}