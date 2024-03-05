export const Course = ({ course }) => {
  return (
    <div>
      <Header courseName={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts}/>
    </div>
  );
}

const Total = ({ parts }) => {
  const total = parts.reduce((sum, coursePart) => sum + coursePart.exercises, 0);
  return <p><b>total of {total} exercises</b></p>;
};

const Header = ({ courseName }) => {
  return (
    <h2>{courseName}</h2>
  );
};

const Content = ({ parts }) => {
  return parts.map(part => <Part key={part.id} name={part.name} exercises={part.exercises}/>);
};

const Part = ({ name, exercises }) => {
  return <p>{name} {exercises}</p>
};