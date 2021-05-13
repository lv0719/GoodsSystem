import React, {Component} from 'react';
import {Card, Select, Input, Button, Table, Tooltip ,message} from  'antd';
import { SearchOutlined ,PlusOutlined} from '@ant-design/icons';
import { reqProducts ,reqSearchList, reqUpdateStatus} from '../../../api/index'

/*该界面为product的主路由界面*/
const { Option } = Select;
const dataSource = [
    {
      key: '1',
      name: '胡彦斌',
      price: '2222',
      status: 0,
      desc: '奥里给好吃的很'
    },
    {
      key: '2',
      name: '胡彦祖',
      price: '5662',
      status: 1,
      desc: '兄弟们先报个头'
    },
    {
        key: '3',
        name: '胡彦祖',
        price: '5662',
        status: 1,
        desc: '兄弟们先报个头'
      },
      {
        key: '4',
        name: '胡彦祖',
        price: '5662',
        status: 1,
        desc: '兄弟们先报个头'
      },
      {
        key: '5',
        name: '胡彦祖',
        price: '5662',
        status: 1,
        desc: '兄弟们先报个头'
      },
      {
        key: '6',
        name: '胡彦祖',
        price: '5662',
        status: 1,
        desc: '兄弟们先报个头'
      },
      {
        key: '7',
        name: '胡彦祖',
        price: '5662',
        status: 1,
        desc: '兄弟们先报个头'
      },
  ];

const defautSize = 6;
export default class ProductHome extends Component{
    state = {
        products: [], 
        total:  0,  //返回数据总条数
        isTure: false , //请求加载
        searchType: 'productName',
        searchName: '',
      
    }
    initalColums =  () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
                key: 'name',
                align: 'center',
              },
              {
                title: '商品描述',
                dataIndex: 'desc',
                key: 'desc',
                align: 'center',
              },
              {
                title: '价格',
                dataIndex: 'price',
                key: 'price',
                align: 'center',
                render: (price) => '$'+price
              },
              {
                width: 100,
                title: '状态',
                // dataIndex: 'status',
                render: (product) => {
                  const {status, _id} = product
                  const newStatus = status===1 ? 2 : 1
                  return (
                    <span>
                      <Button
                        type='primary'
                        onClick={() => this.updateStatus(_id, newStatus)}
                      >
                        {status===1 ? '下架' : '上架'}
                      </Button>
                      <span>{status===1 ? '在售' : '已下架'}</span>
                    </span>
                  )
                }
              },
              {
                title: '操作',
                align: 'center',
                render: (product) => {
                    return (
                        <span>
                            <Button type='link' onClick={() => this.props.history.push('/product/detail',product)}>详情</Button>
                            <Button type='link' onClick={() => this.props.history.push('/product/add', product)}>修改</Button>
                        </span>
                    )
                }
              },
        ]
    }
    componentWillMount(){
        this.initalColums();
    }
    getProduct = async (pageNum) => { //获取商品
        this.pageNum = pageNum // 保存pageNum, 让其它方法可以看到
        let res;
        const {searchName ,searchType} = this.state;
        this.setState({
            isTure: true
        })
        if(searchName){ //说明需要搜索请求分页
            res =  await reqSearchList({pageNum, pageSize:defautSize, searchName , searchType});
        }else{
            res = await reqProducts(pageNum, defautSize);
        } 
        this.setState({
            isTure: false
        })
        if(res.status == 0){
            let {list,total} = res.data;
            this.setState({
                products: list,
                total: total
            })
        }
    }
    updateStatus = async (productId, status) => { //更新上下架状态
        const result = await reqUpdateStatus(productId, status)
        if(result.status===0) {
          message.success('更新商品成功')
          this.getProduct(this.pageNum)
        }
    }
    handleSelect = (value) =>{
        this.setState({
            searchType: value
        })
        console.log(value)
    }
    handleSearch = (e) =>{
        this.setState({
            searchName: e.target.value
        })
        console.log(e.target.value)
    }
    componentDidMount(){
        this.getProduct(1);
    }
    render(){
        const {products, total, searchType,isTure, searchName} = this.state;
        const title = (
            <span>
                <Select defaultValue={searchType} style={{ width: 120 }} onChange={this.handleSelect}>
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按分类搜索</Option>
                </Select>
                <Input onChange={this.handleSearch} placeholder="关键字" style={{width:150,margin:10}} value={searchName}></Input>
                <Tooltip title="search">
                    <Button type="primary" 
                        icon={<SearchOutlined />}  
                        style={{marginRight:10}}
                        onClick={() => this.getProduct(1)}
                    >搜索</Button>
                </Tooltip>
                
            </span>
        )
        const extra = ( 
            <span>
                <Tooltip title="newAdd">
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        onClick={() => this.props.history.push('/product/add')}
                >新增</Button>
                </Tooltip>
            </span>
        )
        
        return(
            <Card title= {title} extra = {extra}>
                <Table 
                    dataSource={products} 
                    columns={this.columns} 
                    bordered
                    pagination={{
                        current: this.pageNum,
                        defaultPageSize: defautSize,
                        showQuickJumper:true ,
                        total:total,
                        onChange: (pageNum) => this.getProduct(pageNum)
                    }}
                    loading={isTure}
                    
                />
            </Card>
        )
    }
} 