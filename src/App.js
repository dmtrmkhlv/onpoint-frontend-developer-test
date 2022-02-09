import styles from "./styles/App.module.css";

import { Slider } from "./components";

function App() {
  return (
    <div className={styles.wrapper}>
      <Slider />
    </div>
  );
}

export default App;
