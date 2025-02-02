type Question = {
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
};

const QuestionComponent = ({ question }: { question: Question }) => {
    return (
      <div>
        <h3>{question.text}</h3>
        <button>{question.option_a}</button>
        <button>{question.option_b}</button>
        <button>{question.option_c}</button>
      </div>
    );
  };