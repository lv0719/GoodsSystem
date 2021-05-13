import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Select,
  Input
} from 'antd'

const Option = Select.Option

/*
添加/修改用户的form组件
 */
export default class UserForm extends PureComponent {

  static propTypes = {
    setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
    roles: PropTypes.array.isRequired,
    user: PropTypes.object
  }
  userFormRef = React.createRef();
  componentWillMount () {
    this.props.setForm(this.userFormRef)
  }
  componentDidMount() {
      const user = this.props.user;
      this.userFormRef.current.setFieldsValue({
        username: user.username,
        password: user.password,
        phone: user.phone,
        email: user.email,
        role_id: user.role_id
      })
  }
  render() {

    const {roles, user} = this.props
    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 },  // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }

    return (
      <Form 
        name="user-form"
        {...formItemLayout}
        ref = {this.userFormRef}
        >
        <Form.Item 
            label="用户名" name="username"
            rules={[{initialValue: user.username,}]}
        >
            <Input type="text" placeholder="请输入用户名" />
        </Form.Item>

        {
          user._id ? null : (
            <Form.Item 
            label="密码" name="password"
            rules={[{initialValue: user.password}]}
            >
            <Input type="password" placeholder="请输入密码" />
            </Form.Item>
          )
        }
        
        <Form.Item 
            label="手机号" name="phone"
            rules={[{initialValue: user.phone,}]}
        >
            <Input type="text" placeholder="请输入手机号" />
        </Form.Item>

        <Form.Item 
            label="邮箱" name="email"
            rules={[{initialValue: user.email}]}
        >
            <Input type="text" placeholder="请输入邮箱" />
        </Form.Item>

        <Form.Item 
            label="角色" name="role_id"
            rules={[{initialValue: user.role_id,}]}
        >
            <Select>
                {
                  roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                }
              </Select>
        </Form.Item>
      </Form>
    )
  }
}

