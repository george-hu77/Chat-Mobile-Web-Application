
//登陆路由组件

import React, { Component } from 'react'
import {NavBar,WingBlank, List, InputItem,WhiteSpace, Button} from 'antd-mobile'
import Logo from '../../components/logo/logo'
import {connect} from 'react-redux'
import { login } from '../../redux/actions'
import {Redirect} from 'react-router-dom'

class Login extends Component {
  state ={
    username:'', // 用户名
    password:'', // 密码
  }
  login = () => {
    this.props.login(this.state)
  }

  handleChange = (name, val) =>{
    this.setState({
        [name] : val // 属性名不是name, 而是name变量的值
    })
  }

  toRegister = ()=>{
    this.props.history.replace('/register')
  }

  render() {

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
                <Button type = 'primary' onClick={this.login}>Login</Button>
                <Button onClick={this.toRegister}>Newcomer?</Button>
            </List>
        </WingBlank>

        
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user}), 
  {login}
)(Login)
