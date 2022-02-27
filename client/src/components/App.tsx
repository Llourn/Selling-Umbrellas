import { Route, Routes } from "react-router-dom";
import Customers from "./Customers";
import styles from "../styles/App.module.scss";
import Navigation from "./Navigation";
import CustomerForm from "./CustomerForm";
import Raining from "./Raining";
function App() {
  return (
    <div className={styles.main}>
      <h1 className={styles.title}>☔️ Umbrella App ☔️</h1>
      <Navigation />
      <Routes>
        <Route path="/" element={<h2>Welcome to the Umbrella App.</h2>} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/:id" element={<CustomerForm />} />
        <Route path="/newcustomer" element={<CustomerForm />} />
        <Route path="/raining" element={<Raining />} />
      </Routes>
    </div>
  );
}

export default App;
