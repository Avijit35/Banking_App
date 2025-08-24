import Employeelayout from "../../Layout/Employeelayout";
import NewTransaction from "../../Shared/NewTransaction";
import TransactionTable from "../../Shared/TransactionTable";

const EmpTransaction = () => {
  //get userInfo from storage
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

  return (
    <Employeelayout>
      <NewTransaction />
      <TransactionTable query={{ branch: userInfo?.branch }} />
    </Employeelayout>
  );
};

export default EmpTransaction;
