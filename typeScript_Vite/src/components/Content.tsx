import { CoursePart } from "../types";
import Part from "./Part";

interface ContentProps {
    courseParts: CoursePart[];
}

const Content = (props: ContentProps) => {
    return (
        <div>
        {props.courseParts.map(part => (
            <ul key={part.name} style={{ listStyle: 'none', padding: 0 }}>
                <li><b> {part.name} {part.exerciseCount} </b></li>
                {Part(part)}
            </ul>
        ))}
        </div>
    )
};

export default Content