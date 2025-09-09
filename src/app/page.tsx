import { ClipLoader } from "react-spinners";

import styles from "./style.module.css"


export default function Start() {
  return (
    <div className={styles.container}>
      <ClipLoader size="100" color="#16A34A"/>
    </div>
  );
}
