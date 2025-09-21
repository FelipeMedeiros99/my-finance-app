"use client"

import React, { useEffect, useState, useCallback } from "react"
import { FaEdit, FaPlusCircle } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { SubmitHandler, useForm } from "react-hook-form";

import config from "@/config"

import {
  calculateConfirmedAndTotalsAtIncomesAndExpenses,
  calculateFullTotalsFromAllAccountsTransactions,
  convertToMoneyFormat,
  convertToNumberFormat
} from "@/utils/numberFunctions";

import WhiteContainer from "@/components/white-container/WhiteContainer"
import Input from "@/components/input/Input";
import Modal from "@/components/modal/Modal";
import TopDate from "@/components/top-date/TopDate";

import styles from "./style.module.css"

import { rules } from "./const";
import { Accounts as AccountType } from "@/components/transaction-form/types";

type FormValues = {
  id: number | null;
  name: string;
  openingBalance: string | number;
}

const AccountCard = ({ account, onEdit, onDelete }: { account: AccountType, onEdit: () => void, onDelete: () => void }) => {
  const accountBalanceTotals = account.transaction 
    ? calculateConfirmedAndTotalsAtIncomesAndExpenses(account.transaction) 
    : { income: { confirmed: 0, total: 0 }, expense: { confirmed: 0, total: 0 } };
  
  const currentBalance = accountBalanceTotals.income.confirmed - accountBalanceTotals.expense.confirmed;
  const predictedBalance = accountBalanceTotals.income.total - accountBalanceTotals.expense.total;

  const BalanceRow = ({ label, value, isSummary = false }: { label: string, value: number, isSummary?: boolean }) => (
    <div className={isSummary ? `${styles.balanceRow} ${styles.summary}` : styles.balanceRow}>
      <span>{label}</span>
      <span className={styles.balanceValue}>{convertToMoneyFormat(value)}</span>
    </div>
  );

  return (
    <article className={styles.accountCard}>
      <header className={styles.cardHeader}>
        <h3>{account.name}</h3>
        <div className={styles.cardIcons}>
          <FaEdit onClick={onEdit} />
          <AiFillDelete onClick={onDelete} />
        </div>
      </header>
      <div className={styles.cardBody}>
        <BalanceRow label="Saldo Atual:" value={currentBalance} isSummary />
        <BalanceRow label="Saldo Previsto:" value={predictedBalance} isSummary />
        <hr className={styles.divider} />
        <div className={styles.detailsGrid}>
          <BalanceRow label="Receitas Confirmadas:" value={accountBalanceTotals.income.confirmed} />
          <BalanceRow label="Receitas Previstas:" value={accountBalanceTotals.income.total} />
          <BalanceRow label="Despesas Confirmadas:" value={accountBalanceTotals.expense.confirmed} />
          <BalanceRow label="Despesas Previstas:" value={accountBalanceTotals.expense.total} />
        </div>
      </div>
    </article>
  );
};


const AccountForm = ({ onSubmit, onCancel, initialData }: { onSubmit: SubmitHandler<FormValues>, onCancel: () => void, initialData: FormValues }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    defaultValues: initialData
  });

  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formField}>
        <label htmlFor="accountName">Título:</label>
        <Input 
          id="accountName"
          {...register("name", rules.name)} 
          placeholder="Ex: Conta Corrente" 
        />
        {errors.name && <span className={styles.errorMessage}>{errors.name.message}</span>}
      </div>
      <div className={styles.formField}>
        <label htmlFor="openingBalance">Saldo inicial:</label>
        <Input 
          id="openingBalance"
          type="number"
          step="0.01"
          {...register("openingBalance", rules.openingBalance)} 
          placeholder="0.00" 
        />
        {errors.openingBalance && <span className={styles.errorMessage}>{errors.openingBalance.message}</span>}
      </div>
      <div className={styles.formButtons}>
        <button type="button" onClick={onCancel} className="btn danger">Cancelar</button>
        <button type="submit" className="btn success">Salvar</button>
      </div>
    </form>
  );
};


export default function Accounts() {
  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<FormValues>({ id: null, name: "", openingBalance: 0 });
  const [date, setDate] = useState(new Date());
  const [totals, setTotals] = useState({ predicted: 0, total: 0 });

  const getAccounts = useCallback(async () => {
    try {
      const response = await config.getAccounts(`date=${date}`);
      setAccounts(response?.data || []);
    } catch (e) {
      console.error("Erro ao buscar contas:", e);
    }
  }, [date]);

  useEffect(() => {
    getAccounts();
  }, [getAccounts]);

  useEffect(() => {
    setTotals(calculateFullTotalsFromAllAccountsTransactions(accounts));
  }, [accounts]);

  const handleOpenModalForCreate = () => {
    setSelectedAccount({ id: null, name: "", openingBalance: 0 });
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (account: AccountType) => {
    setSelectedAccount({
      id: account.id,
      name: account.name,
      openingBalance: convertToNumberFormat(account.openingBalance)
    });
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleDeleteAccount = async (id: number) => {
    if (window.confirm("Tem certeza que deseja deletar esta conta?")) {
      try {
        await config.deleteAccount(id);
        await getAccounts();
      } catch (e) {
        console.error("Erro ao deletar conta:", e);
      }
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const payload = {
      ...data,
      openingBalance: Number(data.openingBalance)
    };

    try {
      if (payload.id) {
        await config.editAccount(payload.id, payload.name, payload.openingBalance);
      } else {
        await config.createAccount(payload.name, payload.openingBalance);
      }
      await getAccounts();
      handleCloseModal();
    } catch (e) {
      console.error("Erro ao salvar conta:", e);
    }
  };

  return (
    <React.Fragment>
      <TopDate date={date} setDate={setDate} />
      
      <WhiteContainer title="Contas" theme={"neutral"}>
        <FaPlusCircle className={styles.addIcon} onClick={handleOpenModalForCreate} />

        <div className={styles.accountsContainer}>
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onEdit={() => handleOpenModalForEdit(account)}
                onDelete={() => handleDeleteAccount(account.id)}
              />
            ))
          ) : (
            <p className={styles.emptyMessage}>Nenhuma conta encontrada.</p>
          )}
        </div>

        <footer className={styles.balanceFooter}>
          <div className={styles.totalBalance}>
            <span>Saldo Total:</span>
            <span className={totals.total > 0 ? styles.green : totals.total < 0 ? styles.red : ""}>
              {convertToMoneyFormat(totals.total)}
            </span>
          </div>
          <div className={styles.predictedBalance}>
            <span>Previsto:</span>
            <span className={totals.predicted > 0 ? styles.green : totals.predicted < 0 ? styles.red : ""}>
              {convertToMoneyFormat(totals.predicted)}
            </span>
          </div>
        </footer>
      </WhiteContainer>

      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen} title={selectedAccount.id ? "Editar Conta" : "Nova Conta"} theme={"neutral"}>
        <AccountForm 
          onSubmit={onSubmit}
          onCancel={handleCloseModal}
          initialData={selectedAccount}
        />
      </Modal>
    </React.Fragment>
  );
}

// "use client"

// import React, { useEffect, useState } from "react"
// import { FaEdit, FaPlusCircle } from "react-icons/fa";
// import { AiFillDelete } from "react-icons/ai";
// import { SubmitHandler, useForm } from "react-hook-form";

// import config from "@/config"

// import { calculateConfirmedAndTotalsAtIncomesAndExpenses, calculateConfirmedBalance, calculateTotalBalance, calculateFullTotalsFromAllAccountsTransactions, convertToMoneyFormat, convertToNumberFormat, convertToStringNumber } from "@/utils/numberFunctions";
// import WhiteContainer from "@/components/white-container/WhiteContainer"
// import Input from "@/components/input/Input";
// import Modal from "@/components/modal/Modal";
// import TopDate from "@/components/top-date/TopDate";

// import styles from "./style.module.css"
// import { rules } from "./const";
// import { Accounts as AccountsType } from "@/components/transaction-form/types";

// type Form = {
//   id: number | null;
//   name: string;
//   openingBalance: string | number;
// }

// type AccountModel = {
//   id: number;
//   name: string;
//   openingBalance: string;
// }


// export default function Accounts() {
//   const [accounts, setAccounts] = useState([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [date, setDate] = useState(new Date());
//   const [totals, setTotals] = useState({ predicted: 0, total: 0 })

//   const { register, setValue, setError, handleSubmit, watch, formState: { errors } } = useForm<Form>({
//     defaultValues: {
//       name: "",
//       openingBalance: "R$ 0.00",
//       id: null
//     }
//   });

//   const openingBalance = watch("openingBalance");

//   const onSubmit: SubmitHandler<Form> = async (data: Form) => {
//     data.openingBalance = convertToNumberFormat(String(data.openingBalance))

//     try {
//       if (!data.id) {
//         await config.createAccount(data.name, data.openingBalance)
//         await getAccount()
//         cancelModalFunction()
//       } else {
//         await config.editAccount(data.id, data.name, data.openingBalance)
//         await getAccount()
//         cancelModalFunction()
//       }
//     } catch (e) {
//       console.log(e)
//     }
//   }

//   const openModal = () => {
//     setIsModalVisible(true);
//     setValue("name", "");
//     setValue("openingBalance", "0");
//     setValue("id", null);
//     setError("name", { type: "required", message: "" })
//   }

//   const getAccount = async () => {
//     try {
//       const account = await config.getAccounts(`date=${date}`)
//       setAccounts(account?.data);
//     } catch (e) {
//       console.log(e)
//       // alert("Erro ao tentar buscar as categorias")
//     }
//   }

//   const updateTotals = () => {
//     setTotals(calculateFullTotalsFromAllAccountsTransactions(accounts));
//   }

//   const deleteAccount = async (id: number) => {
//     try {
//       await config.deleteAccount(id)
//       await getAccount()
//     } catch (e) {
//       console.log(e)
//       // alert("Erro ao tentar deletar a categoria")
//     }
//   }

//   const cancelModalFunction = () => {
//     setIsModalVisible(false);
//     setValue("name", "");
//     setValue("openingBalance", "0");
//     setValue("id", null);
//     setError("name", { type: "required", message: "" });
//   }

//   const editAccount = (account: AccountsType) => {
//     setValue("name", account.name);
//     setValue("openingBalance", account.openingBalance);
//     setValue("id", account.id);
//     setIsModalVisible(true);
//   }

//   useEffect(() => {
//     setValue("openingBalance", convertToStringNumber(String(openingBalance)))
//   }, [openingBalance, setValue])

//   useEffect(() => {
//     (async () => {
//       await getAccount()
//     })()
//   }, [date])

//   useEffect(() => {
//     updateTotals()
//   }, [accounts])

//   console.log(accounts)

//   const BalanceRow = ({label, value}: {label: string, value: number})=>{
//     return(
//       <div>
//         <span>{label}:</span>
//         <span>{convertToMoneyFormat(value)}</span>
//       </div>
//     )
//   }

//   return (
//     <React.Fragment>
//       <TopDate date={date} setDate={setDate} />
//       <WhiteContainer title="Contas" theme={"neutral"}>
//         <FaPlusCircle className={styles.icon} onClick={() => openModal()} />

//         <div className={styles.categoryContainer}>
//           {accounts &&
//             accounts.map((account: AccountsType) => {
//               let accountBalanceTotals = { income: { confirmed: 0, total: 0 }, expense: { confirmed: 0, total: 0 } }
//               if(account.transaction){
//                 accountBalanceTotals = calculateConfirmedAndTotalsAtIncomesAndExpenses(account.transaction)
//               }
//               return (
//                 <div key={account.id} className={styles.account}>
//                   <caption>{account.name}</caption>
//                   <BalanceRow label="Despesas confirmadas" value={accountBalanceTotals.expense.confirmed}/>
//                   <BalanceRow label="Despesas previstas" value={accountBalanceTotals.expense.total}/>
//                   <BalanceRow label="Receitas confirmadas" value={accountBalanceTotals.income.confirmed}/>
//                   <BalanceRow label="Receitas previstas" value={accountBalanceTotals.income.total}/>

//                   <p>Saldo atual: {convertToMoneyFormat(accountBalanceTotals.income.confirmed - accountBalanceTotals.expense.confirmed)}</p>
//                   <p>Saldo previsto: {convertToMoneyFormat(accountBalanceTotals.income.total - accountBalanceTotals.expense.total)}</p>
//                   <div className={styles.icons}>
//                     <FaEdit onClick={() => editAccount(account)} />
//                     <AiFillDelete onClick={() => deleteAccount(account?.id)} />
//                   </div>
//                 </div>
//               )
//             }
//             )
//           }
//         </div>

//         <div className={styles.balanceContainer}>
//           <p><label htmlFor="currentBalance">Total: </label><span className={totals.total > 0 ? `${styles.green} ${styles.strongText}` : totals.total < 0 ? `${styles.red} ${styles.strongText}` : ""} id="currentBalance">{convertToMoneyFormat(totals.total)}</span></p>
//           <p className={styles.weakText}><label htmlFor="predicted">Previsto:</label> <span className={totals.predicted > 0 ? styles.green : totals.predicted < 0 ? styles.red : ""} id="predicted">{convertToMoneyFormat(totals.predicted)}</span></p>
//         </div>
//       </WhiteContainer>




//       <Modal isOpen={isModalVisible} setIsOpen={setIsModalVisible} title="Nova conta" theme={"neutral"}>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <Input {...register("name", rules.name)} error={errors.name?.message} label="Título: " placeholder="Título da categoria" />
//           <Input {...register("openingBalance", rules.openingBalance)} error={errors.openingBalance?.message} label="Saldo inicial: " placeholder="Título da categoria" />
//           <div className={styles.containerButtons}>
//             <button type="button" onClick={cancelModalFunction} className="btn danger">Cancelar</button>
//             <button type="submit" className="btn success">Salvar</button>
//           </div>
//         </form>
//       </Modal>

//     </React.Fragment>
//   )
// }