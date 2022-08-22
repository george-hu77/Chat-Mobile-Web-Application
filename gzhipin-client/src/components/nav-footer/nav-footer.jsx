import React, { Component } from 'react'
import { TabBar } from 'antd-mobile'
import Proptypes from 'prop-types'
import {withRouter} from 'react-router-dom'
const Item = TabBar.Item

// 希望在非路由组件中使用路由库的api?
// withRoute()

class NavFooter extends Component {

    static Proptypes = {
        navList: Proptypes.array.isRequired,
        unReadCount: Proptypes.number.isRequired
    }

  render() {
    let {navList, unReadCount} = this.props
    // 过滤掉hide为true的nav
    navList = navList.filter(nav => !nav.hide)
    const path = this.props.location.pathname //请求的path
    return (
        <TabBar>
            {
                navList.map((nav,index) => (
                    <Item key={nav.path}
                            badge = {nav.path === '/message' ? unReadCount : 0}
                            title = {nav.text}
                            icon = {{uri: require(`./images/${nav.icon}.png`)}}
                            selectedIcon = {{uri: require(`./images/${nav.icon}-selected.png`)}}
                            seletct = {path === nav.path}
                            onPress ={() => this.props.history.replace(nav.path)}
                    ></Item>
                ))
            }
            
        </TabBar>
    )
  }
}


// 向外暴露withRouter()包装产生的组件
// 内部会向组件中传入一些路由组件特有的属性: history/location/math
export default withRouter(NavFooter)