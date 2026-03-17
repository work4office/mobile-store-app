import { useRef } from "react";
import HomeChild, { type counterResetRef } from "./homeChild";

const Home = () => {
  // Create a ref to access the reset functions in HomeChild
  const resetCounterRef = useRef<counterResetRef>(null);
  return (
    <main className="home">
      <h1>Welcome to Book Tour</h1>
      <p>Start building your home page content here.</p>
      <HomeChild ref={resetCounterRef} />
      <button onClick={() => resetCounterRef.current?.resetCounter()}>Reset Counter</button>
      <button onClick={() => resetCounterRef.current?.resetReducerCounter()}>Reset Reducer Counter</button>
    </main>
  );
};

export default Home;