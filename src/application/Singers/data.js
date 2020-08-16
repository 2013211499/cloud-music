import React, { createContext, useReducer } from 'react';
import { fromJS } from 'immutable';

export const CategoryDataContext = createContext({});

export const CHANGE_CATEGORY = 'singers/CHANGE_CATEGORY';
export const CHANGE_ALPHA = 'singers/CHANGE_ALPHA';
export const CHANGE_TYPE = 'singers/CHANGE_TYPE';
export const CHANGE_AREA = 'singers/CHANGE_AREA';

const reducer = (state, action) => {
  switch (action.type) {
    case CHANGE_CATEGORY:
      return state.set('category', action.data);
    case CHANGE_ALPHA:
      return state.set('alpha', action.data);
    case CHANGE_TYPE:
      return state.set('type', action.data);
    case CHANGE_AREA:
      return state.set('area', action.data);
    default:
      return state;
  }
};

// Provider组件
export const Data = (props) => {
  // useReducer第二个参数传入初始值
  const [data, dispatch] = useReducer(
    reducer,
    fromJS({
      category: '',
      alpha: '',
      type: -1,
      area: -1,
    })
  );
  return (
    <CategoryDataContext.Provider value={{ data, dispatch }}>
      {props.children}
    </CategoryDataContext.Provider>
  );
};
