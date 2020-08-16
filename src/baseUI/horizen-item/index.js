import React, { useState, useRef, useEffect, memo, forwardRef } from 'react';
import styled from 'styled-components';
import Scroll from '../scroll/index';
import { PropTypes } from 'prop-types';
import style from '../../assets/global-style';

const Horizen = (props) => {
  const { list, title, value } = props;
  const { handleClick } = props;

  const Category = useRef(null);

  useEffect(() => {
    let categoryDom = Category.current;
    let tagElems = categoryDom.querySelectorAll('span');
    let totalWidth = 0;
    Array.from(tagElems).forEach((ele) => {
      totalWidth += ele.offsetWidth;
    });
    categoryDom.style.width = `${totalWidth}px`;
  }, []);

  return (
    <Scroll direction={'horizental'}>
      <div ref={Category}>
        <List>
          <span>{title}</span>
          {list.map((item) => {
            return (
              <ListItem
                key={item.key}
                className={`${value === item.key ? 'selected' : ''}`}
                onClick={() => handleClick(item.key, item.type, item.area)}
              >
                {item.name}
              </ListItem>
            );
          })}
        </List>
      </div>
    </Scroll>
  );
};

const List = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  overflow: hidden;
  > span:first-of-type {
    display: block;
    flex: 0 0 auto;
    padding: 5px 0;
    margin-right: 5px;
    color: grey;
    font-size: ${style['font-size-m']};
  }
`;

const ListItem = styled.span`
  flex: 0 0 auto;
  font-size: ${style['font-size-m']};
  padding: 5px 8px;
  border-radius: 10px;
  &.selected {
    color: ${style['theme-color']};
    border: 1px solid ${style['theme-color']};
    opacity: 0.8;
  }
`;

Horizen.defaultProps = {
  list: [],
  value: '',
  title: '',
  handleClick: null,
};

Horizen.propTypes = {
  list: PropTypes.array,
  value: PropTypes.string,
  title: PropTypes.string,
  handleClick: PropTypes.func,
};

export default memo(Horizen);
