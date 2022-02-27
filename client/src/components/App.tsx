import { Link, Route, Routes } from "react-router-dom";
import Customers from "./Customers";
import styles from "../styles/App.module.scss";
import Navigation from "./Navigation";
import CustomerForm from "./CustomerForm";
import Raining from "./Raining";
import TopFour from "./TopFour";
function App() {
  return (
    <div className={styles.main}>
      <h1 className={styles.title}><Link to="/">☔️ Fake Umbrella ☔️</Link></h1>
      <h4 className={styles.title}>We keep you dry!</h4>
      <Navigation />
      <Routes>
        <Route path="/" element={<h2 style={{"textAlign":"center"}}>Welcome to Fake Umbrella!</h2>} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/:id" element={<CustomerForm />} />
        <Route path="/newcustomer" element={<CustomerForm />} />
        <Route path="/raining" element={<Raining />} />
        <Route path="/topfour" element={<TopFour />} />
      </Routes>
    </div>
  );
}

export default App;
