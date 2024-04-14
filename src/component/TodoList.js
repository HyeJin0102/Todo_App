import { useContext, useMemo, useState } from 'react';
import { TodoStateContext } from '../App';
import TodoItem from "./TodoItem";
import "./TodoList.css";

const TodoList = () => { //props룰 구조 분해 할당

    const todo = useContext(TodoStateContext); //TodoContext에서 공급받은 값을 구조 분해 할당함. 이 값들이 기존 TodoList의 Props 대체함
    const storeData = useContext(TodoStateContext); // APP에서 객체 데이터가 아닌 todo 배열 그 자체를 전달함

    const [search, setSearch] = useState("")
    const onChangeSearch = (e) => {
        setSearch(e.target.value);
    };
    const getSearchResult = () => {
        return search === "" ? todo : todo.filter((it) => it.content.toLowerCase().includes(search.toLowerCase()));
        //현재 입력된 검색어가 없으면 todo 그대로 반환, 검색어 있으면 내용과 일치하는 아이템만 필터링해 반환함
    };

    /*  useMemo 사용 x
    해당 analyzeTodo의 경우 컴포넌트 내부에 선언된 함수로 렌더링 할 때마다 실행됨
    컴포넌트 렌더링의 경우 컴포넌트 함수 호출하는 작업과 동일
    
    const analyzeTodo = () => { //현재 State 변수 todo의 아이템 이용함
        console.log("analyzeTodo 함수 호출");
        const totalCount = todo.length;
        const doneCount = todo.filter((item) => item.isDone).length;
        const notDoneCount = totalCount - doneCount;
        return {
            totalCount,
            doneCount,
            notDoneCount,
        };
    };
    */

    /* useMemo
    특정 함수 호출시 그 함수의 반환값을 기억하였다가 같은 함수 다시 호출시 기억해 뒀던 값 반환하는 리액트 훅
    사용하면 함수의 반환값을 다시 구하는 불필요한 연산을 수행하지 않아 성능 최적화 가능.
    (메모제이션 : 함수의 연산 결과를 기억하는 행위)
    
    const value = useMemo(callback_콜백함수, deps_의존성배열);
    useMemo 함수 호출시 메모제이션 하려는 콜백 함수와 의존성 배열을 전달함. 
    호출된 useMemo는 의존성 배열에 담긴 값이 바뀌면 콜백 함수를 다시 실행하고 결과값 반환함.
    만일 두번째 인수로 전달된 의존성 배열의 값이 변하지 않으면 콜백함수는 호출되지 x        
    */
    const analyzeTodo = useMemo(() => {
        const totalCount = todo.length;
        const doneCount = todo.filter((item) => item.isDone).length;
        const notDoneCount = totalCount - doneCount;
        return {
            totalCount,
            doneCount,
            notDoneCount,
        };
    }, [todo])

    const { totalCount, doneCount, notDoneCount } = analyzeTodo;

    return (
        <div className="TodoList">
            <h4>TodoList🌱</h4>
            <div>
                <div>총 개수 : {totalCount}</div>
                <div>완료된 할 일 : {doneCount}</div>
                <div>아직 완료되지 못한 할 일 : {notDoneCount}</div>
            </div>
            <input
                value={search}
                onChange={onChangeSearch}
                className="searchbar"
                placeholder="검색어를 입력하세요" />
            <div className="list_wrapper">
                {getSearchResult().map((it) => (
                    <TodoItem key={it.id} {...it} />
                    // map 메서드의 콜백 함수가 TodoItem 컴포넌트에 현재 순회 중인 배열 요소 it의 모든 프로퍼티를 스프레드 연산자 이용해 Props로 전달받아 반환됨.
                    // todo에는 할 일 아이템 객체가 저장되어 있기 때문에 결과적으로 TodoItem 컴포넌트에는 객체 각각의 프로퍼티가 Props로 전달됨.
                ))}
                {/* todo에 저장된 모든 할 일을 <div>로 감싼 것과 동일 */}
            </div>
        </div>
    );
};

TodoList.defaultProps = {
    todo: [],
};

export default TodoList;