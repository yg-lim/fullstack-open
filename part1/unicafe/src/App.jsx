import { useState } from 'react'

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>;
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [ total, setTotal ] = useState(0);
  const [ average, setAverage ] = useState(0);
  const [ positive, setPositive ] = useState(0);

  const handleGoodClick = () => {
    const newGood = good + 1;
    setGood(newGood);

    const newTotal = newGood + neutral + bad;
    const newAverage = (newGood - bad) / newTotal;
    const newPositive = newGood / newTotal;

    setTotal(newTotal);
    setAverage(newAverage);
    setPositive(newPositive * 100);
  };

  const handleNeutralClick = () => {
    const newNeutral = neutral + 1;
    setNeutral(newNeutral);

    const newTotal = good + newNeutral + bad;
    const newAverage = (good - bad) / newTotal;
    const newPositive = good / newTotal;

    setTotal(newTotal);
    setAverage(newAverage);
    setPositive(newPositive * 100);
  };

  const handleBadClick = () => {
    const newBad = bad + 1;
    setBad(newBad);

    const newTotal = good + neutral + newBad;
    const newAverage = (good - newBad) / newTotal;
    const newPositive = good / newTotal;

    setTotal(newTotal);
    setAverage(newAverage);
    setPositive(newPositive * 100);
  };

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button handleClick={handleGoodClick} text="good"/>
      <Button handleClick={handleNeutralClick} text="neutral" />
      <Button handleClick={handleBadClick} text="bad" />
      <h1>statistics</h1>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
      <p>all {total}</p>
      <p>average {average}</p>
      <p>positive {positive}%</p>
    </div>
  )
}

export default App