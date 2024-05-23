import { useState } from "react";
import { DiaryEntry, Visibility, Weather } from "../types"
import { createDiary } from "../diaryService";
import toNewDiaryEntry from "../utils";

interface FormProps {
    handleDiaries: (value: DiaryEntry) => void;
    setError: (value: string) => void;
}

const NewDiaryEntryForm = (props: FormProps) => {
    const [date, setDate] = useState('');
    const [selectedVisibility, setSelectedVisibility] = useState('');
    const [selectedWeather, setSelectedWeather] = useState('');
    const [comment, setComment] = useState('');
    const currentDate = new Date().toISOString().split('T')[0];

    const noteCreation = async (event: React.SyntheticEvent) => {
        event.preventDefault()
        const diaryToAdd = {
          date: date,
          visibility: selectedVisibility,
          weather: selectedWeather,
          comment: comment,
        };
        try {
            await createDiary(toNewDiaryEntry(diaryToAdd)).then(data => {
                props.handleDiaries(data)
              });
              setDate('');
              setSelectedVisibility('');
              setSelectedWeather('');
              setComment('');
        } catch(error){
            if (error instanceof Error) {
                props.setError("Error: " + error.message);
            } else {
                props.setError("An unknown error occurred.");
            }
        }
    };

    const handleVisibilityChange = (event:  React.ChangeEvent<HTMLInputElement>) => {
        setSelectedVisibility(event.target.value);
    };

    const handleWeatherChange = (event:  React.ChangeEvent<HTMLInputElement>) => {
        setSelectedWeather(event.target.value);
    };

    return(
        <div>
            <h2>Add new entry</h2>
            <form onSubmit={noteCreation}>
                <div>
                    <label htmlFor="date">Date:</label>
                    <input type="date" id="date" placeholder='YYYY-MM-DD' max={currentDate} value={date} onChange={(event) => setDate(event.target.value)} />
                </div>
                <div>
                    visibility: {' '}
                    {Object.values(Visibility).map(v => (
                        <label key={v}>
                            {v}  <input type='radio' id={v} name="visibility" checked={selectedVisibility === v} value={v} onChange={handleVisibilityChange} />
                        </label>
                    ))}
                </div>
                <div>
                    weather: {' '}
                    {Object.values(Weather).map(w => (
                        <label key={w}>
                            {w}  <input type='radio' id={w} name="weather" checked={selectedWeather === w} value={w} onChange={handleWeatherChange} />
                        </label>
                    ))}
                </div>
                <div>
                    <label htmlFor="comment">Comment:</label>
                    <input id="comment" value={comment} onChange={(event) => setComment(event.target.value)} />
                </div>
                <button type='submit'>add</button>
            </form>
        </div>
    )
};

export default NewDiaryEntryForm