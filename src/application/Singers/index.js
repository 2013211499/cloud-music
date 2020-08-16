import React, { useState, useRef, useEffect, useContext } from 'react';
import Horizen from '../../baseUI/horizen-item';
import Scroll from '../../baseUI/scroll/index';
import { categoryTypes, alphaTypes } from '../../api/config';
import { NavContainer, ListContainer, List, ListItem } from './style';
import {
  getSingerList,
  getHotSingerList,
  changeEnterLoading,
  changePageCount,
  refreshMoreSingerList,
  changePullUpLoading,
  changePullDownLoading,
  refreshMoreHotSingerList,
} from './store/actionCreators';
import { connect } from 'react-redux';
import LazyLoad, { forceCheck } from 'react-lazyload';
import {
  CategoryDataContext,
  CHANGE_ALPHA,
  CHANGE_CATEGORY,
  CHANGE_TYPE,
  CHANGE_AREA,
} from './data';

function Singers(props) {
  const {
    singerList,
    enterLoading,
    pullUpLoading,
    pullDownLoading,
    pageCount,
  } = props;
  const {
    getHotSingerDispatch,
    updateDispatch,
    pullUpRefreshDispatch,
    pullDownRefreshDispatch,
  } = props;
  // let [category, setCategory] = useState('');
  // let [alpha, setAlpha] = useState('');
  // let [type, setType] = useState(-1);
  // let [area, setArea] = useState(-1);
  const { data, dispatch } = useContext(CategoryDataContext);
  const { category, alpha, type, area } = data.toJS();

  const handlePullUp = () => {
    pullUpRefreshDispatch(
      category,
      alpha,
      category === '',
      pageCount,
      type,
      area
    );
  };

  const handlePullDown = () => {
    pullDownRefreshDispatch(category, alpha, type, area);
  };

  useEffect(() => {
    if (!singerList.size) {
      getHotSingerDispatch();
    }
  }, []);

  let handleUpdateAlpha = (val) => {
    // setAlpha(val);
    dispatch({ type: CHANGE_ALPHA, data: val });
    updateDispatch(category, val, type, area);
  };

  let handleUpdateCategory = (val, type, area) => {
    //setCategory(val);
    // setType(type);
    // setArea(area);
    dispatch({ type: CHANGE_CATEGORY, data: val });
    dispatch({ type: CHANGE_TYPE, data: type });
    dispatch({ type: CHANGE_AREA, data: area });
    updateDispatch(val, alpha, type, area);
  };
  return (
    <div>
      <NavContainer>
        <Horizen
          list={categoryTypes}
          title={'分类 (默认热门):'}
          handleClick={(val, type, area) =>
            handleUpdateCategory(val, type, area)
          }
          value={category}
        ></Horizen>
        <Horizen
          list={alphaTypes}
          title={'首字母:'}
          handleClick={(val) => handleUpdateAlpha(val)}
          value={alpha}
        ></Horizen>
      </NavContainer>
      <ListContainer>
        <Scroll
          pullUp={handlePullUp}
          pullDown={handlePullDown}
          pullUpLoading={pullUpLoading}
          pullDownLoading={pullDownLoading}
          onScroll={forceCheck}
        >
          {renderSingerList({ singerList })}
        </Scroll>
      </ListContainer>
    </div>
  );
}

const renderSingerList = ({ singerList }) => {
  singerList = singerList.toJS();
  return (
    <List>
      {singerList.map((item, index) => {
        return (
          <ListItem key={item.accountId + '' + index}>
            <div className='img_wrapper'>
              <LazyLoad
                placeholder={
                  <img
                    width='100%'
                    height='100%'
                    src={require('./singer.png')}
                    alt='music'
                  />
                }
              >
                <img
                  src={`${item.picUrl}?param=300x300`}
                  width='100%'
                  height='100%'
                  alt='music'
                />
              </LazyLoad>
            </div>
            <span className='name'>{item.name}</span>
          </ListItem>
        );
      })}
    </List>
  );
};

const mapStateToProps = (state) => ({
  singerList: state.getIn(['singers', 'singerList']),
  enterLoading: state.getIn(['singers', 'enterLoading']),
  pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
  pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
  pageCount: state.getIn(['singers', 'pageCount']),
});

const mapDispatchToProps = (dispatch) => {
  return {
    getHotSingerDispatch() {
      dispatch(getHotSingerList());
    },
    updateDispatch(category, alpha, type, area) {
      dispatch(changePageCount(0)); //由于改变了分类，所以pageCount清零
      dispatch(changeEnterLoading(true)); //loading，现在实现控制逻辑，效果实现放到下一节，后面的loading同理
      dispatch(getSingerList(category, alpha, type, area));
    },
    // 滑到最底部刷新部分的处理
    pullUpRefreshDispatch(category, alpha, hot, count, type, area) {
      dispatch(changePullUpLoading(true));
      dispatch(changePageCount(count + 1));
      if (hot) {
        dispatch(refreshMoreHotSingerList());
      } else {
        dispatch(refreshMoreSingerList(category, alpha, type, area));
      }
    },
    //顶部下拉刷新
    pullDownRefreshDispatch(category, alpha, type, area) {
      dispatch(changePullDownLoading(true));
      dispatch(changePageCount(0)); //属于重新获取数据
      if (category === '' && alpha === '') {
        dispatch(getHotSingerList());
      } else {
        dispatch(getSingerList(category, alpha, type, area));
      }
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Singers));
