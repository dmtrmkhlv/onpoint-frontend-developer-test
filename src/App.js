import styles from "./styles/App.module.css";

import { Slider } from "./components";

function App() {
  return (
    <div className={styles.Wrapper}>
      <div className={styles.App}>
        <Slider />
      </div>
    </div>
  );
}

export default App;
