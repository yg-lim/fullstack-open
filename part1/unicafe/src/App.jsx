import { useState } from 'react'

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>;
};

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
};

const Statistics = ({ stats }) => {
  if (stats.total <= 0) return <p>No feedback given</p>

  return (
    <>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={stats.good} />
          <StatisticLine text="neutral" value={stats.neutral} />
          <StatisticLine text="bad" value={stats.bad} />
          <StatisticLine text="all" value={stats.total} />
          <StatisticLine text="average" value={stats.average} />
          <StatisticLine text="positive" value={stats.positive + "%"} />
        </tbody>
      </table>
    </>
  )
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
      <Statistics stats={{ good, neutral, bad, total, positive, average }}/>
    </div>
  )
}

export default App