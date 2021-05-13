import React, {Component} from 'react';
import {Card, Button, List } from 'antd'
import {reqCategory} from '../../../api/index'
import { ArrowLeftOutlined } from '@ant-design/icons'; 
const Item = List.Item
const BASE_IMG_URL = 'http://localhost:5000/upload/' // 上传图片的基础路径
/*该界面为product的详情界面*/
export default class ProductDetail extends Component{
    state = {
        cName1: '', // 一级分类名称
        cName2: '', // 二级分类名称
    }
    async componentDidMount () {

        // 得到当前商品的分类ID
        const {pCategoryId, categoryId} = this.props.location.state
        if(pCategoryId==='0') { // 一级分类下的商品
          const result = await reqCategory(categoryId)
          const cName1 = result.data.name
          this.setState({cName1})
        } else { // 二级分类下的商品
          // 一次性发送多个请求, 只有都成功了, 才正常处理
          const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
          const cName1 = results[0].data.name
          const cName2 = results[1].data.name
          this.setState({
            cName1,
            cName2
          })
        }
    
    }
    render(){
        const {name, desc, price,imgs} = this.props.location.state
        const {cName1, cName2} = this.state
        const title = (
            <span>
                <Button 
                    type="text"
                    icon={<ArrowLeftOutlined />} 
                    style={{marginRight:10}}
                    onClick={() => this.props.history.goBack()} 
                >返回
                </Button>
                <span>商品详情</span>
            </span>
        )
        return(
            <Card title={title} className='product-detail'>
                <List>
                <Item>
                    <span className="left">商品名称:</span>
                    <span>{name}</span>
                </Item>
                <Item>
                    <span className="left">商品描述:</span>
                    <span>{desc}</span>
                </Item>
                <Item>
                    <span className="left">商品价格:</span>
                    <span>{price}元</span>
                </Item>
                <Item>
                    <span className="left">所属分类:</span>
                    <span>{cName1} {cName2 ? ' --> '+cName2 : ''}</span>
                </Item>
                <Item>
                    <span className="left">商品图片:</span>
                    <span>
                    {
                        imgs.map(img => (
                                <img
                                    key={img}
                                    src={BASE_IMG_URL + img}
                                    className="product-img"
                                    alt="img"
                                />
                        ))
                    }
                    </span>
                </Item>
                <Item>
                    <span className="left">商品详情:</span>
                    <span>暂无</span>
                    {/* <span dangerouslySetInnerHTML={{__html: detail}}>
                    </span> */}
                </Item>

                </List>
            </Card>
        )
    }
}