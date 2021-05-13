import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input
} from 'antd'

/*
添加分类的form组件
 */
class AddForm extends Component {
 
  static propTypes = {
    setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
  }
  addFormRef = React.createRef(); 
  componentWillMount () {
    this.props.setForm(this.addFormRef)
  }

  render() {
    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 },  // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }

    return (
      <Form
        name="add-form"
        {...formItemLayout}
        ref = {this.addFormRef}
      >
        <Form.Item 
            label="角色名称" name="roleName"
            rules={[{required: true, message: '角色名称必须输入'}]}
        >
            <Input type="text" placeholder="请输入角色名称" />
        </Form.Item>
      </Form>
    )
  }
}

export default AddForm