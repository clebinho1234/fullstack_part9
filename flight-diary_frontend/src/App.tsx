import { useEffect, useState } from "react";
import { DiaryEntry } from "./types";
import { getAllDiaries } from "./diaryService";
import Content from "./components/Content";
import NewDiaryEntryForm from "./components/NewDiaryEntryForm";
import Notify from "./components/Notify";

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getAllDiaries().then(data => {
      setDiaries(data)
    })
  }, []);

  const handleDiaries = (data: DiaryEntry) => {
    setDiaries(diaries.concat(data))
  };

  const notify = (message: string) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage('')
    }, 10000)
  };

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <NewDiaryEntryForm handleDiaries={handleDiaries} setError={notify} />
      <Content diaries={diaries} />
    </div>
  )
};

export default App