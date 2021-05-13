
import React, {Component} from 'react'
import {Card,Form,Input,Cascader,Button,message} from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'; 
import { reqAddOrUpdateProduct ,queryCategoryList} from "../../../api/index";
import PicturesWall from './picures-wall'
import RichTextEditor from './rich-text-editor'
const { TextArea } = Input;

const options = [];
  const data = [
    {
        "parentId": "0",
        "_id": "5ca9d695b49ef916541160ba",
        "name": "家用电器",
        "_v" : "0"
    },
    {
        "parentId": "0",
        "_id": "5ca9d695b49ef916551160ba",
        "name": "电脑",
        "_v" : "0"
    },
    {
        "parentId": "0",
        "_id": "5ca9d695b49ef916541161ba",
        "name": "洗衣机",
        "_v" : "0"
    },
    {
        "parentId": "0",
        "_id": "5ca9d695b49ef916541162ba",
        "name": "电饭煲",
        "_v" : "0"
    },
    {
        "parentId": "0",
        "_id": "5ca9d695b49ef916541163ba",
        "name": "美铝",
        "_v" : "0"
    },
    {
        "parentId": "0",
        "_id": "5ca9d695b49ef916541113ba",
        "name": "美铝",
        "_v" : "0"
    },{
        "parentId": "0",
        "_id": "5ca9d695b49ef916341163ba",
        "name": "美铝",
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
    {
        "parentId": "0",
        "_id": "5ca9d695b49ef916551160ba",
        "name": "宾利飞度",
        "_v" : "0"
    },
    {
        "parentId": "0",
        "_id": "5ca9d695b49ef916541161ba",
        "name": "奔驰大G",
        "_v" : "0"
    },
    {
        "parentId": "0",
        "_id": "5ca9d695b49ef916541162ba",
        "name": "兰博基尼",
        "_v" : "0"
    },
    {
        "parentId": "0",
        "_id": "5ca9d695b49ef916541163ba",
        "name": "保时捷",
        "_v" : "0"
    },
    {
        "parentId": "0",
        "_id": "5ca9d695b49ef916541113ba",
        "name": "路虎揽胜",
        "_v" : "0"
    },{
        "parentId": "0",
        "_id": "5ca9d695b49ef916341163ba",
        "name": "长安汽车",
        "_v" : "0"
    },

  ];
/*该界面为product的添加界面*/
export default class ProductAdd extends Component{
    state = {
        options
    }
    addProductRef = React.createRef(); 
    pw = React.createRef(); 
    submitInfo = async () => { //提交成功发起新增请求
              // 1. 收集数据, 并封装成product对象
        const values = await this.addProductRef.current.validateFields();
        const {name, desc, price, detail} = values;
        const categoryIds = values.categoryIds;
        const imgs = this.pw.current.getImgs();
        let pCategoryId, categoryId;
        if (categoryIds.length===1) {
          pCategoryId = '0';
          categoryId = categoryIds[0];
        } else {
          pCategoryId = categoryIds[0];
          categoryId = categoryIds[1];
        }
        const product = {name, desc, price, imgs, detail, pCategoryId, categoryId};
        console.log(product);
        // 如果是更新, 需要添加_id
        if(this.isUpdate) {
          product._id = this.product._id;
        }
        // 2. 调用接口请求函数去添加/更新
        const result = await reqAddOrUpdateProduct(product)

        // 3. 根据结果提示
        if (result.status===0) {
          message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`)
          this.props.history.goBack()
        } else {
          message.error(`${this.isUpdate ? '更新' : '添加'}商品失败!`)
        }
    }
    clearInfo = () => {
        this.addProductRef.current.resetFields();
        message.success('清除数据成功');
    }
    validatePrice = (rule,value,callback) => { //验证输入金额格式是否正确
        if(value<0){
            callback('金额必须为为正数')
        }else{
            callback();
        }
    }
    handleAreaClick = (e, label, option) => {
        e.stopPropagation();
        console.log('clicked', label, option);
    }
      
    displayRender = (labels, selectedOptions) =>  //选中下一级列表函数
        labels.map((label, i) => {
            const option = selectedOptions[i]; 
            if (i === labels.length - 1) {
            return (
                <span key={option.value}>
                {label} (<a onClick={e => this.handleAreaClick(e, label, option)}>{option.value}</a>)
                </span>
            );
            }
            return <span key={option.value}>{label} / </span>;
    });
    loadData = async selectedOptions => {// 得到选择的option对象
        const targetOption = selectedOptions[0]
        // 显示loading
        targetOption.loading = true
    
        // 根据选中的分类, 请求获取二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value)
        // 隐藏loading
        targetOption.loading = false
        // 二级分类数组有数据
        if (subCategorys && subCategorys.length>0) {
          // 生成一个二级列表的options
          const childOptions = subCategorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: true
          }))
          // 关联到当前option上
          targetOption.children = childOptions
        } else { // 当前选中的分类没有二级分类
          targetOption.isLeaf = true
        }
    
        // 更新options状态
        this.setState({
          options: [...this.state.options],
        })
    }
    initOptions = async (categorys) => {// 根据categorys生成options数组
        const options = categorys.map(c => ({
          value: c._id,
          label: c.name,
          isLeaf: false, // 不是叶子
        }))
    
        //如果是一个二级分类商品的更新
        const {isUpdate, product} = this
        const {pCategoryId} = product || ''
        if(isUpdate && pCategoryId!=='0') {
          // 获取对应的二级分类列表
          const subCategorys = await this.getCategorys(pCategoryId) || []// 生成二级下拉列表的options
          const childOptions = subCategorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: true
          }))
    
          // 找到当前商品对应的一级option对象
          const targetOption = options.find(option => option.value===pCategoryId) || []
    
          // 关联对应的一级option上
          targetOption.children = childOptions || ''
        }
        // 更新options状态
        this.setState({
          options
        })
    }
    getCategorys = async (parentId) => {  //发起请求获取一级或二级列表数据
        const result = await queryCategoryList(parentId)   // {status: 0, data: categorys}
        if (result.status===0) {
          const categorys = result.data 
          // 如果是一级分类列表
          if (parentId==='0') {
            this.initOptions(categorys)
          } else { // 二级列表
            return categorys  // 返回二级列表 ==> 当前async函数返回的promsie就会成功且value为categorys
          }
        }

      
      }
      ininFormValue = () => { //点击修改赋值函数
        this.addProductRef.current.setFieldsValue({
            name: this.product.name,
            desc: this.product.desc,
            price: this.product.price,
            categoryIds: this.categoryIds,
            detail: '暂无'
        })
      }
     componentDidMount () {
        this.ininFormValue(); //表单赋值
        this.getCategorys('0')
     }
     componentWillMount () {
        // 取出携带的state
        const product = this.props.location.state  // 如果是添加没值, 否则有值
        this.isUpdate = !!product  // 作为判断是更新还是新增的依据
        this.product = product || {}
      }
   
    render(){
        const {isUpdate, product} = this
        const imgs = product.imgs || [];
        const detail = product.detail || [];
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 10},
        }
        const tailLayout = {
            wrapperCol: { offset: 8, span: 16 },
        };
        
        const categoryId = product.categoryId || '';
        const pCategoryId = product.pCategoryId || '';
        this.categoryIds = [] //用于接收分类ID的数组
        if(isUpdate) {  //反绑操作
          // 商品是一个一级分类的商品
          if(pCategoryId==='0') {
            this.categoryIds.push(categoryId)
          } else {
            // 商品是一个二级分类的商品
            this.categoryIds.push(pCategoryId)
            this.categoryIds.push(categoryId)
          }
          //this.ininFormValue();
        }
        const title = (
            <span>
                <Button 
                    type="text"
                    icon={<ArrowLeftOutlined />} 
                    style={{marginRight:10}}
                    onClick={() => this.props.history.goBack()} 
                >返回
                </Button>
                <span>{!isUpdate ? '新增详情': '修改详情'}</span>
            </span>
        )
        const {options} = this.state;
        return(
            <Card title={title} className='product-detail'>
                <Form
                    name="add-product-form"
                    {...formItemLayout}
                    ref = {this.addProductRef}
                >
                    <Form.Item label="商品名称" name="name"
                        rules={[{ required: true, message: '请输入商品名称' }]}
                    >
                    <Input type="text" placeholder="请输入商品名称" />
                    </Form.Item>
                    <Form.Item label="商品描述" name="desc"
                        rules={[{ required: true, message: '请输入商品描述' }]}
                    >
                    <TextArea placeholder="请输入商品描述" autosize rows={4} />
                    </Form.Item>
                    <Form.Item label="商品价格" name="price"
                        rules={[{ required: true, message: '请输入商品价格' },
                                {validator: this.validatePrice}
                        ]}
                    >
                    <Input type="number" placeholder="请输入商品价格" addonAfter='元'/>
                    </Form.Item>
                    <Form.Item label="商品分类" name="categoryIds"
                        rules={[{ required: true, message: '请输入商品分类' }]}
                    >
                    <Cascader
                        placeholder='请指定商品分类'
                        options={options}  /*需要显示的列表数据数组*/
                        loadData={this.loadData} /*当选择某个列表项, 加载下一级列表的监听回调*/
                        style={{ width: '100%' }}
                    />
                    </Form.Item>
                    <Form.Item label="商品图片" name="imgs"
                    >
                    <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Form.Item>
                    <Form.Item label="商品详情" name="detail"
                        rules={[{ required: true, message: '请输入商品详情' }]}
                    >
                    <TextArea placeholder="请输入商品描述" autosize rows={4} />
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit" onClick={this.submitInfo}>
                        提交
                        </Button>
                        <Button type="primary"  onClick={this.clearInfo} style={{marginLeft:10}}>
                        清除
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        )
    }
}