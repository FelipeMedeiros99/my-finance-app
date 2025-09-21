'use client'

import React from "react";
import { ClipLoader } from "react-spinners";
import styles from "./style.module.css";

type Props = {
  children?: React.ReactNode;
  title: string;
  theme?: "green" | "red" | "neutral",
  isLoading?: boolean;
}

export default function WhiteContainer({ children, theme = "neutral", title, isLoading = false }: Props) {
  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <h3 className={styles.title}>{title}</h3>
      {isLoading ? (
        <div className={styles.spinnerContainer}>
          <ClipLoader size={50} color="var(--theme-color)" />
        </div>
      ) : (
        <div className={styles.content}>
          {children}
        </div>
      )}
    </div>
  )
}


// "use client"

// import React from "react";

// import { ClipLoader } from "react-spinners";

// import styles from "./style.module.css";

// type Props = {
//   children?: React.ReactNode;
//   title: string;
//   theme?: "green" | "red" | "neutral",
//   isLoading?: boolean;
// }

// export default function WhiteContainer({ children, theme = "neutral", title, isLoading = false }: Props) {
//   return (
//     <>
//       {isLoading &&
//         <div className={styles.spinnerContainer}>
//           <ClipLoader size="100px" color="#16A34A" />
//         </div>
//       }
//       {!isLoading &&
//         <div className={`${styles.container} ${styles[theme]}`}>
//           <h3 className={styles.title}>{title}</h3>
//           {children}
//         </div>
//       }
//     </>
//   )
// }