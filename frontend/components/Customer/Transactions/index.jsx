import Customerlayout from "../../Layout/Customerlayout";
import TransactionTable from "../../Shared/TransactionTable";

const CustomerTransactions = () => {
  //get userInfo from storage
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

  return (
    <Customerlayout>
      <TransactionTable query={{ accountNo: userInfo?.accountNo }} />
    </Customerlayout>
  );
};

export default CustomerTransactions;
