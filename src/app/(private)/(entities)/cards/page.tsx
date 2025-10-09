"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";

import WhiteContainer from "@/components/white-container/WhiteContainer";
import TopDate from "@/components/top-date/TopDate";
import config from "@/config";
import VBox from "@/components/box/VBox";

import styles from "./styles.module.css"
import HBox from "@/components/box/HBox";
import { convertToMoneyFormat } from "@/utils/numberFunctions";

type Card = {
  id: number;
  name: string;
  limit: number;
  closeDay: string;
  dueDay: string
}



export default function Cards() {
  const [cards, setCards] = useState([]);
  const [date, setDate] = useState(new Date())
  
  const getMonth = () => {
    return String(date.getMonth() +1).padStart(2, "0");
  }

  const getCards = async () => {
    try {
      const response = await config.getCards(date)
      setCards(response.data)
    } catch (e) {
      console.log(e)
    }
  }

  console.log(cards)

  useEffect(() => {
    (async () => getCards()
    )()
  }, [date])


  return (
    <>
      <TopDate date={date} setDate={setDate} />
      <WhiteContainer title="Cartões">
        <Link href={"/cards/new-card"}>
          <FaPlusCircle className={styles.addIcon} />
        </Link>

        <VBox>
          {cards.map((card: Card, index) => (
            <VBox className={styles.containerCard}>
              <h2>{card.name}</h2>
              <HBox className={styles.cardRow}>
                <p>Fechamento:</p>
                <p>{card.closeDay}/{getMonth()}</p>
              </HBox>
              <HBox className={styles.cardRow}>
                <p>Vencimento: </p>
                <p>{card.dueDay}/{getMonth()}</p>
              </HBox>
              <HBox className={styles.cardRow}>
                <p>Limite: </p>
                <p>{convertToMoneyFormat(card.limit)}</p>
              </HBox>
            </VBox>
          ))}
        </VBox>

      </WhiteContainer>
    </>
  )
}