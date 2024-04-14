import React, { useCallback, useMemo, useReducer, useRef } from "react";
import './App.css';
import Header from './component/Header';
import TodoEditor from './component/TodoEditor';
import TodoList from './component/TodoList';

const mockTodo = [
  {
    id: 0,
    isDone: false,
    content: "React 공부하기",
    createdDate: new Date().getTime(),
  },
  {
    id: 1,
    isDone: false,
    content: "빨래 널기",
    createdDate: new Date().getTime(),
  },
  {
    id: 2,
    isDone: false,
    content: "노래 연습하기",
    createdDate: new Date().getTime(),
  },
];

// export const TodoContext = React.createContext(); //context는 컴포넌트 밖에 생성해야함
// 리렌더 재설계를 위해 위 코드를 리팩토링 하는 코드
export const TodoStateContext = React.createContext();
export const TodoDispatchContext = React.createContext();

function reducer(state, action) {
  //함수 dispatch 호출해 인수로 action 객체 전달하면 함수 reducer의 반환값으로 state 엽데이트 되어 할 일 아이템 추가됨
  switch (action.type) { //action 객체의 type 별로 다른 상태 변화 코드 수행
    case "CREATE": {
      return [action.newItem, ...state];
      //action 객체의 newItem에는 추가할 아이템이 저장되어 있음.
      //기존 할 일 아이템에 action 객체의 아이템이 추가된 새 배열 반환함
    }
    case "UPDATE":
      return state.map((item) =>
        item.id === action.targetId
          ? { ...item, isDone: !item.isDone }
          : item
      );
    case "DELETE":
      return state.filter(
        (item) => item.id !== action.targetId
      );
    default:
      return state;
  }
};

function App() {

  const [todo, dispatch] = useReducer(reducer, mockTodo);
  const idRef = useRef(3); //새로 생성되는 아이템의 id 중복 막기 위함.
  
  const onCreate = (content) => {
    dispatch({ //새 할일 아이탬 생성을 위한 함수 dispatch 호출
      type: "CREATE",
      newItem: {
        id: idRef.current,
        content,
        isDone: false,
        createdDate: new Date().getTime(),
      },
    });
    idRef.current += 1;
  };

  const onUpdate = useCallback((targetId) => {
    //TodoItem 체크박스에 틱 발생시 호출되는 함수. 어떤 아이템에서 틱 발생했는지 알기 위해 targetId 전달받음
    dispatch({
      type: "UPDATE",
      targetId,
    });
  }, []);

  const onDelete = useCallback((targetId) => {
    dispatch({
      type: "DELETE",
      targetId: targetId,
    });
  }, []);

  const memoizedDispatches = useMemo(() => {
    return { onCreate, onUpdate, onDelete };
  }, []);

  return (
    <div className='App'>
      {/*<TestComp />*/}
      <Header />
      {/* value로 Props를 전달 */}
      <TodoStateContext.Provider value={todo}>
        {/* 값을 전달하기 위해 Props를 객체로 설정하며 이 객체는 Context에 소속된 컴포넌트에 공급할 모든 값을 담음 .
            따라서 TodoContext 하위에 배치된 컴포넌트는 다른 경로로 Props를 받을 필요 x*/}
        <TodoDispatchContext.Provider value={memoizedDispatches}>
          <TodoEditor />
          {/* Props로 TodoEditor에 함수 전달 */}
          <TodoList />
        </TodoDispatchContext.Provider>
      </TodoStateContext.Provider>
    </div>
  );
}

export default App;


/*
  useCallback

  컴포넌트가 리렌더될 때 내부에 작성된 함수를 다시 생성하지 않도록 메모이제이션하는 리액트 훅
  const memoizedFunc = useCallback(func, deps) //(콜백함수, 의존성 배열)을 인수로 제공받아 메모이제이션 된 함수를 반환함

  의존성 배열에 담긴 값이 바뀌면 첫 번째 인수로 전달한 콜백 함수를 다시 만들어 반환함.
  첫 번째 인수로 전달한 콜백 함수를 어떤 경우에도 다시 생성되지 않게 하려면 의존성 배열을 빈 배열로 전달하기

  const memoizedFunc = useCallback(func, [] )
  첫번째 인수로 전달한 콜백 함수에서 State 변수에 접근하는 경우 문제 발생 가느성 있음.

  const memoizedFunc = useCallback( ( ) => {
    setState( [newItem, ...state]);
  }, [ ] )

  useCallback에서 전달한 콜백함수에서 State 변수에 접근하면 컴포넌트를 마운트할 때의 값인 State의 초기값이 반환됨.
  빈배열을 전달받아서 콜백 함수가 컴포넌트 마운트 시점 이후에는 다시 생성되지 않기 때문으로 마운트 할 때의 State값만 사용 가능.
  즉, useCallback으로 래핑된 함수는 State의 변화를 추적하지 못하므로 의도치 않은 동작 유발 가능.
  이때는 setState의 인수로 콜백함수를 전달하는 리액트의 '함수형 업데이트'  기능 사용하면 됨.

  const onCreate = useCallback ( ( ) => {
    setState( (state) => [ newItem, ...state ] );
  }, [ ] );

  setState에서 콜백 함수 전달할 경우 함수형 업데이트를 사용할 수 있고, 이 함수는 항상 최신 State 값을 매개변수로 저장하며 콜백 함수가 반환한 값은 새로운 State 값이 되어 업데이트됨.

  단, useReducer가 반환하는 함수 dispatch는 ㅎ마수 reducer를 호출하는데, 이 reducer는 항상 최신 State를 인수로 받음
  따라서 useReducer 이용할 경우 함수형 업데이트 사용할 필요 x
*/