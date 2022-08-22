
//注册路由组件

import React, { Component } from 'react'
import {NavBar,WingBlank, List, InputItem,WhiteSpace, Radio, Button} from 'antd-mobile'
import {Redirect} from 'react-router-dom'
import Logo from '../../components/logo/logo'
import {connect} from 'react-redux'
import { register } from '../../redux/actions'

const ListItem = List.Item
class Register extends Component {
    state ={
        username:'', // 用户名
        password:'', // 密码
        password2:'', // 确认密码
        type:'Boss',  // 用户类型名称   dashen/laoban
      }
      // 点击注册调用
      register = () => {
       // console.log(this.state)
       this.props.register(this.state)
       
      }
      //处理输入数据的改变, 更新对应的状态
      handleChange = (name, val) =>{
        this.setState({
            [name] : val // 属性名不是name, 而是name变量的值
        })
      }
      toLogin = ()=>{
        this.props.history.replace('/login')
      }
  render() {
    const {type} = this.state
    const {msg, redirectTo} = this.props.user
    // 如果redirectTo有值, 就需要重定向到指定的路由
    if(redirectTo){
      return <Redirect to={redirectTo}/>
    }
    return (
      <div>
        <NavBar>硅&nbsp;谷&nbsp;直&nbsp;聘</NavBar> 
        <Logo></Logo>  
        <WingBlank>
            <List>
                {msg ? <div className='error-msg'>{msg}</div> : null}
                <WhiteSpace/>
                <InputItem placeholder='Please enter user name' onChange ={val =>{this.handleChange('username', val)}}>
                    User Name:
                </InputItem>
                <WhiteSpace/>
                <InputItem placeholder='Please enter code' type="password" onChange ={val =>{this.handleChange('password', val)}}>
                    Code:
                </InputItem>
                <WhiteSpace/>
                <InputItem  placeholder='Please confirm code' type="password2" onChange ={val =>{this.handleChange('password2', val)}}>
                    Confirm Code:
                </InputItem>
                <WhiteSpace/>
                <ListItem>
                    <span>User Type:</span>
                    &nbsp;&nbsp;
                    <Radio checked= {type === 'dashen'} onChange={() => this.handleChange('type', 'dashen')}>Expert</Radio>
                    &nbsp;&nbsp;
                    <Radio checked= {type === 'laoban'} onClick={() => this.handleChange('type', 'laoban')}>Boss</Radio>
                </ListItem>
                <WhiteSpace/>
                <Button type = 'primary'  onClick={this.register}>Register</Button>
                <Button onClick={this.toLogin}>Login to your Account</Button>
            </List>
        </WingBlank>

      </div>
    )
  }
}


export default connect(
  state => ({user: state.user}), 
  {register}
)(Register)
