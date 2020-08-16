import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Slider from '../../components/slider';
import RecommendList from '../../components/list';
import Scroll from '../../baseUI/scroll';
import { Content } from './style';
import * as actionTypes from './store/actionCreators';
import { forceCheck } from 'react-lazyload';
import Loading from '../../baseUI/loading/index';

function Recommend(props) {
  const { bannerList, recommendList, enterLoading } = props;

  const { getBannerDataDispatch, getRecommendListDataDispatch } = props;

  useEffect(() => {
    // immutable数据结构中长度属性size
    if (!bannerList.size) {
      getBannerDataDispatch();
    }
    if (!recommendList.size) {
      getRecommendListDataDispatch();
    }
  }, []);

  const bannerListJS = bannerList ? bannerList.toJS() : [];
  const recommendListJS = recommendList ? recommendList.toJS() : [];

  return (
    <Content>
      <Scroll className='list' onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerListJS}></Slider>
          <RecommendList recommendList={recommendListJS}></RecommendList>
        </div>
      </Scroll>
      {enterLoading ? <Loading></Loading> : null}
    </Content>
  );
}

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  // map.getIn(['a','b','c']) is a shortcut to map.get('a').get('b').get('c')
  bannerList: state.getIn(['recommend', 'bannerList']),
  recommendList: state.getIn(['recommend', 'recommendList']),
  enterLoading: state.getIn(['recommend', 'enterLoading']),
});

// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    getBannerDataDispatch() {
      dispatch(actionTypes.getBannerList());
    },
    getRecommendListDataDispatch() {
      dispatch(actionTypes.getRecommendList());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Recommend));
