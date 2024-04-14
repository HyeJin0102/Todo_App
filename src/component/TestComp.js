import { useReducer } from 'react';

/* useReducer
    useReducer의 경우 useState와 더불어 리액트 컴포넌트에서 state를 관리하는 리액트 훅.
    state 관리를 컴포넌트 내부가 아닌 외부에서 할 수 있음(상태 변화 코드를 컴포넌트 밖으로 분리 가능)
    이를 통해 가독성 향상시키고 유지보수의 난이도를 낮춰줌
*/
function reducer(state, action) { //첫번째 매개변수 state에는 현재 state값 저장, 두번째 매개변수 action에는 함수 dispatch 호출하면서 인수로 전달한 action 객체가 저장됨.
    switch (action.type) { //reduce의 return 값이 새로운 State의 값이 됨
        case "INCREASE":
            return state + action.date;
        case "DESCREASE":
            return state - action.date;
        case "INIT":
            return 0;
        default:
            return state;
    }
} //컴포넌트 밖에 만든 reducer

function TestComp() {
    /* useState
        상태 변화 코드(state 값을 변경하는 코드)인 onIncrease, onDecrease는 useState를 이용해 생성한
        state로 반드시 컴포넌트 안에 작성해야함.
    */
    //     const [count, setCount] = useState(0);

    //     const onIncrease = () => {
    //         setCount(count + 1);
    //     };

    //     const onDecrease = () => {
    //         setCount(count - 1);
    //     };

    const [count, dispatch] = useReducer(reducer, 0); //count는 state 변수, dispatch는 상태 변화 촉발 함수, useReducer(reducer, 0)는 생성자(상태 변화 함수, 초깃값)
    <div>
        <h4>테스트 컴포넌트</h4>
        <div>
            <bold>{count}</bold>
        </div>
        <div>
            {/* + or - 버튼 클릭시 함수 dispatch(상태 변화 필요시 촉발하는 함수) 호출하고 인수로 객체(date_state의 변경 정보 담고 있음(=action객체)) 전달 
                즉, useReducer가 반환하는 함수 dispatch를 호출하면 useReducer는 함수 reducer를 호출하고, 이 함수가 반환하는 값이 State를 업데이트함.
                type은 어떤 상황이 발생했는지 전달, date는 상태 변화에 필요한 값*/}
            <button onClick={() => dispatch({ type: "INCREASE", date: 1 })}>+</button>
            <button onClick={() => dispatch({ type: "DECREASE", date: 1 })}>-</button>
            <button onClick={() => dispatch({ type: "INIT" })}>0으로 초기화</button>
        </div>
    </div>
}

export default TestComp;