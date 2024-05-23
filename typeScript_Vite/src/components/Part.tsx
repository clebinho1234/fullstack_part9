import { CoursePart } from "../types";

const assertNever = (value: never): never => {
    throw new Error(
        `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
};

const Part = (coursePart: CoursePart) => {
    switch(coursePart.kind) {
        case('basic'):
            return(
                <li><i> {coursePart.description} </i></li>
            );
        case('group'):
            return(
                <li> project exercises {coursePart.groupProjectCount} </li>
            );
        case('background'):
            return(
                <>
                    <li><i> {coursePart.description} </i></li>
                    <li> submit to {coursePart.backgroundMaterial} </li>
                </>
            );
        case('special'):
        return(
            <>
                <li><i> {coursePart.description} </i></li>
                <li> required skills: {coursePart.requirements.join(', ')} </li>
            </>
        );
        default:
            return assertNever(coursePart);
    }
};

export default Part