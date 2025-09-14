"use client"

import WhiteContainer from "@/components/white-container/WhiteContainer";
import Input from "@/components/input/Input";
import Select from "@/components/select/Select";

import styles from "./style.module.css";

export default function New() {
  return (
    <WhiteContainer theme="green" title="Nova Receita">

      <form className={styles.form}>
        <div className={styles.inputs}>
          <Input label="Descrição: " placeholder="Salário"/>
          <Input label="Valor: " placeholder="200,00"/>
          <Input label="Vencimento: " type="date" defaultValue={Date.now()}/>
          <Select label="Recorrência: " options={["Não recorrente", "Parcelado", "Fixo Mensal"]}/>
          <Select label="Categoria: " options={["Salários", "Vendas", "Benefícios"]} />
          <Select label="Conta: " options={["Nubank", "Santander", "Bradesco", "Carteira"]}/>
        </div>

        <button className="btn success">Salvar</button>
      </form>
    </WhiteContainer>
  )
}