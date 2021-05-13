import React, {Component} from 'react';
import {  Button, Table, Tag, Space , Pagination ,Card, message,Modal} from 'antd';
import { PlusOutlined ,ArrowRightOutlined} from '@ant-design/icons';
import { Form, Input ,Select } from 'antd';
import {queryCategoryList,queryAddList, queryUpdateList} from '../../api';
// import PropTypes from 'prop-types';
import './index.less';
/*该界面为商品分类界面*/


const { Option } = Select;
  const data = [
    {
        "parentId": "0",
        "_id": "5ca9d695b49ef916541160ba",
        "name": "家用电器",
        "_v" : "0"
    },
  ];
  const dataTwo = [
    {
        "parentId": "0",
        "_id": "5ca9d695b49ef916541160ba",
        "name": "劳斯莱斯",
        "_v" : "0"
    },
  ];

export default class Category extends Component{
    // static propTypes = {
    //     categoryName:  PropTypes.string.isRequired
    // }
    state={
        categoryData: [], // 一级分类列表 
        subCategoryData: [],// 二级分类列表  
        parentId: '0',// 父分类的 ID  
        parentName: '', /// 父分类的名称 
        loading: false,// 标识是否正在加载中 
        showStatus: 0,// 是否显示对话框  0: 都不显示, 1: 显示添加, 2: 显示更新
        isTure: false , //请求加载
    }
    addFormRef = React.createRef(); //class组件通过this.forRef来获取数据
    editFormRef = React.createRef();
    //cosnt [form] = Form.useForm(); //函数组件写法(获取表单数据)
    //查询列表数据
    getCategoryList = async (param) => { 
        this.setState({
            loading: true,
            isTure: true
        });
        param  = param || this.state.parentId;
        const result = await queryCategoryList(param);
        this.setState({
            loading: false,
            isTure: false
        });
        if(result.status === 0){
            const categoryData = result.data;
            if(param === '0'){
                this.setState({
                    categoryData
                });
            }else{
                this.setState({
                    subCategoryData: categoryData //接口开好以后恢复该行带代码
                    //subCategoryData: dataTwo   //接口开好以后删除该行代码
                });
            }
        }else{
            message.error('获取列表数据失败');
        }
        
    }
    //渲染一级列表
    showFirstList = () => {
        this.setState({
            parentId: '0',
            parentName: '', 
            subCategoryData: [], 
            showStatus: 0,
            confirmLoading: false ,
        })
    }
    //点击渲染二级列表数据
    showSecondList = (param) => {
        console.log(param)
        this.setState({
            parentId: param._id,
            parentName: param.name,
        },() => { //这是setState的回掉函数，会在状态更新后和render后执行
            this.getCategoryList();
        }
        )
        console.log(666)
    }
    //显示添加的弹出框
    showAdd = () => {
        this.setState({
            showStatus: 1,
        })
        setTimeout(() => {
            this.addFormRef.current.resetFields(); //每次打开新增窗口都清空弹出框数据
        },100)
    };
    //显示修改的弹出框
    showEdit = (category) => {
        this.category = category; //
        this.setState({
            showStatus: 2
        })
        setTimeout(() =>{  //用setTimeout的原因是防止在表格Form未加载完成时候调用其方法会报错。
            this.editFormRef.current.setFieldsValue({
                editInfoTwo: this.category.name
            });
        },100)
    }   

    //添加数据列表函数
    addCategoryList = async () => {
        const parentId  = this.values.nameone;
        const categoryName = this.values.nametwo;
        this.setState({
            showStatus: 0
        });
        const result = await queryAddList({categoryName, parentId});
        if(result.status == 0){
            if(parentId === this.state.parentId){
                this.getCategoryList();
            }else if(parentId === '0'){
                this.getCategoryList(parentId);
            }
            message.success('添加成功')
        }else{
            message.error('获取列表数据失败');
        }
    }

    //更新分类列表
    updataCategory = async () => {
        const categoryId = this.category._id;
        const categoryName = this.editValues.editInfoTwo;
        this.setState({
            showStatus: 0 ,
        });
        const result = await queryUpdateList({categoryId,categoryName});
        //$this.editFormRef.current.resetFields(); //清空弹出框数据
        if(result.status == 0){
            message.success('更新成功')
            this.getCategoryList();
        }else{
            message.error('更新失败');
        }
    }
    onShowSizeChange() { //当每页显示条数改变执行函数
        console.log(1)
    }
    onChange(){
        console.log('变')
    }
    handleAddOk = () => {  //新增弹窗点击ok时执行事件
        this.values = this.addFormRef.current.getFieldsValue();
        console.log(this.values);
        console.log(this.state.parentId)
        if(!this.values.nameone || !this.values.nametwo){
            message.info('请输入完成再点击保存')
            return 0
        }else{
            this.setState({
                confirmLoading: true,
              })
            this.addCategoryList(); //执行新增函数
            setTimeout(() => {
              this.setState({
                showStatus: 0,
                confirmLoading: false
              })
            }, 2000);
            return 0
        }
      };
    handleAddCancel =  () => { //新增弹窗点击cancle时执行事件
        this.addFormRef.current.resetFields();
        this.setState({
            showStatus: 0,
        })
    };
    handleEditOk = () => {
        this.editValues = this.editFormRef.current.getFieldsValue();
        if(this.editValues.editInfoTwo == ""){
           message.info('请输入分类名称哦，亲!');
           return 0
        }else{
            this.setState({
                confirmLoading: true,
            })
            this.updataCategory(); //调用更新函数
            this.editFormRef.current.resetFields(); //清空弹出框数据
            setTimeout(() => {
                this.setState({
                  showStatus: 0,
                  confirmLoading: false
                });
            }, 2000);
            return 0
        }
    };
    handleEditCancel= () => {  //编辑弹窗点击cancle时执行事件
        this.editFormRef.current.resetFields();
        this.setState({
            showStatus: 0,
        })
    };
    componentDidMount(){
        this.getCategoryList('0'); //查询一级分类列表数据
        // this.setState({
        //     categoryData:data //接口写好以后删除掉
        // });
    }
    componentWillMount(){
        this.columns = [
            {
              title: '分类名称',
              dataIndex: 'name',
              key: 'name',
              render: text => <a>{text}</a>,
            },
            {
              title: '操作',
              key: 'action',
              width: 400,
                render: (text, record) => (
                  <Space size="middle">
                      {/* 想给事件回掉函数传参数的话，可以在函数外面在包一层箭头函数*/}
                    <Button type="link" onClick={() => this.showEdit(record)}> 修改分类</Button>
                    {this.state.parentId == 0 ? <Button type="link" onClick={ () => this.showSecondList(record)}>查看子分类</Button> : null}
                  </Space>
                ),
              },
          ];
    }
    render(){ 
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
        }
        const {categoryData, parentId, isTure, showStatus, confirmLoading, subCategoryData, parentName} = this.state;
        const title = parentId == 0 ? <span>一级目录</span> :  (
            <span>
                <Button type="link" onClick={this.showFirstList}>一级分类列表</Button><ArrowRightOutlined />&nbsp;&nbsp;
                <span style={{fontSize:13, color: 'blue'}} >二级分类&nbsp;</span>:&nbsp;<span style={{fontSize:10, color: 'blue'}}>{parentName}</span>
            </span>
        );
        return(
            <div className="category">
                <div className="site-page-header-ghost-wrapper">
                    <Card title={title} extra={<Button onClick={this.showAdd} type="dashed" icon={<PlusOutlined />} >新增</Button>} >
                        <Table 
                            columns={this.columns} 
                            dataSource={parentId == 0 ? categoryData : subCategoryData} 
                            rowKey="_id"
                            pagination={{defaultPageSize: 6,showQuickJumper:true,position:['fixed','bottomCenter']}}
                            loading={isTure}
                        />  
                    </Card>
                    <Modal
                        title="新增"
                        visible={showStatus == 1 }
                        onOk={this.handleAddOk}
                        confirmLoading={confirmLoading}
                        onCancel={this.handleAddCancel}
                    >
                        <Form
                            name="add-info"
                            {...formItemLayout}
                            ref = {this.addFormRef}
                            initialValues = {{parentId}}
                            
                        >
                            <Form.Item label="所属分类" name="nameone"
                                rules={[{ required: true, message: '请选择所属分类哦' }]}
                            >
                            {/* <Input type="text" placeholder="请输入所属分类" /> */}
                            <Select placeholder="请选择">
                                    <Option value="0">一级分类</Option>
                                    {
                                        // data.map(item => <Option value={item._id}>{item.name}</Option>)
                                       categoryData.map(item => <Option value={item._id}>{item.name}</Option>)
                                    }
                            </Select>
                            </Form.Item>
                            <Form.Item label="分类名称" name="nametwo"
                                rules={[{ required: true, message: '请输入分类名称哦' }]}
                            >
                                <Input type="text" placeholder="请输入分类名称" />
                            </Form.Item>
                        </Form>
                    </Modal>
                    <Modal
                        title="编辑"
                        visible={showStatus == 2}
                        onOk={this.handleEditOk}
                        confirmLoading={confirmLoading}
                        onCancel={this.handleEditCancel}
                    >
                        <Form
                            name="add-info"
                            {...formItemLayout}
                            ref = {this.editFormRef}
                            initialValues={{ remember: true, }}
                        >
                            <Form.Item label="分类名称" name="editInfoTwo" 
                                rules={[{ required: true, message: '请输入分类名称哦' }]}
                            >
                                <Input type="text" placeholder="请输入分类名称" />
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
                <div className="pagination-bottom">
               
                </div>
            </div>
            
        )
    }
}