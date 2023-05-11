import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { TbReportMoney } from "react-icons/tb";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useBudgets } from "../context/BudgetsContext";
import Expenses from "./Expenses";
import { totalExpenses } from "../utils/totalExpenses";
import { UserContext } from "../context/userContext";
import { db } from "../firebase/firebase";

const BudgetSlide = ({ budget }: DocumentData) => {
  const { deleteBudget } = useBudgets();
  const { userUid } = useContext(UserContext);
  const [expenses, setExpenses] = useState<DocumentData[]>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Subscribes to budgetExpenses to reflect deleted expense in real time
    let unsubscribe;
    if (userUid) {
      const ref = collection(
        db,
        "users",
        userUid,
        "budgets",
        budget.budgetId,
        "expenses"
      );
      const q = query(ref, orderBy("createdAt", "desc"));

      unsubscribe = onSnapshot(q, (snapshot) => {
        const expenseArr: DocumentData[] = [];
        snapshot.forEach((doc) => {
          expenseArr.push(doc.data());
        });
        setExpenses(expenseArr);
      });
    }

    // Unsubscribes when component unmounts
    return unsubscribe;
  }, []);

  return (
    <>
      <div
        onClick={() => setOpen(!open)}
        className="flex whitespace-nowrap md:whitespace-normal overflow-scroll md:overflow-visible justify-between px-4 items-center text-gray3 font-semibold overview-options shadow-md md:hover:scale-105 md:transition-transform md:cursor-pointer"
      >
        <div className="flex">
          <div>
            <TbReportMoney className="h-6 w-6" />
          </div>
          <div className="mx-2">{budget.budgetName}</div>
        </div>
        <div className="flex justify-center items-center">
          {expenses && (
            <span className="text-gray4">
              ₹{totalExpenses(expenses)} /{" "}
              <span className="text-gray3">₹{budget.max}</span>
            </span>
          )}
          <div
            className="mr-2 ml-2 md:ml-8"
            onClick={() => deleteBudget(budget?.budgetId)}
          >
            <RiDeleteBin5Line className="text-orange1 md:hover:scale-110 md:transition-transform md:cursor-pointer" />
          </div>
        </div>
      </div>
      {open && (
        <div className="h-fit flex flex-col bg-gray bg-opacity-70 mt-[-1rem] mb-1">
          <Expenses expenses={expenses} />
        </div>
      )}
    </>
  );
};

export default BudgetSlide;
