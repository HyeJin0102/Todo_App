import { useContext, useRef, useState } from 'react';
import { TodoDispatchContext } from '../App';
import './TodoEditor.css';

const TodoEditor = ( ) => {

    const { onCreate } = useContext(TodoDispatchContext);
    const [content, setContent] = useState("");
    const onChangeContent = (e) => {
        setContent(e.target.value);
    };
    const inputRef = useRef(); //입력 폼을 제어할 객체 inputRef 생성

    const onSubmit = () => {
        if (!content) {
            //content가 빈 문자열일 경우 inputRef가 현잿값(current)으로 저장한 요소에 포커스됨
            inputRef.current.focus();
            return;
        }
        onCreate(content); //onCreate 함수 호출 하고 인수로 content 값 전달
        setContent("");
    };
    const onKeyDown = (e) => {
        if (e.keyCode === 13) {
            onSubmit();
        }
    };

    return (
        <div className='TodoEditor'>
            <h4>새로운 Todo 작성하기</h4>
            <div className='editor_wrapper'>
                <input
                    ref={inputRef}
                    value={content}
                    onChange={onChangeContent}
                    onKeyDown={onKeyDown}
                    placeholder='새로운 Tood...' />
                <button onClick={onSubmit}>추가</button>
            </div>
        </div>
    );
};

export default TodoEditor;