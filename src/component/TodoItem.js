import React, { useContext } from 'react';
import { TodoDispatchContext } from '../App';
import './TodoItem.css';

//TodoItem은 사용자가 등록한 할 일 아이템의 개수만큼 랜더링함.
//TodoList의 자식 컴포넌트이므로 아이템 추가, 제거, 체크박스 클릭, 검색폼에 검색어 입력 등의 상황에서 리렌더 됨.
//최적화를 위해 TodoItem 컴포넌트는 개별 아이템 체크박스에서 완료/미완료를 토글하는 경우 아니면 리렌더 필요 x
const TodoItem = ({ id, content, isDone, createdDate }) => { //Props 구조 분해 할당
    console.log(`${id} TodoItem update`);
    const { onUpdate, onDelete } = useContext(TodoDispatchContext);

    const onChangeCheckbox = () => {
        //체크박스를 틱 했을 때 호출할 함수로 onUpdate를 호출하고 인수로 현재 틱이 발생한 할 일 아이템의 id를 전달함
        onUpdate(id);
    };
    const onClickDelete = () => {
        onDelete(id);
    }

    return (
        <div className='TodoItem'>
            <div className='checkbox_col'>
                <input onChange={onChangeCheckbox} checked={isDone} type="checkbox" />
            </div>
            <div className='title_col'>{content}</div>
            <div className='date_col'>{new Date(createdDate).toLocaleDateString()}</div>
            <div className='btn_col'>
                <button onClick={onClickDelete}>삭제</button>
            </div>
        </div>
    );
};

export default React.memo(TodoItem);

/*
    최적화 기능
    -React.Memo()
    메모제이션 기법으로 컴포넌트가 불필요하게 리렌더되는 상황 방지 가능
    즉, 컴포넌트가 모든 상황에서 리렌더 되지 않도록 강화함으로써 서비스를 최적화 하는 도구.
    인수로 전달된 컴포넌트를 메모이제이션된 컴포넌트로 만들어 반환하며 Props가 메모이제이션의 기준이 됨. 즉, React.memo가 반환하는 컴포넌트는 부모 컴포넌트에서 전달된 Props가 변경되지 않는 한 리렌더 되지 않음.
    const memoizedComp = React.memo(Comp); //Comp는 메모이제이션하려는 컴포넌트

    //함수 컴포넌트 선언과 동시에 메모이제이션 하기
    const CompA = React.memo( ( ) =>{
        console.log("컴포넌트가 활성되었습니다.");
        return <div>CompA</div>;
    })

    //판별 함수를 인수로 전달해 Props의 특정 값만으로 리렌더 여부 판단하기
    const Comp = ( { a, b, c } ) => {
        console.log("컴포넌트가 활성되었습니다.");
        return <div>CompA</div>; 
    };

    function areEqual(prevProps, nextProps) { //판별함수. prevProps는 이전 Props 값, nextProps는 새롭게 바뀐 Props 값
        if (prevProps.a === nextProps.a) {
            return true; //리렌더 x
        } else {
            return false; //리렌더 진행
        }
    }

    *선행 이해*
    1.고차 컴포넌트
    Higher Order Component(HOC)는 컴포넌트의 기능을 다시 사용하기 위한 리액트의 고급 기술로, 
    useMemo, useEffect처럼 use 키워드가 앞에 붙는 리액트 훅과는 다름.
    인수로 전달된 컴포넌트에 어떤 기능을 추가하여 새로운 컴포넌트로 반환하는 함수.
    즉, 강화된 컴포넌트를 반환하는 함수

    2.횡단 관심사
    크로스 커딩 관심사(Cross-Cutting Concerns)로 비즈니스 로직과 구분되는 공통 기능을 지칭함.
    (비즈니스 로직 : 해당 컴포넌트가 존재하는 핵심 기능을 표현할 때 사용)
    주로 로깅, 데이터베이스 접속, 인가 등 여러 곳에서 호출해 사용하는 코드를 뜻함.
    컴포넌트의 핵심 기능(비즈니스 로직)을 세로로 배치한다고 하면, 여러 컴포넌트에서 공통으로 사용하는 기능은 가로로 배치함. 즉, 공통 기능들이 핵심 컴포넌트들을 마치 횡단하는 모습임.
    여러 컴포넌트에서 횡단 관심사를 작성할 경우 중복 코드를 만드는 요인이 되며, 이는 고차 컴포넌트를 이용해 횡단 관심사 코드를 함수로 분리 가능함.

    보통 고차 컴포넌트에 인수로 전달되는 컴포넌트를 '래핑된 컴포넌트', 고차 컴포넌트가 반환하는 컴포넌트를 '강화된 컴포넌트' 라고 함.
*/