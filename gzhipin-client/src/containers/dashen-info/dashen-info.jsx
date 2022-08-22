/*
大神信息完善的路由容器组件
 */
import React, { Component } from 'react'
import {connect} from 'react-redux'
import { Redirect } from 'react-router-dom' 
import {NavBar, InputItem, TextareaItem, Button} from 'antd-mobile'
import HeaderSelector from '../../components/header-selector/header-selector'
import {updateUser} from '../../redux/actions'

class DashenInfo extends Component {

  state = {
    header: '',
    post: '',
    info: '',
}

// 更新header状态
setHeader = (header) => {
    this.setState({
        header
    })
} 

handleChange = (name, value) => {
    this.setState ({
        [name]: value
    }) 
}

save = () => {
  this.props.updateUser(this.state)
}
  render() {
    //如果信息已经完善 自动重定向到对应的主界面
    const {header, type} = this.props.user
    if(header){ //说明信息已经完善
        const path = type == 'dashen'? '/dashen' : 'laoban'
        return <Redirect to ={path}/>
    }

    return (
      <div>
        <NavBar>Dasshen info complete</NavBar>
        <HeaderSelector setHeader= {this.setHeader}/>
        <InputItem placeholder ='请输入求职岗位' onChange={val => {this.handleChange('post',val)}}>求职岗位：</InputItem>
        <TextareaItem title ="个人介绍：" 
                        row={3} onChange={val => {this.handleChange('info',val)}}/>
        <Button type = 'primary' onClick={this.save}> s&nbsp;a&nbsp;v&nbsp;e </Button>



      </div>
    )
  }
}

export default connect(
    state => ({user: state.user}),
    {updateUser}
)(DashenInfo)