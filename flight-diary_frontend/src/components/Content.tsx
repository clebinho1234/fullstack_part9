import { DiaryEntry } from "../types"

interface ContentProps {
    diaries: DiaryEntry[];
}

const Content = (props: ContentProps) => {
    return(
        <div>
           <h2>Diary entries</h2>
            {props.diaries.map(diary =>
                <ul key={diary.id} style={{ listStyle: 'none', padding: 0 }}>
                    <li> <h3>{diary.date}</h3></li>
                    <li>visibility: {diary.visibility}</li>
                    <li>weather: {diary.weather}</li>
                </ul>
            )}
        </div>
    )
};

export default Content